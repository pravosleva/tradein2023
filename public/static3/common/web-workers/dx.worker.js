const t0 = performance.now()
const tsT0 = new Date().getTime()
const _perfInfo = {
  tsList: [
    {
      descr: '[w]: Worker loaded',
      p: t0,
      ts: tsT0,
      name: 'Worker загружен',
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

var window = self;
window.io = io;

const socket = io.connect(gu(), {
  withCredentials: true,
  extraHeaders: { 'my-custom-header': 'value' },
});

let connectionsCounter = 0;

const isNewNativeEvent = ({ newCode: n, prevCode: p }) => {
  if (!p) return true
  const ignoresEvsAsDedoup = [
    `[sock-nat]: ${NES.Socket.ENative.CONNECT}`,
    `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`,
    `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`,
    `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`,
    `[sock-nat]: ${NES.Socket.ENative.DISCONNECT}`,
  ]

  if (ignoresEvsAsDedoup.includes(n) && n === p) return false
  else return true
}

(function selfListenersInit({ self }) {
  self.onmessage = (e) => {
    if (!e) return;

    //  - TODO: New events only
    // if (!!e.data && !!e.data.input && !!e.data.input.stateValue) {
    //   if (_perfInfo.tsList.length > 1 && !!_perfInfo.tsList[_perfInfo.tsList.length - 1].data) {
    //     if (e.data.input.stateValue === _perfInfo.tsList[_perfInfo.tsList.length - 1].data.stateValue) {
    //       if (dbg.workerEvs.fromClient.isEnabled) log({
    //         label: `⛔ Event ${e.__eType} blocked | Предыдущий stateValue с тем же именем: ${e.data.input.stateValue}`,
    //         msgs: [e.data],
    //       })
    //       return
    //     }
    //   }
    // }
    // -

    // NOTE: Each event (x2 cache memory)
    // _perfInfo.tsList.push({
    //   descr: `c->[w:listener]: ${NES.Worker.ENative.MESSAGE}`,
    //   p: performance.now(),
    //   ts: new Date().getTime(),
    //   data: e.data,
    //   name: 'Worker отловил сообщение от клиента',
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

    if (dbg.workerEvs.fromClient.isEnabled) log({
      label: `message received SharedWorker take evt by client ${socket.connected ? '✅' : '⭕'}`,
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
            descr: 'c->[w]: Worker history reset',
            p: performance.now(),
            ts: new Date().getTime(),
            name: 'Сброс истории Worker',
          },
        ]
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RESET_HISTORY_OK, data: { tsList: _perfInfo.tsList } })
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
            name: 'Worker Получил ивент от клиента для отправки на сервер',
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
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket подключен' })
        if (dbg.socketState.isEnabled) log({ label: '🟢 Socket connected', msgs: ['no event'] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONN })
      },
      [NES.Socket.ENative.CONNECT_ERROR]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket в ошибке' })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket connection errored', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONNN_ERR })
      },
      [NES.Socket.ENative.RECONNECT]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket переподключен' })
        if (dbg.socketState.isEnabled) log({ label: '🔵 Socket reconnected', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RECONN })
      },
      [NES.Socket.ENative.RECONNECT_ATTEMPT]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket пытается переподключиться' })
        if (dbg.socketState.isEnabled) log({ label: '🟡 Socket trying to reconnect...', msgs: [e] })
        self.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_TRY_TO_RECONN })
      },
      [NES.Socket.ENative.DISCONNECT]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.DISCONNECT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({
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
