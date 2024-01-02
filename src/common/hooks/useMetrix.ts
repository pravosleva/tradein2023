/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { groupLog, wws } from '~/utils'
import { NEvents } from '~/types'
import { vi } from '~/common/vi'
import { subscribeKey } from 'valtio/utils'
import { EStep } from '../xstate/stepMachine'
import { useSnapshot } from 'valtio'
import structuredClone from '@ungap/structured-clone'

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
  const smViSnap = useSnapshot(vi.smState)
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
      stateValue: EStep;
    }
  }) => {
    // - TODO: Custom input data for the particular stateValue
    const customData: {
      imei?: string;
      stepDetails?: any;
      reportType?: EReportType;
    } = {
      imei: smViSnap.imei.value,
    }
    switch (input.stateValue) {
      // TODO: Detailed errors
      // case EStep.AppInitErr:
      //   break
      case EStep.SendImeiErr:
        customData.stepDetails = {
          imei: {
            response: structuredClone(smViSnap.imei.response, {
              // avoid throwing
              lossy: true,
              // avoid throwing *and* looks for toJSON
              json: true
            }),
          }
        }
        customData.reportType = EReportType.ERROR
        break;
      case EStep.EnterMemoryAndColor:
        customData.stepDetails = {
          imei: {
            response: structuredClone(smViSnap.imei.response, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.INFO
        break
      // case EStep.UploadPhotoResultIsFuckup:
      //   break
      case EStep.ContractError:
        customData.stepDetails = {
          contract: {
            response: structuredClone(smViSnap.contract.response, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.ERROR
        break
      case EStep.Final:
        customData.stepDetails = {
          contract: {
            response: structuredClone(smViSnap.contract.response, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.SUCCESS
        break
      default: break
    }
    // -
    wws.post<{
      input: {
        ts: number;
        room: string;
        metrixEventType: string;
        reportType: EReportType;
        stateValue: EStep;
        appVersion: string;
        stepDetails?: {
          [key: string]: any;
        };
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
          ...customData,
        },
      },
    })
  }, [
    smViSnap.imei.response,
    smViSnap.contract.response,
    smViSnap.imei.value,
  ])

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
