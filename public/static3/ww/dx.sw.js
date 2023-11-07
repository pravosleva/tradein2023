const t0 = performance.now()
const tsT0 = new Date().getTime()

const _perfInfo = {
  tsList: [
    { ts: tsT0, p: t0, descr: 'Начало загрузки SharedWorker' },
  ]
}

importScripts('./u/_t.js')
importScripts('./u/s-tools/socket.io-client@4.7.2.min.js')
importScripts('./u/gu.js')
importScripts('./u/ev/evs.js')
importScripts('./u/ev/val.js')

var window = self
const isDebugEnabled = true
// TODO:
const debug = {
  evsFromClientToWorker: {
    isEnabled: true,
  },
  evsFromWorkerToClient: {
    isEnabled: true,
  },
  evsFromServerToWorker: {
    isEnabled: true,
  },
}

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
  _perfInfo.tsList.push({ ts: tsT1, p: t1, descr: 'selfListenersInit' })

  var log = ({ label, msgs }) => {
    if (!isDebugEnabled) return
    if (!label) return
    if (!!msgs && Array.isArray(msgs) && msgs.length > 0) {
      console.groupCollapsed(`---/ww/dx.sw: ${label}`)
      for (const msg of msgs) console.log(msg)
      console.log(_perfInfo)
      console.groupEnd()
    } else {
      console.log(label)
    }
  }
  
  log({ label: '⚪ SharedWorker loaded...' })

  self.addEventListener(NES.SharedWorker.Native.ESelf.CONNECT, function(e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: NES.SharedWorker.Native.ESelf.CONNECT })
    log({ label: '🟡 client connected to SharedWorker' })
    // port = e.ports[0] // NOTE: or port = e.source
    port = e.source
    connectionsCounter++
  
    port.addEventListener(NES.SharedWorker.Native.EPort.MESSAGE, function(e) {
      _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: NES.SharedWorker.Native.EPort.MESSAGE })
      // -- NOTE: We can validate all events from client to worker...
      const validationResult = eValidator({
        event: e.data,
        rules: {
          __eType: {
            type: 'string',
            descr: 'Event (action) type',
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
          label: `⛔ Event ${e.__eType} blocked |${!!validationResult.reason ? ` ${validationResult.reason},` : ''} socket.connected: ${socket.connected}`,
          msgs: [
            e.input,
            validationResult,
          ],
        })
        return
      }
      // --

      log({
        label: `client-SW: message received by SharedWorker, socket.connected: ${socket.connected}`,
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
            _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: input.metrixEventType })
            socket.emit(input.metrixEventType, input, (r) => {
              log({ label: 'cb on server', msgs: [r] })
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
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `SW ERR: ${e?.data?.message || 'No e.data.message'}` })
    log({
      label: 'error in SharedWorker',
      msgs: [e.data],
    })
  })
  
  // -- NOTE: Socket
  socket.on(NES.Socket.ENative.CONNECT, function () {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.CONNECT}` })
    log({ label: '🟢 socket: connected' })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_CONNECTED })
  })

  socket.on(NES.Socket.ENative.CONNECT_ERROR, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.CONNECT_ERROR}` })
    log({ label: '🔴 socket: connection errored', msgs: [e] })
  })

  socket.on(NES.Socket.ENative.RECONNECT, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.RECONNECT}` })
    log({ label: '🔵 socket: reconnected', msgs: [e] })
  })

  socket.on(NES.Socket.ENative.RECONNECT_ATTEMPT, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.RECONNECT_ATTEMPT}` })
    log({ label: '🟡 socket: try to reconnect...', msgs: [e] })
  })

  socket.on(NES.Socket.Metrix.EClientIncoming.LAB_TEST, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.LAB_TEST}` })
    log({ label: '⚡ socket: SharedWorker received response by server', msgs: [e] })
    port.postMessage({ __eType: 'w-c:socket-data', ...e })
  })
  
  socket.on(NES.Socket.ENative.DISCONNECT, function (e) {
    _perfInfo.tsList.push({ ts: new Date().getTime(), p: performance.now(), descr: `socket native: ${NES.Socket.ENative.DISCONNECT}` })
    log({ label: '🔴 socket: disconnected', msgs: [e] })
    port.postMessage({ __eType: NES.Custom.EType.WORKER_TO_CLIENT_SOCKET_DISCONNECTED, ...e, })
  })
  // --
})({ self })
