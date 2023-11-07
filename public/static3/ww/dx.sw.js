const t0 = performance.now()
const tsT0 = new Date().getTime()
const _perfInfo = {
  tsList: [
    {
      ts: tsT0,
      descr: '[sw]: SharedWorker init',
      p: t0,
      label: 'Начало загрузки SharedWorker',
      // NOTE: Optional
      // data?: any;
    },
  ]
}

importScripts('./u/_t.js')
importScripts('./u/s-tools/socket.io-client@4.7.2.min.js')
importScripts('./u/gu.js')
importScripts('./u/ev/evs.js')
importScripts('./u/ev/val.js')
importScripts('./u/dbg/cfg.js')
importScripts('./u/dbg/log.js')

var window = self
const _isDebugEnabled = Object.values(dbg).some((v) => v.isEnabled)

window.io = io

const socket = io.connect(gu(), {
  withCredentials: true,
  extraHeaders: { 'my-custom-header': 'value' },
})

var connectionsCounter = 0
var port // var ports = new Map()

(async function selfListenersInit({ self }) {
  const t1 = performance.now()
  const tsT1 = new Date().getTime()
  _perfInfo.tsList.push({ ts: tsT1, descr: '[sw]: selfListenersInit', p: t1, label: 'Инициализация обработчиков SharedWorker' })

  var log = ({ label, msgs }) => {
    switch (true) {
      case !_isDebugEnabled:
      case !label:
        return
      case !!msgs && Array.isArray(msgs) && msgs.length > 0:
      case _perfInfo.tsList.length > 0:
        console.groupCollapsed(`---/ww/dx.sw: ${label}`)
        if (!!msgs) for (const msg of msgs) console.log(msg)
        console.log(_perfInfo)
        console.groupEnd()
        break
      default:
        break
    }
  }
  
  if (dbg.swState.isEnabled) log({ label: '⚪ SharedWorker loaded...' })

  self.addEventListener(NES.SharedWorker.Native.ESelf.CONNECT, function(e) {
    _perfInfo.tsList.push({
      ts: new Date().getTime(),
      descr: `[sw-listener] self listener: ${NES.SharedWorker.Native.ESelf.CONNECT}`,
      p: performance.now(),
      label: 'SharedWorker подключен к клиенту',
    })
    if (dbg.swState.isEnabled) log({ label: '🟡 client connected to SharedWorker' })
    // port = e.ports[0] // NOTE: or port = e.source
    port = e.source
    connectionsCounter++
  
    port.addEventListener(NES.SharedWorker.Native.EPort.MESSAGE, function(e) {
      _perfInfo.tsList.push({
        ts: new Date().getTime(),
        p: performance.now(),
        descr: `c->[sw-port-listener]: ${NES.SharedWorker.Native.EPort.MESSAGE}`,
        data: e.data,
        label: 'Порт отловил сообщение от клиента',
      })
      // -- NOTE: We can validate all events from client to worker...
      const validationResult = eValidator({
        event: e.data,
        rules: {
          __eType: {
            type: 'string',
            descr: 'Action type',
            isRequired: true,
            validate: (val) => {
              const result = { ok: true }
              switch (true) {
                case typeof val !== 'string':
                  result.ok = false
                  result.reason = 'Value type should be a string'
                  break
                case !!val:
                  result.ok = false
                  result.reason = 'Value type should not be empty'
                  break
                case !Object.values(NES.Custom.EType).includes(val):
                  result.ok = false
                  result.reason = 'Double check the unknown value, plz'
                  break
                default:
                  break
              }
              return result
            },
          }
        },
      })
      if (!validationResult.ok) {
        log({
          label: `⛔ Event ${e.__eType} blocked |${!!validationResult.reason ? ` ${validationResult.reason} |` : ''} socket.connected: ${socket.connected}`,
          msgs: [e.input, validationResult],
        })
        return
      }
      // --

      if (dbg.swState.isEnabled) log({
        label: `message received by SharedWorker | socket.connected: ${socket.connected}`,
        msgs: [e.data],
      })

      switch (e.data.__eType) {
        case NES.SharedWorker.Custom.EType.CLIENT_TO_WORKER_DIE:
          self.close() // NOTE: terminates ...
          break
        default: {
          const {
            data: {
              // eType,
              input,
            }
          } = e
    
          if (!!input?.metrixEventType) {
            _perfInfo.tsList.push({
              ts: new Date().getTime(),
              descr: `c->[sw:port-listener:metrixEventType]->s: ${input.metrixEventType}`,
              p: performance.now(),
              data: e.data,
              label: 'SharedWorker Получил ивент мертики для отправки на сервер',
            })
            socket.emit(input.metrixEventType, input, (r) => {
              log({ label: 'c->[sw:port-listener:metrixEventType]->s: cb', msgs: [r] })
            })
          }
        }
          break
      }
    }, false)
  
    port.start();
    // NOTE: https://developer.mozilla.org/ru/docs/Web/API/SharedWorker
    // необходимо при добавлении обработчиков с помощью addEventListener.
    // При использовании сеттера port.onmessage, данный метод вызывается автоматически, неявно
  }, false)
  self.addEventListener(NES.SharedWorker.Native.ESelf.ERROR, function(e) {
    _perfInfo.tsList.push({
      ts: new Date().getTime(),
      descr: `[sw err]: ${e?.data?.message || 'No e.data.message'}`,
      p: performance.now(),
      data: { ...e },
      label: `SharedWorker отхватил ошибку: ${e?.data?.message || 'No e.data.message'}`,
    })
    log({ label: 'error in SharedWorker', msgs: [e.data] })
  })
  
  // -- NOTE: Socket
  socket.on(NES.Socket.ENative.CONNECT, function () {
    _perfInfo.tsList.push({ ts: new Date().getTime(), descr: `[socket-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), label: 'Socket подключен' })
    if (dbg.socketState.isEnabled) log({ label: '[socket-nat] 🟢 connected' })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_CONNECTED })
  })

  socket.on(NES.Socket.ENative.CONNECT_ERROR, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), descr: `[socket-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), label: 'Socket в ошибке' })
    if (dbg.socketState.isEnabled) log({ label: '🔴 connection errored', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_CONNECTION_ERRORED })
  })

  socket.on(NES.Socket.ENative.RECONNECT, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), descr: `[socket-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), label: 'Socket переподключен' })
    if (dbg.socketState.isEnabled) log({ label: '🔵 reconnected', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_RECONNECTED })
  })

  socket.on(NES.Socket.ENative.RECONNECT_ATTEMPT, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), descr: `[socket-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), label: 'Socket пытается переподключиться' })
    if (dbg.socketState.isEnabled) log({ label: '🟡 try to reconnect...', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_TRYING_TO_RECONNECT })
  })

  socket.on(NES.Socket.Metrix.EClientIncoming.LAB_TEST, function (e) {
    _perfInfo.tsList.push({
      ts: new Date().getTime(),
      descr: `[socket-cust]<-s: ${NES.Socket.Metrix.EClientIncoming.LAB_TEST}`,
      p: performance.now(),
      data: { ...e },
      label: 'Socket получил данные',
    })
    if (dbg.socketState.isEnabled || dbg.evsFromServerToWorker.isEnabled) log({ label: '⚡ socket: SharedWorker received response by server', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_DATA, ...e })
  })
  
  socket.on(NES.Socket.ENative.DISCONNECT, function (e) {
    _perfInfo.tsList.push({
      ts: new Date().getTime(),
      descr: `[socket-nat]: ${NES.Socket.ENative.DISCONNECT}`,
      p: performance.now(),
      label: 'Socket отключен',
    })
    if (dbg.socketState.isEnabled) log({ label: '🔴 socket: disconnected', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_DISCONNECTED, ...e, })
  })
  // --
})({ self })
