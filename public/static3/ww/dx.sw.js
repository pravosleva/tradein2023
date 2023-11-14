const t0 = performance.now()
const tsT0 = new Date().getTime()
const _perfInfo = {
  tsList: [
    {
      descr: '[sw]: SW init',
      p: t0,
      ts: tsT0,
      name: 'Начало загрузки SW',
      // NOTE: Optional
      // data?: { input: { metrixEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV; stateValue: string; } } | any;
    },
  ]
}

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

let connectionsCounter = 0
let port // TODO? var ports = new Map()

(async function selfListenersInit({ self }) {
  const t1 = performance.now()
  const tsT1 = new Date().getTime()
  _perfInfo.tsList.push({ descr: '[sw]: selfListenersInit', p: t1, ts: tsT1, label: 'Инициализация обработчиков SW' })

  if (dbg.swState.isEnabled) log({ label: '⚪ SharedWorker loaded...' })

  self.addEventListener(NES.SharedWorker.Native.ESelf.CONNECT, function(e) {
    _perfInfo.tsList.push({
      descr: `[sw:listener] self listener: ${NES.SharedWorker.Native.ESelf.CONNECT}`,
      p: performance.now(),
      ts: new Date().getTime(),
      name: 'SW подключен к клиенту',
    })
    if (dbg.swState.isEnabled) log({ label: '🟡 Client connected to SharedWorker' })
    // port = e.ports[0] // NOTE: or port = e.source
    port = e.source
    connectionsCounter++
  
    port.addEventListener(NES.SharedWorker.Native.EPort.MESSAGE, function(e) {
      // const isNew = _perfInfo.tsList[_perfInfo.tsList.length - 1].descr === e.data.
      // if () 
      _perfInfo.tsList.push({
        descr: `c->[sw:port:listener]: ${NES.SharedWorker.Native.EPort.MESSAGE}`,
        p: performance.now(),
        ts: new Date().getTime(),
        data: e.data,
        name: 'Порт отловил сообщение от клиента',
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
                case !val:
                  result.ok = false
                  result.reason = 'Value type should not be empty'
                  break
                case !Object.values(NES.Custom.EType).includes(val):
                  result.ok = false
                  result.reason = 'Double check the unknown event, plz'
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
        if (dbg.workerEvs.fromClient.isEnabled) log({
          label: `⛔ Event ${e.__eType} blocked |${!!validationResult.reason ? ` ${validationResult.reason} |` : ''} socket.connected: ${socket.connected}`,
          msgs: [e.input, validationResult],
        })
        return
      }
      // --

      if (dbg.workerEvs.fromClient.isEnabled) log({
        label: `message received SharedWorker receive evt by client | socket.connected: ${socket.connected}`,
        msgs: [e.data],
      })

      switch (e.data.__eType) {
        case NES.SharedWorker.Custom.EType.CLIENT_TO_WORKER_DIE:
          self.close() // NOTE: terminates ...
          break
        case NES.Custom.EType.CLIENT_TO_WORKER_RESET_HISTORY:
          const [loadReort] = _perfInfo.tsList
          _perfInfo.tsList = [
            loadReort, {
              descr: 'c->[sw]: SW history reset',
              p: performance.now(),
              ts: new Date().getTime(),
              name: 'Сброс истории SW',
            },
          ]
          port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RESET_HISTORY_OK, data: {  tsList: _perfInfo.tsList } })
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
              descr: `c->[sw:port:listener:metrixEventType]->s: ${input.metrixEventType}`,
              p: performance.now(),
              ts: new Date().getTime(),
              data: e.data,
              name: 'SW Получил ивент мертики для отправки на сервер',
            })
            
            socket.emit(input.metrixEventType, {
              ...input,
              _wService: {
                _perfInfo,
              },
            }, (r) => {
              log({ label: 'c->sw:port:listener:metrixEventType->s->[cb]', msgs: [r] })
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
      descr: `[sw:err]: ${e?.data?.message || 'No e.data.message'}`,
      p: performance.now(),
      ts: new Date().getTime(),
      data: { ...e },
      name: `SW отхватил ошибку: ${e?.data?.message || 'No e.data.message'}`,
    })
    log({ label: 'error in SharedWorker', msgs: [e.data] })
  })
  
  // -- NOTE: Socket
  socket.on(NES.Socket.ENative.CONNECT, function () {
    _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket подключен' })
    if (dbg.socketState.isEnabled) log({ label: '🟢 Socket connected' })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONN })
  })

  socket.on(NES.Socket.ENative.CONNECT_ERROR, function (e) {
    _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket в ошибке' })
    if (dbg.socketState.isEnabled) log({ label: '🔴 Socket connection errored', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONNN_ERR })
  })

  socket.on(NES.Socket.ENative.RECONNECT, function (e) {
    _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket переподключен' })
    if (dbg.socketState.isEnabled) log({ label: '🔵 Socket reconnected', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RECONN })
  })

  socket.on(NES.Socket.ENative.RECONNECT_ATTEMPT, function (e) {
    _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket пытается переподключиться' })
    if (dbg.socketState.isEnabled) log({ label: '🟡 Socket trying to reconnect...', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_TRY_TO_RECONN })
  })

  // socket.on(NES.Socket.Metrix.EClientIncoming.LAB_TEST, function (e) {
  //   _perfInfo.tsList.push({
  //     descr: `[sock-cus]<-s: ${NES.Socket.Metrix.EClientIncoming.LAB_TEST}`,
  //     p: performance.now(),
  //     ts: new Date().getTime(),
  //     data: { ...e },
  //     name: 'Socket получил данные',
  //   })
  //   if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket received response by server', msgs: [e] })
  //   port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e })
  // })
  socket.on(NES.Socket.Metrix.EClientIncoming.SP_MX_EV, function (e) {
    _perfInfo.tsList.push({
      descr: `[sock-cus:sp-mx-ev]<-s: ${NES.Socket.Metrix.EClientIncoming.SP_MX_EV}`,
      p: performance.now(),
      ts: new Date().getTime(),
      data: { ...e },
      name: 'Socket получил данные',
    })
    if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket received response from server', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e })
  })
  
  socket.on(NES.Socket.ENative.DISCONNECT, function (e) {
    _perfInfo.tsList.push({
      descr: `[sock-nat]: ${NES.Socket.ENative.DISCONNECT}`,
      p: performance.now(),
      ts: new Date().getTime(),
      name: 'Socket отключен',
    })
    if (dbg.socketState.isEnabled) log({ label: '🔴 Socket disconnected', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_DISCONN, ...e, })
  })
  // --
})({ self })
