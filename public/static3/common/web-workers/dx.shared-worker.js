const t0 = performance.now()
const tsT0 = new Date().getTime()
const _perfInfo = {
  tsList: [
    {
      descr: '[sw]: SharedWorker loaded',
      p: t0,
      ts: tsT0,
      name: 'SharedWorker загружен',
      // NOTE: Optional
      // data?: { input: { metrixEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV; stateValue: string; } } | any;
    },
  ]
}

importScripts('./utils/gu.js')
importScripts('./utils/event/types.js')
importScripts('./utils/event/eValidator.js')
importScripts('./utils/debug/cfg.js')
importScripts('./utils/debug/log.js')
// importScripts('./utils/debug/debug.js')
importScripts('./utils/socket/rootSubscribers.js')
importScripts('./utils/socket/mws/withCustomEmitters.js')
importScripts('./utils/socket/socket.io-client@4.7.2.min.js')

var window = self
// const _isAnyDebugEnabled = Object.values(dbg).some((v) => v.isEnabled)
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
  _perfInfo.tsList.push({ descr: '[sw:init]: selfListenersInit called', p: t1, ts: tsT1, name: 'Инициализация обработчиков SharedWorker' })

  if (dbg.swState.isEnabled) log({ label: '⚪ SharedWorker loaded...' })

  self.addEventListener(NES.SharedWorker.Native.ESelf.CONNECT, function(e) {
    _perfInfo.tsList.push({
      descr: `[sw:self:listener-setup]: init listener for "${NES.SharedWorker.Native.ESelf.CONNECT}"`,
      p: performance.now(),
      ts: new Date().getTime(),
      name: 'SharedWorker подключен к клиенту',
    })
    if (dbg.swState.isEnabled) log({ label: '🟡 Client connected to SharedWorker' })
    // port = e.ports[0] // NOTE: or port = e.source
    port = e.source
    connectionsCounter++
  
    port.addEventListener(NES.SharedWorker.Native.EPort.MESSAGE, function(e) {
      //  - TODO: New events only
      if (!!e.data && !!e.data.input && !!e.data.input.stateValue) {
        if (_perfInfo.tsList.length > 1 && !!_perfInfo.tsList[_perfInfo.tsList.length - 1].data) {
          if (e.data.input.stateValue === _perfInfo.tsList[_perfInfo.tsList.length - 1].data.stateValue) {
            if (dbg.workerEvs.fromClient.isEnabled) log({
              label: `⛔ Event ${e.__eType} blocked | Предыдущий stateValue с тем же именем: ${e.data.input.stateValue}`,
              msgs: [e.data],
            })
            return
          }
        }
      }
      // -

      // NOTE: Each event (x2 cache memory)
      // _perfInfo.tsList.push({
      //   descr: `c->[sw:port:listener-setup]: init listener for "${NES.SharedWorker.Native.EPort.MESSAGE}"`,
      //   p: performance.now(),
      //   ts: new Date().getTime(),
      //   data: e.data,
      //   name: 'Порт отловил сообщение от клиента',
      // })

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
          label: `⛔ Event ${e.__eType} blocked |${!!validationResult.reason ? ` ${validationResult.reason}` : ''} ${socket.connected ? '✅' : '⭕'}`,
          msgs: [e.input, validationResult],
        })
        return
      }
      // --

      if (dbg.workerEvs.fromClient.isEnabled) log({
        label: `message received SharedWorker receive evt by client ${socket.connected ? '✅' : '⭕'}`,
        msgs: [e.data],
      })

      switch (e.data.__eType) {
        case NES.SharedWorker.Custom.EType.CLIENT_TO_WORKER_DIE:
          self.close() // NOTE: terminates ...
          break
        case NES.Custom.EType.CLIENT_TO_WORKER_RESET_HISTORY:
          const [loadReport] = _perfInfo.tsList
          _perfInfo.tsList = [
            loadReport, {
              descr: 'c->[sw]: SharedWorker history reset',
              p: performance.now(),
              ts: new Date().getTime(),
              name: 'Сброс истории SharedWorker',
            },
          ]
          port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RESET_HISTORY_OK, data: {  tsList: _perfInfo.tsList } })
          break
        default: {
          const {
            data: {
              // __eType,
              input,
            }
          } = e
    
          if (!!input?.metrixEventType) {
            _perfInfo.tsList.push({
              descr: `c->[sw:port:listener:metrixEventType]->s: ${input.metrixEventType}`,
              p: performance.now(),
              ts: new Date().getTime(),
              data: e.data,
              name: 'SharedWorker получил ивент мертики для отправки на сервер',
            })

            // -- NOTE: Middlewares section
            withCustomEmitters({
              eventData: e.data,
              socket,
            })
            // --
          }
          break
        } 
      }
    }, false)
  
    port.start()
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
      name: `SharedWorker отхватил ошибку: ${e?.data?.message || 'No e.data.message'}`,
    })
    log({ label: 'error in SharedWorker', msgs: [e.data] })
  })

  rootSubscribers({
    socket,
    options: {
      [NES.Socket.ENative.CONNECT]: function () {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket подключен' })
        if (dbg.socketState.isEnabled) log({ label: '🟢 Socket connected', msgs: ['no event'] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONN })
      },
      [NES.Socket.ENative.CONNECT_ERROR]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket в ошибке' })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket connection errored', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONNN_ERR })
      },
      [NES.Socket.ENative.RECONNECT]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket переподключен' })
        if (dbg.socketState.isEnabled) log({ label: '🔵 Socket reconnected', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RECONN })
      },
      [NES.Socket.ENative.RECONNECT_ATTEMPT]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket пытается переподключиться' })
        if (dbg.socketState.isEnabled) log({ label: '🟡 Socket trying to reconnect...', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_TRY_TO_RECONN })
      },
      [NES.Socket.ENative.DISCONNECT]: function (e) {
        _perfInfo.tsList.push({
          descr: `[sock-nat]: ${NES.Socket.ENative.DISCONNECT}`,
          p: performance.now(),
          ts: new Date().getTime(),
          name: 'Socket отключен',
        })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket disconnected', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_DISCONN, ...e, })
      },
      // [NES.Socket.Metrix.EClientIncoming.LAB_TEST]: function (e) {
      //   _perfInfo.tsList.push({
      //     descr: `[sock-cus]<-s: ${NES.Socket.Metrix.EClientIncoming.LAB_TEST}`,
      //     p: performance.now(),
      //     ts: new Date().getTime(),
      //     data: { ...e },
      //     name: 'Socket получил данные',
      //   })
      //   if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket received response by server', msgs: [e] })
      //   port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e })
      // },
      [NES.Socket.Metrix.EClientIncoming.SP_MX_EV]: function (e) {
        const { yourData: { _wService, ...restYourData }, ...rest } = e
        const dataForMemory = { yourData: restYourData, ...rest }
        _perfInfo.tsList.push({
          descr: `[sock-cus:sp-mx-ev]<-s: ${NES.Socket.Metrix.EClientIncoming.SP_MX_EV}`,
          p: performance.now(),
          ts: new Date().getTime(),
          data: dataForMemory,
          name: 'Socket получил данные',
        })
        if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket receive sp-mx event from server', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e })
      },
      [NES.Socket.ECustom.DONT_RECONNECT]: function(e) {
        const { yourData: { _wService, ...restYourData }, ...rest } = e
        const dataForMemory = { yourData: restYourData, ...rest }
        _perfInfo.tsList.push({
          descr: `[sock-cus:dont-reconn]<-s: ${NES.Socket.ECustom.DONT_RECONNECT}`,
          p: performance.now(),
          ts: new Date().getTime(),
          data: dataForMemory,
          name: 'Socket will not be reconnected',
        })
        if (dbg.workerEvs.fromServer.isEnabled) log({ label: '🚫 Socket receive custom decline event from server', msgs: [e] })
        socket.io.reconnectionAttempts(0)
      },
    },
  })
})({ self })
