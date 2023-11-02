/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { CancelTokenSource } from 'axios'
import { NSP } from './types'
import { Api } from './Api'

// const createCancelTokenSource = () => axios.CancelToken.source()

class Singleton extends Api {
  private static instance: Singleton
  sendIMEICancelTokenSource: CancelTokenSource
  checkPhoneCancelTokenSource: CancelTokenSource
  getPhotoLinkCancelTokenSource: CancelTokenSource
  // axiosInstance: AxiosInstance

  private constructor() {
    super()
    this.sendIMEICancelTokenSource = axios.CancelToken.source()
    this.checkPhoneCancelTokenSource = axios.CancelToken.source()
    this.getPhotoLinkCancelTokenSource = axios.CancelToken.source()
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()

    return Singleton.instance
  }

  async sendIMEI({ IMEI, responseValidator }: {
    IMEI: string;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TImeiResponse> {
    if (!IMEI) return Promise.reject({ ok: false, message: 'Заполните IMEI' })

    this.sendIMEICancelTokenSource.cancel('axios request canceled')
    this.sendIMEICancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/tradein/imei',
      method: 'POST',
      data: { IMEI },
      cancelToken: this.sendIMEICancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)
    
    this.sendIMEICancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // console.log('-- this case', responseValidator({ res: data }))
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async checkPhone({ IMEI, memory, color, responseValidator }: {
    IMEI: string;
    memory: string;
    color: string;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TCheckPhoneResponse> {
    // TODO:
    // if (!IMEI) return Promise.reject({ ok: false, message: 'Заполните IMEI' })

    this.checkPhoneCancelTokenSource.cancel('axios request canceled')
    this.checkPhoneCancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/tradein/phone/check',
      method: 'POST',
      data: { IMEI, memory, color },
      cancelToken: this.checkPhoneCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)
    
    this.checkPhoneCancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // console.log('-- this case', responseValidator({ res: data }))
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async getPhotoLink({ tradeinId, responseValidator }: {
    tradeinId: string;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TPhotoLinkResponse> {
    // TODO:
    // if (!IMEI) return Promise.reject({ ok: false, message: 'Заполните IMEI' })

    this.getPhotoLinkCancelTokenSource.cancel('axios request canceled')
    this.getPhotoLinkCancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/photo/link',
      method: 'POST',
      data: { id: tradeinId },
      cancelToken: this.getPhotoLinkCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)
    
    this.getPhotoLinkCancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // console.log('-- this case', responseValidator({ res: data }))
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }

  }
}

export const httpClient = Singleton.getInstance()
