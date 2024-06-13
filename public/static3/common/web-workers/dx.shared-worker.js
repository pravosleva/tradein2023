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

importScripts('./utils/clsx.js')
importScripts('./utils/gu.js')
importScripts('./utils/event/types.js')
importScripts('./utils/event/eValidator.js')
importScripts('./utils/debug/cfg.js')
importScripts('./utils/debug/log.js')
// importScripts('./utils/debug/debug.js')
importScripts('./utils/socket/rootSubscribers.js')
importScripts('./utils/socket/mws/withCustomEmitters.js')
importScripts('./utils/socket/socket.io-client@4.7.2.min.js')
importScripts('./utils/fingerprint/index.js')

var window = self
// const _isAnyDebugEnabled = Object.values(dbg).some((v) => v.isEnabled)
window.io = io

const socket = io.connect(gu(), {
  withCredentials: true,
  extraHeaders: { 'my-custom-header': 'value' },
})

let connectionsCounter = 0
let port // TODO? var ports = new Map()

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
                  result.reason = `Double check the unknown event, plz // Possible __eType events: ${Object.values(NES.Custom.EType).join(', ')}`
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
          label: `⛔ Event ${e.__eType} blocked |${!!validationResult?.reason ? ` ${validationResult.reason}` : ''} ${socket.connected ? '✅' : '⭕'}`,
          msgs: [e.input, validationResult],
        })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, message: `Shared Worker incoming event validate is not Ok: ${validationResult?.reason || 'No reason'}`, code: 'ui_message_danger' })
        return
      } else
        if (dbg.workerEvs.fromClient.isEnabled) port.postMessage({
          __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA,
          message: `Shared Worker validated new __eType event: ${e.data.__eType}`,
          code: 'ui_message_success',
        })
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
          port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RESET_HISTORY_OK, data: { tsList: _perfInfo.tsList } })
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
              eventData: {
                ...(e.data || {}),
                // specialClientKey: fingerprint.uniqueClientKey,
              },
              socket,
              _cb: ({ eventData, _message }) => {
                const { __eType, ...restData } = eventData
                if (dbg.workerEvs.fromClient.isEnabled) {
                  if (!!_message) port.postMessage({
                    __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA,
                    message: `withCustomEmitters _cb: ${_message}`,
                    code: 'ui_message_info',
                  })
                  port.postMessage({
                    __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA,
                    message: `Ok: ${restData.input.metrixEventType}`,
                    code: 'ui_message_info',
                  })
                }
              },
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
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket подключен' })
        if (dbg.socketState.isEnabled) log({ label: '🟢 Socket connected', msgs: ['no event', dbg] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONN })
      },
      [NES.Socket.ENative.CONNECT_ERROR]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.CONNECT_ERROR}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket в ошибке' })
        if (dbg.socketState.isEnabled) log({ label: '🔴 Socket connection errored', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_CONNN_ERR })
      },
      [NES.Socket.ENative.RECONNECT]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket переподключен' })
        if (dbg.socketState.isEnabled) log({ label: '🔵 Socket reconnected', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_RECONN })
      },
      [NES.Socket.ENative.RECONNECT_ATTEMPT]: function (e) {
        if (isNewNativeEvent({
          newCode: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`,
          prevCode: !!_perfInfo.tsList.length > 1 ? _perfInfo.tsList[_perfInfo.tsList.length - 1].descr : undefined,
        })) _perfInfo.tsList.push({ descr: `[sock-nat]: ${NES.Socket.ENative.RECONNECT_ATTEMPT}`, p: performance.now(), ts: new Date().getTime(), name: 'Socket пытается переподключиться' })
        if (dbg.socketState.isEnabled) log({ label: '🟡 Socket trying to reconnect...', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_TRY_TO_RECONN })
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
      // -- NOTE: New report exp
      [NES.Socket.Metrix.EClientIncoming.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK]: function (e) {
        // const { message, result, yourData } = e
        const dataForMemory = e
        _perfInfo.tsList.push({
          descr: `[sock-cus:sp-rep-res]<-s:ok: ${NES.Socket.Metrix.EClientIncoming.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK}`,
          p: performance.now(),
          ts: new Date().getTime(),
          data: dataForMemory,
          name: 'Socket получил данные (ok)',
        })
        if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket receive sp-report-answer:ok event from server', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e, code: 'ui_message_success' })
      },
      [NES.Socket.Metrix.EClientIncoming.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR]: function (e) {
        // const { message, result, yourData } = e
        const dataForMemory = e
        _perfInfo.tsList.push({
          descr: `[sock-cus:sp-rep-res]<-s:err: ${NES.Socket.Metrix.EClientIncoming.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR}`,
          p: performance.now(),
          ts: new Date().getTime(),
          data: dataForMemory,
          name: 'Socket получил данные (err)',
        })
        if (dbg.workerEvs.fromServer.isEnabled) log({ label: '⚡ Socket receive sp-report-answer:err event from server', msgs: [e] })
        port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_REMOTE_DATA, ...e, code: 'ui_message_danger' })
      },
      // --
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
