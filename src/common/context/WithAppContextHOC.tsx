/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import createFastContext from '~/common/context/createFastContext'
import pkg from '../../../package.json'

export type TAppMicroStore = {
  // isConnected: boolean;
  stateValue: string | null | undefined;
  appVersion: string;
}
export const initialState = {
  // isConnected: false,
  stateValue: null,
  appVersion: pkg.version,
}
const { Provider, useStore } = createFastContext<TAppMicroStore>(initialState);

export const WithAppContextHOC = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
    WANNA_BE_DISCONNECTED_FROM_ROOM = 'lab:client:wanna-be-disconnected-from-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
    COMMON_MESSAGE = 'lab:server:common-message',
  }
}

export {
  useStore,
}
