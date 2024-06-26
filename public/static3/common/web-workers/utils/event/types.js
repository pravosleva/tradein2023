const NES = {
  // NOTE: Should be sync with NEvents.ECustom in ~/types/NEvents.ts
  Custom: {
    EType: {
      CLIENT_TO_WORKER_RESET_HISTORY: 'c-w:reset-history',
      WORKER_TO_CLIENT_RESET_HISTORY_OK: 'w-c:reset-history-ok',
      CLIENT_TO_WORKER_MESSAGE: 'c-w:message',
      WORKER_TO_CLIENT_REMOTE_DATA: 'w-c:socket-data',
      WORKER_TO_CLIENT_CONN: 'w-c:socket-conn-ok',
      WORKER_TO_CLIENT_CONNN_ERR: 'w-c:socket-conn-err',
      WORKER_TO_CLIENT_RECONN: 'w-c:socket-reconn',
      WORKER_TO_CLIENT_DISCONN: 'w-c:socket-disconn',
      WORKER_TO_CLIENT_TRY_TO_RECONN: 'w-c:socket-trying-to-reconn',
      WORKER_TO_CLIENT_XHR_FULL_HISTORY_REPORT_OK: 'w-c:history-report-ok',
      WORKER_TO_CLIENT_XHR_FULL_HISTORY_REPORT_ERR: 'w-c:history-report-err',
    },
    Client: {
      // NOTE: Should be sync with EStep in ~/common/xstate/stepMachine/types.ts
      EStepMachine: {
        AppInit: 'app-init',
        AppInitErr: 'app-init-err',
        // AppModeMenu: 'sm:app-mode-menu',
        // AppModeMenu2: 'sm:app-mode-menu2',
        // AppModeMenu2FinalErr: 'sm:app-mode-menu2-final-err',
        // CheckDeviceCharge: 'sm:check-device-charge',
        EnterImei: 'enter-imei',
        SendImei: 'send-imei',
        SendImeiErr: 'send-imei-err',
        EnterMemoryAndColor: 'enter-memory-and-color',
        // CheckByEmployee: 'sm:check-by-employee',
        // SendCheckFMIP: 'sm:check-fmip',
        // SendCheckFMIPOn: 'sm:check-fmip-result',
        PrePriceTable: 'pre-price-table',
        CheckPhone: 'check-phone',
        GetPhotoLink: 'get-photo-link',
        UploadPhotoInProgress: 'upload-photo:in-progress',
        UploadPhotoResultIsFuckup: 'upload-photo:result-fuckup',
        FinalPriceTable: 'final-price-table',
        Contract: 'contract',
        ContractSending: 'contract-sending',
        ContractError: 'contract-err',
        Final: 'tradein-final',
        // ActPrint: 'sm:act-print',
        // FinalScenarioErr: 'sm:final-scenario-err',
      }
    }
  },
  SharedWorker: {
    Native: {
      ESelf: {
        CONNECT: 'connect',
        ERROR: 'error',
      },
      EPort: {
        MESSAGE: 'message',
      },
    },
    Custom: {
      // NOTE: Should be sync with NEvents.ESharedWorkerCustom in ~/types/NEvents.ts
      EType: {
        CLIENT_TO_WORKER_DIE: 'die',
      },
    },
  },
  Worker: {
    ENative: {
      MESSAGE: 'message',
    },
    Custom: {
      // NOTE: Should be sync with NEvents.EWorkerCustom in ~/types/NEvents.ts
      EType: {
        CLIENT_TO_WORKER_DIE: 'die',
      },
    },
  },
  Socket: {
    ENative: {
      CONNECT: 'connect',
      RECONNECT: 'reconnect',
      CONNECT_ERROR: 'connect_error',
      RECONNECT_ATTEMPT: 'reconnect_attempt',
      DISCONNECT: 'disconnect',
    },
    ECustom: {
      DONT_RECONNECT: 'custom:dont-reconnect',
    },
    Metrix: {
      // NOTE: Should be sync with NEvents.EMetrixClientOutgoing in ~/types/NEvents.ts
      EClientOutgoing: {
        // LAB_TEST: 'lab:client:tst-action',
        SP_MX_EV: 'sp-mx:offline-tradein:c:event',
        SP_HISTORY_REPORT_EV: 'sp-history:offline-tradein:c:report',
        _SP_HISTORY_REPORT_EV_DEPRECATED: 'sp-xhr-history:offline-tradein:c:report',
      },
      EClientIncoming: {
        // LAB_TEST: 'lab:server:tst-action',
        SP_MX_EV: 'sp-mx:offline-tradein:s:event',
        SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK: 'sp-mx:history-report:s:ok',
        SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR: 'sp-mx:history-report:s:err',
      },
    },
  },
}
