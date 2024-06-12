/* eslint-disable @typescript-eslint/no-namespace */
export namespace NEvents {
  export enum ECustom {
    CLIENT_TO_WORKER_RESET_HISTORY = 'c-w:reset-history',
    WORKER_TO_CLIENT_RESET_HISTORY_OK = 'w-c:reset-history-ok',
    CLIENT_TO_WORKER_MESSAGE = 'c-w:message',
    WORKER_TO_CLIENT_REMOTE_DATA = 'w-c:socket-data',
    WORKER_TO_CLIENT_CONN = 'w-c:socket-conn-ok',
    WORKER_TO_CLIENT_CONNN_ERR = 'w-c:socket-conn-err',
    WORKER_TO_CLIENT_RECONN = 'w-c:socket-reconn',
    WORKER_TO_CLIENT_DISCONN = 'w-c:socket-disconn',
    WORKER_TO_CLIENT_TRY_TO_RECONN = 'w-c:socket-trying-to-reconn',
    WORKER_TO_CLIENT_XHR_FULL_HISTORY_REPORT_OK = 'w-c:history-report-ok',
    WORKER_TO_CLIENT_XHR_FULL_HISTORY_REPORT_ERR = 'w-c:history-report-err',
  }
  export enum EMetrixClientOutgoing {
    // LAB_TEST = 'lab:client:tst-action',
    SP_MX_EV = 'sp-mx:offline-tradein:c:event',
    SP_XHR_HISTORY_REPORT_EV = 'sp-history:offline-tradein:c:report',
  }
  export enum ESharedWorkerCustom {
    CLIENT_TO_WORKER_DIE = 'die',
  }
  // export enum EWorkerCustom {
  //   // CLIENT_TO_WORKER_DIE = 'die',
  // }

  export enum ESharedWorkerNative {
    // CLIENT_TO_WORKER_MESSAGE = 'message',
  }
  export enum EWorkerToClientEventCode {
    UI_MESSAGE_DANGER = 'ui_message_danger',
    UI_MESSAGE_SUCCESS = 'ui_message_success',
  }
}
