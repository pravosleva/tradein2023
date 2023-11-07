importScripts('./u/xcaesar/src.js')
// importScripts('./u/xcaesar/_t.js')

const ceaserCipher = XCaesar({ shift: 3, alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:/.' })
const gu = () => ceaserCipher.decrypt('zvvabbsudyrvohydcsur')
