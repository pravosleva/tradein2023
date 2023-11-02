/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { CancelTokenSource } from 'axios'
import { TStandartData } from './types'
import { Api } from './Api'

// const createCancelTokenSource = () => axios.CancelToken.source()

class Singleton extends Api {
  private static instance: Singleton
  sendIMEICancelTokenSource: CancelTokenSource
  // axiosInstance: AxiosInstance

  private constructor() {
    super()
    this.sendIMEICancelTokenSource = axios.CancelToken.source()
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()

    return Singleton.instance
  }

  async sendIMEI({ IMEI, responseValidator }: {
    IMEI: string;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<TStandartData> {
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
}

export const httpClient = Singleton.getInstance()
