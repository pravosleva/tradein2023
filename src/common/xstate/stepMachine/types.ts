/* eslint-disable @typescript-eslint/no-explicit-any */
import { NSP, NResponseValidate } from '~/utils/httpClient'
import {
  ActorRefFrom,
  StateFrom,
  StateSchema,
  TypegenMeta,
  Typestate,
} from 'xstate'
import { stepMachine } from './stepMachine';
import { TItem } from '~/common/components/tailwind';

export enum EStep {
  AppInit = 'app-init',
  AppInitErr = 'app-init-err',
  EnterImei = 'enter-imei',
  SendImei = 'send-imei',
  SendImeiErr = 'send-imei-err',
  EnterMemoryAndColor = 'enter-memory-and-color',
  PrePriceTable = 'pre-price-table',
  CheckPhone = 'check-phone',
  GetPhotoLink = 'get-photo-link',
  UploadPhotoInProgress = 'upload-photo:in-progress',
  UploadPhotoResultIsFuckup = 'upload-photo:result-fuckup',
  FinalPriceTable = 'final-price-table',
  Contract = 'contract',
  ContractSending = 'contract-sending',
  ContractError = 'contract-err',
  Final = 'tradein-final',
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
  initApp: {
    response: null | (NSP.TUserDataResponse & NResponseValidate.TResult<NSP.TUserDataResponse>);
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
      isLogged: boolean;
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

export namespace NStepMachine {
  export type TContext = TStepMachineContextFormat;
  export type TEvent =  
    { type: 'SET_IMEI'; value: string; }
    | { type: 'SET_COLOR'; value: TItem; }
    | { type: 'SET_MEMORY'; value: TItem; }
    | { type: 'SET_PHOTO_STATUS_RESPONSE'; value: NSP.TPhotoStatusResponse; }
    | { type: 'RESET_ALL_RESPONSES'; }
    | { type: 'SET_CONTRACT_FORM_STATE'; value: { state: { [key: string]: string | number; }, isReady: boolean; } }
    | { type: 'goPrev'; }
    | { type: 'goNext'; }
    | { type: 'goErr'; }
    | { type: 'goContract'; }
    | { type: 'goStart'; }
  export type TActorRef = ActorRefFrom<typeof stepMachine>

  // NOTE: Will be added in xstate@5.x
  // export type TSnapshot = SnapshotFrom<typeof stepMachine>
  // export type TActorLogic = ActorLogicFrom<typeof stepMachine>
  // export type TMeta = ActorLogicFrom<typeof stepMachine>

  export type TState = StateFrom<typeof stepMachine>
  export type TStateSchema = StateSchema<TStepMachineContextFormat>
  export type TTypegenMeta = TypegenMeta
  export type TTypestate = Typestate<TStepMachineContextFormat>
}
