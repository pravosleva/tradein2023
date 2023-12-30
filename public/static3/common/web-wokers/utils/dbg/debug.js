var debug = ({ color, label, msg }) => {
  switch (true) {
    case !label:
      return
    case !!msg:
      console.debug.apply(console, [`%c${label}`, `background: ${color}; color: white; padding: 0px 3px; border-radius: 4px; font-size: 0.8em;`, msg])
    default:
      break
  }
}
