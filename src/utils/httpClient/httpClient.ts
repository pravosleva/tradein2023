/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { CancelTokenSource } from 'axios'
import { getRandomString, getRandomValue } from '~/utils/aux-ops'
import { NSP } from './types'
import { API, TAPIProps } from './API'
import { responseValidate, NResponseValidate } from './utils'

// const createCancelTokenSource = () => axios.CancelToken.source()
const isDev = process.env.NODE_ENV === 'development'
const isLocalProd = import.meta.env.VITE_LOCAL_PROD === '1'

class Singleton extends API {
  private static instance: Singleton
  _devPollingKey: string
  sendIMEICancelTokenSource: CancelTokenSource
  checkPhoneCancelTokenSource: CancelTokenSource
  getPhotoLinkCancelTokenSource: CancelTokenSource
  checkPhotoStateCancelTokenSource: CancelTokenSource
  sendContractCancelTokenSource: CancelTokenSource
  getUserDataCancelTokenSource: CancelTokenSource
  // axiosInstance: AxiosInstance

  private constructor(ps: TAPIProps) {
    super(ps)
    this._devPollingKey = getRandomString(5)
    this.sendIMEICancelTokenSource = axios.CancelToken.source()
    this.checkPhoneCancelTokenSource = axios.CancelToken.source()
    this.getPhotoLinkCancelTokenSource = axios.CancelToken.source()
    this.checkPhotoStateCancelTokenSource = axios.CancelToken.source()
    this.sendContractCancelTokenSource = axios.CancelToken.source()
    this.getUserDataCancelTokenSource = axios.CancelToken.source()
  }
  public static getInstance(ps: TAPIProps): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton(ps)

    return Singleton.instance
  }

  async sendIMEI({
    IMEI,
    // mts_tradein_mode,
    rules,
  }: {
    rules?: NResponseValidate.TRules<NSP.TImeiResponse>;
    IMEI: string;
    // mts_tradein_mode: EAppModeMenu1;
    kz_2022?: boolean;
  }): Promise<NSP.TImeiResponse | NSP.TStandartMinimalResponse> {
    if (!IMEI) return Promise.reject({ ok: false, message: 'Заполните IMEI' })

    this.sendIMEICancelTokenSource.cancel('axios request canceled')
    this.sendIMEICancelTokenSource = axios.CancelToken.source()

    const postData = {
      IMEI,
      // kz_2022: true,
      // mts_tradein_mode,
    }
    // @ts-ignore
    if (isDev || isLocalProd) postData._add_data = {
      phone: {
        // color: 'cardinal_red',
        color: '',
        memory: '512 GB',

        vendor: 'Samsung',
        model: 'Galaxy S22',
        
        // vendor: 'Apple',
        // model: 'iPhone 12 Pro',
      },
      photo: 'models/samsung/galaxy-s22/01.jpg',
      // photo: 'models/apple/iphone-12-pro/color_graphite_01.jpg',

      // ok: false,
      // message: 'FRONT tst',

      // -- NOTE: Extra final step testing
      // go_to_final_step: true,
      // condition: getRandomValue({ items: ['C', 'D', 'NC'] }),
      // condition_limit_reason: 'no_defects',
      // --
    }

    const data = await this.api({
      url: '/partner_api/tradein/imei',
      method: 'POST',
      data: postData,
      cancelToken: this.sendIMEICancelTokenSource.token,
    })
      .then((r) => r)
      .catch((r) => r)

    this.sendIMEICancelTokenSource.cancel('axios request done')

    // switch (true) {
    //   case !!responseValidator:
    //     // console.log('-- this case', responseValidator({ res: data }))
    //     // @ts-ignore
    //     return responseValidator({ res: data }) ? Promise.resolve(data || altResult) : Promise.reject(data)
    //   default:
    //     return data.ok ? Promise.resolve(data) : Promise.reject(data)
    // }

    switch (true) {
      case data?.ok && !!rules: {
        // @ts-ignore
        const responseValidateResult = responseValidate<NSP.TImeiResponse>({ rules, response: data })
        return responseValidateResult.ok ? Promise.resolve({ ...data, ...responseValidateResult }) : Promise.reject(responseValidateResult)
      }
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async checkPhone({ IMEI, memory, color, responseValidator }: {
    IMEI: string;
    memory: string;
    color: string;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TCheckPhoneResponse | NSP.TStandartMinimalResponse> {
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
        // @ts-ignore
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async getPhotoLink({ tradeinId, responseValidator }: {
    tradeinId: number;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TPhotoLinkResponse | NSP.TStandartMinimalResponse> {
    // TODO:
    // if (!IMEI) return Promise.reject({ ok: false, message: 'Заполните IMEI' })

    this.getPhotoLinkCancelTokenSource.cancel('axios request canceled')
    this.getPhotoLinkCancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/photo/link',
      method: 'POST',
      data: {
        id: tradeinId,
        // _add_data: {
        //   ok: false,
        //   message: 'FRONT tst 2',
        // },
      },
      cancelToken: this.getPhotoLinkCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)
    
    this.getPhotoLinkCancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // @ts-ignore
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async checkPhotoState({
    tradeinId,
    responseValidator,
  }: {
    tradeinId: number;
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TPhotoLinkResponse | NSP.TStandartMinimalResponse> {
    this.checkPhotoStateCancelTokenSource.cancel('axios request canceled')
    this.checkPhotoStateCancelTokenSource = axios.CancelToken.source()

    const inputData: {
      id: number;
      _odd_scenario?: any;
      _add_data?: any;
    } = {
      id: tradeinId,
    }
    if (isDev || isLocalProd) {
      inputData._odd_scenario = {
        status: {
          // NOTE: status -> not_checked will be set by default
          ok: 10,
          // bad_quality: 10,
        },
        started: 5, // NOTE: started -> true
        success: 1, // NOTE: ok -> true
        uniquePollingKey: this._devPollingKey,
      }
      inputData._add_data = {
        // photo_states: { front: { state: 'bad_quality' }, back: { state: 'bad_quality' } },
        // photo_states: { front: { state: 'not_checked' }, back: { state: 'not_checked' } },
        condition: getRandomValue({ items: ['C', 'D', 'NC'] }), // NOTE: C|D|NC; Если прислать 'works', таблица крашится (https://t.ringeo.ru/issue/IT-3411#focus=Comments-4-10056.0-0)
        condition_limit_reason: 'no_defects',

        // started: true,
        // status: 'fake',
      }
      // NOTE: No subsidies case
      // if (!!window.proxiedState.imeiStep.__response)
      //   window.proxiedState.imeiStep.__response.possible_subsidies = []
    }

    // -- TODO: Add data from url?
    // const query = parse_query_string(window.location.search.substring(1))
    // const userid = query.user
    // const sign = query.sign
    // const timestamp = query.timestamp
    // if (!!sign) {
    //   data.sign = sign
    //   data.timestamp = timestamp
    //   data.user = userid
    // }
    // --

    const data = await this.api({
      url: '/partner_api/photo/status',
      method: 'POST',
      data: inputData,
      cancelToken: this.checkPhotoStateCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)

    this.checkPhotoStateCancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // @ts-ignore
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async sendContractData({
    tradeinId,
    form,
    responseValidator,
  }: {
    tradeinId: number;
    form: {
      [key: string]: any;
    };
    responseValidator?: ({ res }: { res: any }) => boolean;
  }): Promise<NSP.TStandartMinimalResponse> {
    this.sendContractCancelTokenSource.cancel('axios request canceled')
    this.sendContractCancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/tradein/client/data',
      method: 'POST',
      data: { id: tradeinId, form },
      cancelToken: this.sendContractCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)

    this.sendContractCancelTokenSource.cancel('axios request done')

    switch (true) {
      case !!responseValidator:
        // @ts-ignore
        return responseValidator({ res: data }) ? Promise.resolve(data) : Promise.reject(data)
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }

  async getUserData({ rules }: {
    rules?: NResponseValidate.TRules<NSP.TUserDataResponse | NSP.TStandartMinimalResponse>;
  }): Promise<NSP.TUserDataResponse | NSP.TStandartMinimalResponse> {
    this.getUserDataCancelTokenSource.cancel('axios request canceled')
    this.getUserDataCancelTokenSource = axios.CancelToken.source()

    const data = await this.api({
      url: '/partner_api/tradein/me',
      method: 'POST',
      data: {
        _addData: {
          user_data : {
            display_name: 'Developer',
          },
          features: {
            country_code: 'RU',
            // smartwatch_allowed: true,
          },
          // ok: false,
          // message: 'Hello fuckup tetsting',
        },
      },
      cancelToken: this.getUserDataCancelTokenSource.token
    })
      .then((r) => r)
      .catch((r) => r)

    this.getUserDataCancelTokenSource.cancel('axios request done')

    switch (true) {
      case data?.ok && !!rules: {
        // @ts-ignore
        const responseValidateResult = responseValidate<NSP.TUserDataResponse>({ rules, response: data })
        return responseValidateResult.ok ? Promise.resolve({ ...data, ...responseValidateResult }) : Promise.reject(responseValidateResult)
      }
      default:
        return data.ok ? Promise.resolve(data) : Promise.reject(data)
    }
  }
}

export const httpClient = Singleton.getInstance({ isDebugEnabled: false })
