/* eslint-disable @typescript-eslint/no-explicit-any */
import { NSP } from '~/utils/httpClient'

export enum EStep {
  AppInit = 'app-init',
  AppInitErr = 'app-init-err',
  EnterImei = 'enter-imei',
  SendImei = 'send-imei',
  ImeiErr = 'imei-err',
  EnterMemoryAndColor = 'enter-memory-and-color',
  PrePriceTable = 'pre-price-table',
  CheckPhone = 'check-phone',
  GetPhotoLink = 'get-photo-link',
  UploadPhotoInProgress = 'upload-photo:in-progress',
  UploadPhotoResultInNotOk = 'upload-photo:result-is-not-ok',
  FinalPriceTable = 'final-price-table',
  Contract = 'contract',
  ContractSending = 'contract-sending',
  ContractError = 'contract-error',

  Final = 'final',
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
export type TState = {
  baseSessionInfo: {
    // -- TODO: Wich format will be received from backend?
    tradeinId: number | null;
    // --
  },
  initApp: {
    response: null | NSP.TUserDataResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  },
  imei: {
    value: string;
    response: null | NSP.TImeiResponse;
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
    response: null | NSP.TCheckPhoneResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  photoLink: {
    response: null | NSP.TPhotoLinkResponse;
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
    response: any;
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
  },
}
