import { proxy } from 'valtio'
import { initialStepMachineContextFormat, initialContractFormState } from './xstate/stepMachine/initialState'
import { NSP } from '~/utils/httpClient'
import { getRandomString } from '~/utils/aux-ops'
import { TStepMachineContextFormat, TContractForm, EStep } from './xstate/stepMachine/types'
import { mutateObject } from '~/utils/aux-ops'
import pkg from '../../package.json' 

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
    })
    // NOTE: Etc. 2/4
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()
    return Singleton.instance
  }

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
