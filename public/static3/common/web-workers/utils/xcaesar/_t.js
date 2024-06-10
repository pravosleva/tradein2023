const _ceaserCipherExp = XCaesar({ shift: 3, alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:/.' })

console.log('-xcaesar tst')
const _original = 'tst'
// const _encrypted = _ceaserCipherExp.encrypt(_original)
// console.log(_encrypted)

const encrypted = 'zvvabbsudyrvohydcsur'
console.log(`encrypted: ${encrypted} -> ${_ceaserCipherExp.decrypt(encrypted)}`)
console.log('-')
