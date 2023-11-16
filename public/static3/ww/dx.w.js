const t0 = performance.now()
const tsT0 = new Date().getTime()
const _perfInfo = {
  tsList: [
    {
      descr: '[w]: W init',
      p: t0,
      ts: tsT0,
      name: 'Начало загрузки W',
      // NOTE: Optional
      // data?: { input: { metrixEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV; stateValue: string; } } | any;
    },
  ]
}

importScripts('./u/gu.js')
importScripts('./u/ev/evs.js')
importScripts('./u/ev/val.js')
importScripts('./u/dbg/cfg.js')
importScripts('./u/dbg/log.js')
importScripts('./u/s-tools/rootSubscribers.js')
importScripts('./u/s-tools/mws/withCustomEmitters.js')
importScripts('./u/s-tools/socket.io-client@4.7.2.min.js')

console.log(typeof io.connect)

var window = self;
window.io = io;

const socket = io.connect(gu(), {
  withCredentials: true,
  extraHeaders: { 'my-custom-header': 'value' },
});

let connectionsCounter = 0;

(function selfListenersInit({ self }) {
  self.onmessage = (e) => {
    if (!e) return;

    _perfInfo.tsList.push({
      descr: `c->[w:listener]: ${NES.Worker.ENative.MESSAGE}`,
      p: performance.now(),
      ts: new Date().getTime(),
      data: e.data,
      name: 'W отловил сообщение от клиента',
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
        label: `⛔ Event ${e.__eType} blocked |${!!validationResult.reason ? ` ${validationResult.reason}` : ''} ${socket.connected ? '✅' : '⭕'}`,
        msgs: [e.input, validationResult],
      })
      return
    }

    if (dbg.workerEvs.fromClient.isEnabled) log({
      label: `message received SharedWorker receive evt by client ${socket.connected ? '✅' : '⭕'}`,
      msgs: [e.data],
    })

    switch (e.data.__eType) {
      case NES.Worker.Custom.EType.CLIENT_TO_WORKER_DIE:
        self.close() // NOTE: terminates ...
        break
      case NES.Custom.EType.CLIENT_TO_WORKER_RESET_HISTORY:
        const [loadReport] = _perfInfo.tsList
        _perfInfo.tsList = [
          loadReport, {
            descr: 'c->[w]: SW history reset',
            p: performance.now(),
            ts: new Date().getTime(),
            name: 'Сброс истории W',
          },
        ]
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RESET_HISTORY_OK, data: {  tsList: _perfInfo.tsList } })
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
            descr: `c->[w:listener:metrixEventType]->s: ${input.metrixEventType}`,
            p: performance.now(),
            ts: new Date().getTime(),
            data: e.data,
            name: 'SW Получил ивент мертики для отправки на сервер',
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

    // const t1 = performance.now()

    // self.postMessage({ output, perf: t1 - t0, type: e.data.type })
  }

  rootSubscribers({
    socket,
    options: {
      [NES.Socket.ENative.CONNECT]: function () {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket подключен' })
        if (dbg.socketState.isEnabled) log({ label: '🟢 Socket connected' })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONN })
      },
      [NES.Socket.ENative.CONNECT_ERROR]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket в ошибке' })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket connection errored', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONNN_ERR })
      },
      [NES.Socket.ENative.RECONNECT]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket переподключен' })
        if (dbg.socketState.isEnabled) log({ label: '🔵 Socket reconnected', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RECONN })
      },
      [NES.Socket.ENative.RECONNECT_ATTEMPT]: function (e) {
        _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket пытается переподключиться' })
        if (dbg.socketState.isEnabled) log({ label: '🟡 Socket trying to reconnect...', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_TRY_TO_RECONN })
      },
      [NES.Socket.ENative.DISCONNECT]: function (e) {
        _perfInfo.tsList.push({
          descr: `[sock-nat]: ${NES.Socket.ENative.DISCONNECT}`,
          p: performance.now(),
          ts: new Date().getTime(),
          name: 'Socket отключен',
        })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket disconnected', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_DISCONN, ...e, })
      },
      [NES.Socket.Metrix.EClientIncoming.SP_MX_EV]: function (e) {
        const {
          yourData: {
            _wService,
            ...restYourData
          },
          ...rest
        } = e
        const dataForMemory = {
          yourData: {
            ...restYourData
          },
          ...rest
        }
        _perfInfo.tsList.push({
          descr: `[sock-cus:sp-mx-ev]<-s: ${NES.Socket.Metrix.EClientIncoming.SP_MX_EV}`,
          p: performance.now(),
          ts: new Date().getTime(),
          data: dataForMemory,
          name: 'Socket получил данные',
        })
        if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket received response from server', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e })
      },
    },
  })
})({ self })
