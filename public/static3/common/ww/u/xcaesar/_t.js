const _ceaserCipherExp = XCaesar({ shift: 3, alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:/.' })

console.log('-xcaesar tst')
// const _original
const _encrypted = _ceaserCipherExp.encrypt(_original)
console.log(_encrypted)
console.log('-')
