/* eslint-disable @typescript-eslint/no-explicit-any */
import { proxy } from 'valtio'
import { NSP } from '~/utils/httpClient'
import { TReqStateCode, TRequestDetailsInfo } from '~/utils/httpClient/API'
import { getRandomString, mutateObject } from '~/utils/aux-ops'
import clsx from 'clsx'
import { groupLog } from '~/utils'
import { initialStepMachineContextFormat, initialContractFormState } from './xstate/stepMachine/initialState'
import { TStepMachineContextFormat, TContractForm, EStep } from './xstate/stepMachine/types'
import pkg from '../../package.json'

const defaultXHRState = {
  total: {
    pending: 0,
    rejected_req: 0,
    rejected_res: 0,
    fulfilled: 0,
  },
  state: {},
}

class Singleton {
  private static instance: Singleton
  private _stepMachineState: TStepMachineContextFormat
  private _contractFormState: TContractForm
  private _contractFormLastEditedFieldInfo: {
    name: string | null;
  }
  private _common: {
    stateValue: EStep | null;
    appVersion: string;
    devtools: {
      isUIEnabled: boolean;
      network: {
        xhr: {
          total: {
            [key in TReqStateCode]: number;
          };
          state: {
            [key: string]: { // NOTE: url as key
              [key: string]: { // NOTE: ts as key
                code: TReqStateCode;
                __details?: TRequestDetailsInfo;
              };
            };
          };
        };
      };
    };
  }
  public uniquePageLoadKey: string;
  public uniqueUserDataLoadKey: string;
  // NOTE: Etc. 1/4

  private constructor() {
    this.uniquePageLoadKey = getRandomString(5)
    this.uniqueUserDataLoadKey = ''
    this._stepMachineState = proxy(initialStepMachineContextFormat)
    this._contractFormState = proxy(initialContractFormState)
    this._contractFormLastEditedFieldInfo = proxy({
      name: null,
    })
    this._common = proxy({
      stateValue: null,
      appVersion: pkg.version,
      devtools: {
        isUIEnabled: false,
        network: {
          xhr: defaultXHRState,
        },
      },
    })
    // NOTE: Etc. 2/4
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()
    return Singleton.instance
  }

  // -- NOTE: HTTP debug service
  public enableDebugUI() {
    this._common.devtools.isUIEnabled = true
  }
  public __fixXHRTotalCounters({ code }: { code: TReqStateCode }) {
    try {
      switch (code) {
        case 'pending':
          this._common.devtools.network.xhr.total.pending += 1
          break
        case 'fulfilled':
          this._common.devtools.network.xhr.total.pending -= 1
          this._common.devtools.network.xhr.total.fulfilled += 1
          break
        case 'rejected_req':
          this._common.devtools.network.xhr.total.pending -= 1
          this._common.devtools.network.xhr.total.rejected_req += 1
          break
        case 'rejected_res':
          this._common.devtools.network.xhr.total.pending -= 1
          this._common.devtools.network.xhr.total.rejected_res += 1
          break
        default:
          throw new Error(`Incorrect state code: ${code}`)
      }
    } catch (err) {
      console.warn(err)
    }
  }
  public __fixXHRState({ url, code, ts, __details }: {
    url: string;
    code: TReqStateCode;
    ts: number;
    __details?: TRequestDetailsInfo;
  }) {
    if (!this._common.devtools.network.xhr.state[url]) {
      this._common.devtools.network.xhr.state[url] = {
        [String(ts)]: {
          code,
        },
      }
      if (__details) this._common.devtools.network.xhr.state[url][String(ts)].__details = __details
    } else {
      if (!this._common.devtools.network.xhr.state[url][String(ts)])
        this._common.devtools.network.xhr.state[url][String(ts)] = {
          code,
        }
      else this._common.devtools.network.xhr.state[url][String(ts)].code = code

      if (__details) this._common.devtools.network.xhr.state[url][String(ts)].__details = __details
    }
  }
  public __fixRequest({ url, code, ts }: { url: string; code: TReqStateCode; ts: number; }) {
    try {
      if (!url) throw new Error(`Incorrect url! expected: not empty string. received: ${clsx(url || 'empty', `(${typeof url})`)}`)
      this.__fixXHRState({ url, code, ts })
      this.__fixXHRTotalCounters({ code })
    } catch (err: any) {
      groupLog({
        namespace: clsx('⚠️ ERR:', '[vi.__fixRequest]', code),
        items: [err],
      })
    }
  }
  public __fixResponse({ url, code, ts, __details }: {
    url: string;
    code: TReqStateCode;
    ts: number;
    __details?: TRequestDetailsInfo;
  }) {
    try {
      if (!url) throw new Error(`Incorrect url! expected: not empty string. received: ${clsx(url || 'empty', `(${typeof url})`)}`)
      this.__fixXHRState({ url, code, ts, __details })
      this.__fixXHRTotalCounters({ code })
    } catch (err: any) {
      groupLog({
        namespace: clsx('⚠️ ERR:', '[vi.__fixResponse]', code),
        items: [err],
      })
    }
  }
  private __resetXHRStates() {
    mutateObject({
      target: this._common.devtools.network.xhr,
      source: defaultXHRState,
      removeIfUndefined: true,
    })
  }
  // --

  public setUserDataResponse ({ res, reqState }: {
    res: NSP.TUserDataResponse | null;
    reqState: 'stopped' | 'pending' | 'success' | 'error';
  }) {
    this.uniqueUserDataLoadKey = getRandomString(7)
    this._stepMachineState.initApp.response = res
    this._stepMachineState.initApp.result.state = reqState

    this._stepMachineState.initApp.result.isLogged = res?.ok || false
  }
  public setImeiStepResponse (res: NSP.TImeiResponse | null) {
    this._stepMachineState.imei.response = res
  }
  public setContractStepResponse (res: NSP.TStandartMinimalResponse | null) {
    this._stepMachineState.contract.response = res
  }
  public setPhoneCheckResponse (res: NSP.TCheckPhoneResponse | null) {
    this._stepMachineState.checkPhone.response = res
  }
  public resetState() {
    try {
      // TODO: Doesnt work -> this._stepMachineState = initialStepMachineContextFormat
      for (const key in this._contractFormState) delete this._contractFormState[key]
      // NOTE: Etc. 4/4

      // NOTE: Exp
      mutateObject({
        target: this._stepMachineState,
        source: initialStepMachineContextFormat,
      })

      this.__resetXHRStates()
    } catch (err) {
      console.log(err)
    }
  }

  get smState() {
    return this._stepMachineState
  }
  get contractForm() {
    return this._contractFormState
  }
  get contractFormLastEditedFieldInfo() {
    return this._contractFormLastEditedFieldInfo
  }
  get common() {
    return this._common
  }
  // NOTE: Etc. 3/4
}

// NOTE: Valtio Instance (external proxy based multistore)
export const vi = Singleton.getInstance()

// NOTE: Also u can mutate vi.state if necessary
// For example: vi.state.imei.result.state = 'success'
