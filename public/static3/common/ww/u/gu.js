// NOTE: Remember! Full path regarding main file (dx.sw.js for example)
importScripts('./u/xcaesar/src.js')

const ceaserCipher = XCaesar({ shift: 3, alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:/.' })
const gu = () => ceaserCipher.decrypt('zvvabbsudyrvohydcsur')