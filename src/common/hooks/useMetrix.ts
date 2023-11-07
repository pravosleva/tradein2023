/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { useStore } from '~/common/context/WithAppContextHOC'
import { groupLog, wws } from '~/utils'
import { NEvents } from '~/types'

type TProps = {
  isDebugEnabled?: boolean;
}

export const useMetrix = ({ isDebugEnabled }: TProps) => {
  const [store, _setStore] = useStore((store) => store)

  // NOTE: 1. Once
  useLayoutEffect(() => {
    wws.subscribeOnData<{
      data: {
        output: any;
        type: NEvents.ESharedWorkerNative;
        yourData: { [key: string]: any; };
      };
    }>({
      wName: 'metrixWorker',
      cb: (e: any) => {
        switch (e.data.__eType) {
          case NEvents.ECustom.WORKER_TO_CLIENT_SOCKET_DATA:
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:metrixWorker ✅ OnData [${e.data.__eType}] e.data:`,
              items: [e.data],
            })
            // TODO: App logic...
            break
          default: {
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:metrixWorker ⚠️ OnData UNHANDLED! [${e.data.__eType}] e.data:`,
              items: [e.data],
            })
            break
          }
        }
      },
    })

    // -- NOTE: Additional subscribe for example
    // (dont use this! cuz callbacks above will be replaced)
    // wws.subscribeOnData<{
    //   data: {
    //     output: any;
    //     type: NEvents.ESharedWorkerNative;
    //     yourData: { [key: string]: any; };
    //   };
    // }>({
    //   wName: 'metrixWorker',
    //   cb: (e: any) => {
    //     groupLog({ namespace: e.type, items: [ e.data ] })
    //   },
    // })
    // --

    wws.subscribeOnErr({
      wName: 'metrixWorker',
      cb: (e: any) => {
        if (isDebugEnabled) groupLog({
          namespace: '--useMetrix:metrixWorker 🚫 OnErr e:',
          items: [e],
        })
      },
    })

    return () => {
      const wList = ['metrixWorker']
      for (const wName of wList) {
        wws.terminate({
          wName,
          cb: () => {
            if (isDebugEnabled) groupLog({ namespace: `--useMetrix 🚫 die [${wName}]`, items: [] })
          },
        })
      }
    }
  }, [isDebugEnabled])

  const sendSnapshot = useCallback(({
    input,
  }: {
    input: {
      metrixEventType: any;
      stateValue: string;
    }
  }) => {
    wws.post<{
      input: {
        metrixEventType: string;
        stateValue: string;
        appVersion: string;
      }
    }>({
      wName: 'metrixWorker',
      eType: NEvents.ECustom.CLIENT_TO_WORKER_MESSAGE,
      data: {
        input: {
          appVersion: store.appVersion,
          ...input,
        },
      },
    })
  }, [store.appVersion])

  // NOTE: 2. Send event for each change
  useLayoutEffect(() => {
    try {
      if (store.stateValue) sendSnapshot({
        input: {
          metrixEventType: NEvents.EMetrixClientOutgoing.LAB_TEST,
          stateValue: String(store.stateValue),
        }
       })
    } catch (err) {
      if (isDebugEnabled) groupLog({ namespace: '--useMetrix 🚫 err', items: [err] })
    }
  }, [store.stateValue, store.appVersion, isDebugEnabled, sendSnapshot])
}
