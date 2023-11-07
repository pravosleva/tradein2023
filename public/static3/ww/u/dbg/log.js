// NOTE: Attention!
// _perfInfo, _isDebugEnabled is global for this.

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