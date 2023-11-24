/* eslint-disable @typescript-eslint/no-explicit-any */
import { NSP, NResponseValidate } from '~/utils/httpClient'

export enum EStep {
  AppInit = 'stepMachine:app-init',
  AppInitErr = 'stepMachine:app-init-err',
  EnterImei = 'stepMachine:enter-imei',
  SendImei = 'stepMachine:send-imei',
  SendImeiErr = 'stepMachine:send-imei-err',
  EnterMemoryAndColor = 'stepMachine:enter-memory-and-color',
  PrePriceTable = 'stepMachine:pre-price-table',
  CheckPhone = 'stepMachine:check-phone',
  GetPhotoLink = 'stepMachine:get-photo-link',
  UploadPhotoInProgress = 'stepMachine:upload-photo:in-progress',
  UploadPhotoResultIsFuckup = 'stepMachine:upload-photo:result-is-not-ok',
  FinalPriceTable = 'stepMachine:final-price-table',
  Contract = 'stepMachine:contract',
  ContractSending = 'stepMachine:contract-sending',
  ContractError = 'stepMachine:contract-error',
  Final = 'stepMachine:final',
}
export enum EErrCode {
  ERR1 = 'ERR1',
  ERR2 = 'ERR2',
  ERR3 = 'ERR3',
  ERR4 = 'ERR4',
  ERR5 = 'ERR5',
  ERR6 = 'ERR6',
  ERR7 = 'initApp error',
  ERR8 = 'ERR8',
}

// NOTE: ISO 3166-1 alpha-2 codes
// See also https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export enum ECountryCode {
  RU = 'RU',
  KZ = 'KZ',
  BY = 'BY',
  // Etc.
}

export type TSelectedItem = { value: string; label: string; }
export type TStepMachineContextFormat = {
  baseSessionInfo: {
    // -- TODO: Wich format will be received from backend?
    tradeinId: number | null;
    // --
  },
  initApp: {
    response: null | (NSP.TUserDataResponse & NResponseValidate.TResult<NSP.TUserDataResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  },
  imei: {
    value: string;
    response: null | (NSP.TImeiResponse & NResponseValidate.TResult<NSP.TImeiResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
      memoryList: { id: string; value: string; label: string; }[];
    };
  },
  memory: {
    selectedItem: TSelectedItem | null;
    dynamicList: { id: string; value: string; label: string; }[];
  };
  color: {
    selectedItem: TSelectedItem | null;
    dynamicList: { id: string; value: string; label: string; }[];
  };
  checkPhone: {
    response: null | (NSP.TCheckPhoneResponse & NResponseValidate.TResult<NSP.TCheckPhoneResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  photoLink: {
    response: null | (NSP.TPhotoLinkResponse & NResponseValidate.TResult<NSP.TPhotoLinkResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  photoStatus: {
    response: null | NSP.TPhotoStatusResponse; // NOTE: Success only or null!
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  contract: {
    response: null | (NSP.TStandartMinimalResponse & NResponseValidate.TResult<NSP.TStandartMinimalResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
    form: {
      state: null | {
        [key: string]: any;
      };
      isReady: boolean;
    };
  };
}

export type TContractForm = {
  lastName?: string;
  name?: string;
  middlename?: string;
  phone?: string;
  [key: string]: any;
}
