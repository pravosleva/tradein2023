/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { groupLog, wws } from '~/utils'
import { NEvents } from '~/types'
import { vi } from '~/common/vi'
import { subscribeKey } from 'valtio/utils'

type TProps = {
  isDebugEnabled?: boolean;
}
enum EReportType {
  DEFAULT = 'default',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export const useMetrix = ({ isDebugEnabled }: TProps) => {
  // NOTE: 1.1 Use wws.subscribeOnData once only!
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
          case NEvents.ECustom.WORKER_TO_CLIENT_REMOTE_DATA:
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker ✅ (on data) [${e.data.__eType}] e.data:`,
              items: [e.data],
            })
            // NOTE: App logic?
            break
          default: {
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker ⚠️ (on data) UNHANDLED! [${e.data.__eType}] e.data:`,
              items: [e.data],
            })
            break
          }
        }
      },
    })

    // -- NOTE: 1.2 Additional subscribe? ⛔ Dont use this! Cuz callbacks above will be replaced
    // wws.subscribeOnData<{
    //   data: {
    //     output: any;
    //     type: NEvents.ESharedWorkerNative;
    //     yourData: { [key: string]: any; };
    //   };
    // }>({
    //   wName: 'metrixWorker',
    //   cb: (e: any) => { groupLog({ namespace: e.type, items: [ e.data ] }) },
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

  const sendSnapshotToWorker = useCallback(({
    input,
  }: {
    input: {
      metrixEventType: any;
      stateValue: string;
    }
  }) => {
    wws.post<{
      input: {
        ts: number;
        room: string;
        metrixEventType: string;
        reportType: EReportType;
        stateValue: string;
        appVersion: string;
      }
    }>({
      wName: 'metrixWorker',
      eType: NEvents.ECustom.CLIENT_TO_WORKER_MESSAGE,
      data: {
        input: {
          ts: new Date().getTime(),
          room: 'FOR_EXAMPLE',
          reportType: EReportType.DEFAULT,
          appVersion: vi.common.appVersion,
          ...input,
        },
      },
    })
  }, [])

  // NOTE: 2. Send event for each change
  useLayoutEffect(() => {
    // NOTE: See also https://valtio.pmnd.rs/docs/api/utils/subscribeKey
    // Subscribe to all changes to the state proxy (and its child proxies)
    const unsubscribe = subscribeKey(vi.common, 'stateValue', (val) => {
      if (typeof val === 'string') sendSnapshotToWorker({
        input: {
          metrixEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV,
          // @ts-ignore
          stateValue: vi.common.stateValue,
        }
      })
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [isDebugEnabled, sendSnapshotToWorker])
}
