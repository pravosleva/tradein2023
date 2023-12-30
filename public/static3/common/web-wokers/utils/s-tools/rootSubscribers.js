importScripts('./utils/s-tools/mws/withLNativeSubscribers.js')

const compose = (fns, arg) => {
  return fns.reduce(
    (acc, fn) => {
      fn(arg)
      acc += 1
      return acc
    },
    0
  )
}

const rootSubscribers = (arg) => compose([
  withLNativeSubscribers,

  // -- NOTE: For example
  // ({ socket, options }) => {
  //   socket.on(NES.Socket.Metrix.EClientIncoming.SP_MX_EV, (data) => {
  //     console.log(data)
  //   })
  // },
  // --

  // TODO: etc.
], arg)
