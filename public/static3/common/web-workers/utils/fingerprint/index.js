importScripts('./utils/fingerprint/fingerprintjs@4.4.1.exp.js')

// ATTENTION! Global deps: fpjs, ceaserCipher, clsx, log

const FingerprintSingleton = class _FingerprintSingleton {
  constructor () {
    this.platform = fpjs.sources.platform()
    this.timezone = fpjs.sources.timezone()
    this.appName = fpjs.sources.appName()
    this.appCodeName = fpjs.sources.appCodeName()
    this.appVersion = fpjs.sources.appVersion()
    this.isGecko = fpjs.isGecko()
    this.isDesktopWebKit = fpjs.isDesktopWebKit()
    this.isChromium = fpjs.isChromium()
    this.userAgent = fpjs.sources.userAgent()
    this.product = fpjs.sources.product()
    this.language = fpjs.sources.language()
  }
  static getInstance(ps) {
    if (!this.instance) this.instance = new _FingerprintSingleton(ps)
    return this.instance
  }

  __encrypted(str) {
    return ceaserCipher.encrypt(str)
  }
  __descrypted(str) {
    return ceaserCipher.decrypt(str)
  }

  get __uniqueClientKeyOriginal() {
    return clsx([
      this.platform,
      this.appName,
      this.appCodeName,
      this.appVersion,
      `isGecko:${Number(this.isGecko)}`,
      `isDesktopWebKit:${Number(this.isDesktopWebKit)}`,
      `isChromium:${Number(this.isChromium)}`,
      this.userAgent,
      this.product,
      this.language,
      this.timezone,
    ].join('//')).replace(/\s/g, '_')
  }
  get uniqueClientKeyEncrypted() {
    return this.__encrypted(this.__uniqueClientKeyOriginal)
  }
  get uniqueClientKeyDescrypted() {
    return this.__descrypted(this.uniqueClientKeyEncrypted)
  }
  get __isEncryptedClientKeyCorrect() {
    return this.__uniqueClientKeyOriginal === this.uniqueClientKeyDescrypted
  }
  get uniqueClientKey() {
    // return this.__isEncryptedClientKeyCorrect
    //   ? this.uniqueClientKeyEncrypted
    //   : this.__uniqueClientKeyOriginal
    return this.__uniqueClientKeyOriginal
  }

  __checkItOut() {
    try {
      log({ label: 'fingerprint', msgs: [
        this.__encrypted('helloworld'),
        this.__descrypted('khoorzruog'),
        Number(this.isGecko),
        Number(this.isChromium),
        this.__uniqueClientKeyOriginal,
        this.uniqueClientKeyEncrypted,
        this.uniqueClientKeyEncrypted,
        this.__isEncryptedClientKeyCorrect,
      ] })
    } catch (err) {
      console.warn(err)
    }
  }
}

var fingerprint = FingerprintSingleton.getInstance()

// fingerprint.__checkItOut()
