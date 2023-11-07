importScripts('./utils/tst.js')
importScripts('./utils/s-tools/socket.io-client@4.7.2.min.js')

var window = self

window.io = io

// console.log(typeof io)
const socket = io('wss://pravosleva.pro', {
  withCredentials: true,
  extraHeaders: { 'my-custom-header': 'value' },
})

// TODO:
// const validateEvent = ({ event, rules }) => {}

self.onmessage = ($evt) => {
  if (!$evt) return;

  const t0 = performance.now()

  let output = {
    ok: false,
    // message?: str
    yourData: $evt.data.input,
    result: null,
  }
  switch ($evt.data.type) {
    case 'local-action:tst':

      socket.emit('lab:client:tst-action', $evt.data.input, (data) => {
        console.log(data)
      })
      output.ok = true
      output.message = 'hello world from /static3/ww/*'
      output.result = tst(1)
      break
    // NOTE: Others...
    default:
      output.ok = false
      output.message = 'ERR: Unknown case in /static3/ww/*'
      break
  }

  const t1 = performance.now()

  self.postMessage({ output, perf: t1 - t0, type: $evt.data.type })
}
