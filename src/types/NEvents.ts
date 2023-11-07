/* eslint-disable @typescript-eslint/no-namespace */
export namespace NEvents {
  export enum ECustom {
    CLIENT_TO_WORKER_MESSAGE = 'c-w:message',
    WORKER_TO_CLIENT_SOCKET_DATA = 'w-c:socket-data',
    WORKER_TO_CLIENT_SOCKET_CONNECTED = 'w-c:socket-connected',
    WORKER_TO_CLIENT_SOCKET_CONNECTION_ERRORED = 'w-c:socket-connection-errored',
    WORKER_TO_CLIENT_SOCKET_RECONNECTED = 'w-c:socket-reconnected',
    WORKER_TO_CLIENT_SOCKET_DISCONNECTED = 'w-c:socket-disconnected',
    WORKER_TO_CLIENT_SOCKET_TRYING_TO_RECONNECT = 'w-c:socket-trying-to-reconnect',
  }
  export enum EMetrixClientOutgoing {
    LAB_TEST ='lab:client:tst-action',
  }
  export enum ESharedWorkerCustom {
    CLIENT_TO_WORKER_DIE = 'die',
  }
  export enum ESharedWorkerNative {
    CLIENT_TO_WORKER_MESSAGE = 'message',
  }
}
