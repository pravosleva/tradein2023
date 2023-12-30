import { proxy } from 'valtio'
import { initialStepMachineContextFormat, initialContractFormState } from './xstate/stepMachine/initialState'
import { NSP } from '~/utils/httpClient'
import { TStepMachineContextFormat, TContractForm, EStep } from './xstate/stepMachine/types'
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
  // NOTE: Etc. 1/3

  private constructor() {
    this._stepMachineState = proxy(initialStepMachineContextFormat)
    this._contractFormState = proxy(initialContractFormState)
    this._contractFormLastEditedFieldInfo = proxy({
      name: null,
    })
    this._common = proxy({
      stateValue: null,
      appVersion: pkg.version,
    })
    // NOTE: Etc. 2/3
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()
    return Singleton.instance
  }

  public setUserDataResponse (res: NSP.TUserDataResponse | null) {
    this._stepMachineState.initApp.response = res
  }
  public setImeiStepResponse (res: NSP.TImeiResponse | null) {
    this._stepMachineState.imei.response = res
  }
  public setContractStepResponse (res: NSP.TStandartMinimalResponse | null) {
    this._stepMachineState.contract.response = res
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
  // NOTE: Etc. 3/3
}

// NOTE: Valtio Instance (external proxy based multistore)
export const vi = Singleton.getInstance()

// NOTE: Also u can mutate vi.state if necessary
// For example: vi.state.imei.result.state = 'success'
