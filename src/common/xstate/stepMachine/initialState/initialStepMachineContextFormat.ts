import { TStepMachineContextFormat } from '~/common/xstate/stepMachine/types'

export const initialStepMachineContextFormat: TStepMachineContextFormat = {
  baseSessionInfo: {
    tradeinId: 1,
  },
  initApp: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  imei: {
    value: '',
    response: null,
    uiMsg: null,
    result: {
      state: 'stopped',
      memoryList: [],
    },
  },
  memory: {
    dynamicList: [],
    selectedItem: null,
  },
  color: {
    selectedItem: null,
    dynamicList: [],
  },
  checkPhone: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  photoLink: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  photoStatus: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  contract: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
    form: {
      state: null,
      isReady: false,
    },
  },
}
