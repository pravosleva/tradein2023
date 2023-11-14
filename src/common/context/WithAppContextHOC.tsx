/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import createFastContext from '~/common/context/createFastContext'
import pkg from '../../../package.json'

export type TAppMicroStore = {
  // isConnected: boolean;
  stateValue: string | null | undefined;
  appVersion: string;
  auxContractForm: {
    [key: string]: any;
  } | null;
}
export const initialState = {
  // isConnected: false,
  stateValue: null,
  appVersion: pkg.version,
  auxContractForm: null,
}
const { Provider, useStore } = createFastContext<TAppMicroStore>(initialState);

export const WithAppContextHOC = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

// NOTE: Add this if necessary
// export namespace NEvent {
//   export enum ServerIncoming {
//     TEST = 'lab:client:tst-action',
//   }
//   export enum ServerOutgoing {
//     TEST = 'lab:server:tst-action',
//   }
// }

// @ts-ignore
window.appVersion = pkg.version

export {
  useStore,
}
