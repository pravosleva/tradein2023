/* eslint-disable @typescript-eslint/no-namespace */
export namespace NEvents {
  export enum ECustom {
    CLIENT_TO_WORKER_RESET_HISTORY = 'c-w:reset-history',
    WORKER_TO_CLIENT_RESET_HISTORY_OK = 'w-c:reset-history-ok',
    CLIENT_TO_WORKER_MESSAGE = 'c-w:message',
    WORKER_TO_CLIENT_REMOTE_DATA = 'w-c:socket-data',
    WORKER_TO_CLIENT_CONN = 'w-c:socket-connected',
    WORKER_TO_CLIENT_CONNN_ERR = 'w-c:socket-connection-errored',
    WORKER_TO_CLIENT_RECONN = 'w-c:socket-reconnected',
    WORKER_TO_CLIENT_DISCONN = 'w-c:socket-disconnected',
    WORKER_TO_CLIENT_TRY_TO_RECONN = 'w-c:socket-trying-to-reconnect',
  }
  export enum EMetrixClientOutgoing {
    // LAB_TEST = 'lab:client:tst-action',
    SP_MX_EV = 'sp-mx:offline-tradein:c:event',
  }
  export enum ESharedWorkerCustom {
    CLIENT_TO_WORKER_DIE = 'die',
  }
  // export enum EWorkerCustom {
  //   CLIENT_TO_WORKER_DIE = 'die',
  // }
  export enum ESharedWorkerNative {
    // CLIENT_TO_WORKER_MESSAGE = 'message',
  }
}
