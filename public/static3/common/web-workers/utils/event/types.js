const NES = {
  // NOTE: Should be sync with NEvents.ECustom in ~/types/NEvents.ts
  Custom: {
    EType: {
      CLIENT_TO_WORKER_RESET_HISTORY: 'c-w:reset-history',
      WORKER_TO_CLIENT_RESET_HISTORY_OK: 'w-c:reset-history-ok',
      CLIENT_TO_WORKER_MESSAGE: 'c-w:message',
      WORKER_TO_CLIENT_REMOTE_DATA: 'w-c:socket-data',
      WORKER_TO_CLIENT_CONN: 'w-c:socket-connected',
      WORKER_TO_CLIENT_CONNN_ERR: 'w-c:socket-connection-errored',
      WORKER_TO_CLIENT_RECONN: 'w-c:socket-reconnected',
      WORKER_TO_CLIENT_DISCONN: 'w-c:socket-disconnected',
      WORKER_TO_CLIENT_TRY_TO_RECONN: 'w-c:socket-trying-to-reconnect',
    },
    Client: {
      // NOTE: Should be sync with EStep in ~/common/xstate/stepMachine/types.ts
      EStepMachine: {
        AppInit: 'sm:app-init',
        AppInitErr: 'sm:app-init-err',
        EnterImei: 'sm:enter-imei',
        SendImei: 'sm:send-imei',
        SendImeiErr: 'sm:send-imei-err',
        EnterMemoryAndColor: 'sm:enter-memory-and-color',
        PrePriceTable: 'sm:pre-price-table',
        CheckPhone: 'sm:check-phone',
        GetPhotoLink: 'sm:get-photo-link',
        UploadPhotoInProgress: 'sm:upload-photo:in-progress',
        UploadPhotoResultIsFuckup: 'sm:upload-photo:result-is-not-ok',
        FinalPriceTable: 'sm:final-price-table',
        Contract: 'sm:contract',
        ContractSending: 'sm:contract-sending',
        ContractError: 'sm:contract-error',
        Final: 'sm:final',
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
      },
      EClientIncoming: {
        // LAB_TEST: 'lab:server:tst-action',
        SP_MX_EV: 'sp-mx:offline-tradein:s:event',
      },
    },
  },
}
