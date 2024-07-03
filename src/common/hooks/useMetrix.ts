/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { groupLog, wws, EReportType } from '~/utils'
import { NEvents } from '~/types'
import { vi } from '~/common/vi'
import { subscribeKey } from 'valtio/utils'
import { EStep } from '../xstate/stepMachine'
import { useSnapshot } from 'valtio'
import { useProxy } from 'valtio/utils'
import structuredClone from '@ungap/structured-clone'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  // closeSnackbar,
} from 'notistack'

type TProps = {
  isDebugEnabled?: boolean;
}

// const isDev = process.env.NODE_ENV === 'development'
// const isLocalProd = import.meta.env.VITE_LOCAL_PROD === '1'
// const isStaging = isDev || isLocalProd
const VITE_GIT_SHA1 = import.meta.env.VITE_GIT_SHA1

type TIncomingData = {
  output?: any;
  type?: NEvents.ESharedWorkerNative;
  yourData?: { [key: string]: any; };
  code?: NEvents.EWorkerToClientEventCode;
  __eType: string;
  message?: string;
  _message?: string;
  result?: {
    isOk: boolean;
    message?: string;
    response: {
      ok: boolean;
      id?: number;
      gRes?: any;
    };
  };
};

export const useMetrix = ({ isDebugEnabled }: TProps) => {
  const smViSnap = useSnapshot(vi.smState)
  const devtoolsViProxy = useProxy(vi.common.devtools)
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [enqueueSnackbar])
  const showError = useCallback(({ message }: { message: string }) => {
    showNotif(message || 'No message', { variant: 'error' })
  }, [showNotif])
  const showSuccess = useCallback(({ message }: { message: string }) => {
    showNotif(message || 'No message', { variant: 'default' })
  }, [showNotif])
  const showInfo = useCallback(({ message }: { message: string }) => {
    showNotif(message || 'No message', { variant: 'info' })
  }, [showNotif])

  // NOTE: 1.1 Use wws.subscribeOnData once only!
  useLayoutEffect(() => {
    wws.subscribeOnData<{
      data: TIncomingData
    }>({
      wName: 'metrixWorker',
      cb: (e: {
        data: TIncomingData;
      }) => {
        if (isDebugEnabled) groupLog({ namespace: 'new data (high level)', items: [e] })
        switch (e.data.__eType) {
          case NEvents.ECustom.WORKER_TO_CLIENT_REMOTE_DATA:
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker ✅ (on data) [${e.data.__eType}] e.data:`,
              items: [e.data],
            })

            // -- NOTE: App logic exp
            switch (true) {
              case e.data.code === NEvents.EWorkerToClientEventCode.UI_MESSAGE_DANGER:
                showError({ message: (isDebugEnabled ? e.data?._message : e.data?.message) || 'UI Message event code: danger (no message)' })
                break
              case e.data.code === NEvents.EWorkerToClientEventCode.UI_MESSAGE_SUCCESS:
                showSuccess({ message: (isDebugEnabled ? e.data?._message : e.data?.message) || 'UI Message event code: success (no message)' })
                break
              case e.data.code === NEvents.EWorkerToClientEventCode.UI_MESSAGE_INFO:
                showInfo({ message: (isDebugEnabled ? e.data?._message : e.data?.message) || 'UI message event code: info (no message)' })
                break
              case e.data.code === NEvents.EWorkerToClientEventCode.SOCKET_MUST_DIE:
                devtoolsViProxy.network.isReportsByUserDisabled = true
                if (isDebugEnabled) showInfo({ message: (isDebugEnabled ? e.data?._message : e.data?.message) || 'UI message event code: socket_must_die (no message)' })
                break
              default:
                break
            }
            // --

            break
          case NEvents.ECustom.WORKER_TO_CLIENT_CONN:
            devtoolsViProxy.network.socket.__wasThereAFirstConnection = true
            if (!devtoolsViProxy.network.socket.__isConnectionIgnoredForUI) devtoolsViProxy.network.socket.isConnected = true

            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker 🟢 [${e.data.__eType}] e.data:`,
              items: [
                e.data,
                `__isConnectionIgnoredForUI: ${String(devtoolsViProxy.network.socket.__isConnectionIgnoredForUI)}`,
                devtoolsViProxy.network.socket.__isConnectionIgnoredForUI
                  ? 'So, this event does not affect the user interface'
                  : 'So, this event will affect the user interface',
              ],
            })
            break
          case NEvents.ECustom.WORKER_TO_CLIENT_CONNN_ERR:
          case NEvents.ECustom.WORKER_TO_CLIENT_DISCONN:
            if (!devtoolsViProxy.network.socket.__isConnectionIgnoredForUI) devtoolsViProxy.network.socket.isConnected = false

            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker 🔴 [${e.data.__eType}] e.data:`,
              items: [
                e.data,
                `__isConnectionIgnoredForUI: ${String(devtoolsViProxy.network.socket.__isConnectionIgnoredForUI)}`,
                devtoolsViProxy.network.socket.__isConnectionIgnoredForUI
                  ? 'So, this event does not affect the user interface'
                  : 'So, this event will affect the user interface',
              ],
            })
            break
          default: {
            if (isDebugEnabled) groupLog({
              namespace: `--useMetrix:by-metrixWorker ⚠️ (on data) UNHANDLED! [${e.data.__eType}] e.data:`,
              items: [e.data, 'Необработанное событие'],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebugEnabled])

  const sendSnapshotToWorker = useCallback(({
    input,
  }: {
    input: {
      metrixEventType: any;
      stateValue: EStep;
      tradeinId: number | null;
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
      case EStep.AppInitErr:
        customData.stepDetails = {
          initApp: {
            response: structuredClone(smViSnap.initApp.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.initApp.result, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.ERROR
        break
        /*
      case EStep.FinalScenarioErr:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, {
              // avoid throwing
              lossy: true,
              // avoid throwing *and* looks for toJSON
              json: true
            }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.ERROR
        break
      case EStep.AppModeMenu:
        customData.stepDetails = {
          initApp: {
            response: structuredClone(smViSnap.initApp.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.initApp.result, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.DEFAULT
        break
      case EStep.AppModeMenu2:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.DEFAULT
        break
      case EStep.AppModeMenu2FinalErr:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.ERROR
        break
      case EStep.CheckDeviceCharge:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.INFO
        break
      
      case EStep.EnterImei:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
        }
        customData.reportType = EReportType.INFO
        break
      */
      case EStep.SendImeiErr:
        customData.stepDetails = {
          // appMode: {
          //   currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          // },
          // appMode2: {
          //   currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          // },
          // checkDeviceCharge: {
          //   form: {
          //     state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
          //   },
          // },
          imei: {
            response: structuredClone(smViSnap.imei.response, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.ERROR
        break;
      /*
      case EStep.SendImeiDone:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
          imei: {
            response: structuredClone(smViSnap.imei.response, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.INFO
        break;
      */
      case EStep.EnterMemoryAndColor:
        customData.stepDetails = {
          imei: {
            response: structuredClone(smViSnap.imei.response, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.INFO
        break
      /*
      case EStep.SendCheckFMIPResultOff:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
          checkFMIP: {
            response: structuredClone(smViSnap.checkFMIP.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.checkFMIP.result, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.INFO
        break
      case EStep.SendCheckFMIPResultOn:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
          checkFMIP: {
            response: structuredClone(smViSnap.checkFMIP.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.checkFMIP.result, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.WARNING
        break
      case EStep.CheckByEmployee:
        customData.stepDetails = {
          imei: {
            response: structuredClone(smViSnap.imei.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.imei.result, { lossy: true, json: true }),
          },
          checkFMIP: {
            response: structuredClone(smViSnap.checkFMIP.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.checkFMIP.result, { lossy: true, json: true }),
          },
        }
        customData.reportType = EReportType.INFO
        break
      
      case EStep.CheckPhone:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
        }
        if (smViSnap.checkFMIP.response) {
          customData.stepDetails.checkFMIP = {
            response: structuredClone(smViSnap.checkFMIP.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.checkFMIP.result, { lossy: true, json: true }),
          }
        }
        customData.stepDetails.checkByEmployee = {
          form: {
            state: structuredClone(smViSnap.checkByEmployee.form.state, { lossy: true, json: true }),
          },
        },
        customData.reportType = EReportType.INFO
        break
      case EStep.GetPhotoLink:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          checkDeviceCharge: {
            form: {
              state: structuredClone(smViSnap.checkDeviceCharge.form.state, { lossy: true, json: true }),
            },
          },
        }
        if (smViSnap.checkFMIP.response) {
          customData.stepDetails.checkFMIP = {
            response: structuredClone(smViSnap.checkFMIP.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.checkFMIP.result, { lossy: true, json: true }),
          }
        }
        customData.stepDetails.checkPhone = {
          response: structuredClone(smViSnap.checkPhone.response, { lossy: true, json: true }),
        }
        customData.stepDetails.checkByEmployee = {
          form: {
            state: structuredClone(smViSnap.checkByEmployee.form.state, { lossy: true, json: true }),
          },
        },
        customData.reportType = EReportType.INFO
        break
      // case EStep.UploadPhotoResultIsFuckup:
      //   break
      */
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
          // contract: {
          //   response: structuredClone(smViSnap.contract.response, { lossy: true, json: true }),
          // },
          network: structuredClone(devtoolsViProxy.network, { lossy: true, json: true }),
        }
        customData.reportType = EReportType.SUCCESS
        break
      /*
      case EStep.ActPrint:
        customData.stepDetails = {
          appMode: {
            currentMode: structuredClone(smViSnap.appMode.currentMode, { lossy: true, json: true }),
          },
          appMode2: {
            currentMode: structuredClone(smViSnap.appMode2.currentMode, { lossy: true, json: true }),
          },
          photoStatus: {
            response: structuredClone(smViSnap.photoStatus.response, { lossy: true, json: true }),
            result: structuredClone(smViSnap.photoStatus.result, { lossy: true, json: true }),
          },
        }
        if (smViSnap.imei.response?.go_to_final_step) {
          customData.stepDetails.imei = {
            _customDetails: {
              go_to_final_step: structuredClone(smViSnap.imei.response?.go_to_final_step, { lossy: true, json: true }),
              condition: structuredClone(smViSnap.imei.response?.condition, { lossy: true, json: true }),
              condition_limit_reason: structuredClone(smViSnap.imei.response?.condition_limit_reason, { lossy: true, json: true }),
            },
            result: structuredClone(smViSnap.imei.result, { lossy: true, json: true }),
          }
        }
        customData.reportType = EReportType.SUCCESS
        break
      */
      default: break
    }
    // -
    wws.post<{
      input: {
        ts: number;
        room: string;
        metrixEventType: NEvents.EMetrixClientOutgoing;
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
    smViSnap.initApp.response,
    smViSnap.initApp.result,
    // smViSnap.appMode.currentMode,
    // smViSnap.appMode2.currentMode,
    smViSnap.imei.response,
    // smViSnap.imei.result,
    smViSnap.imei.value,
    // smViSnap.checkPhone.response,
    smViSnap.contract.response,
    // smViSnap.checkByEmployee.form.state,
    // smViSnap.checkDeviceCharge.form.state,
    // smViSnap.checkFMIP.response,
    // smViSnap.checkFMIP.result,
    // smViSnap.photoStatus.response,
    // smViSnap.photoStatus.result,
    devtoolsViProxy.network,
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
          tradeinId: vi.smState.imei.response?.id || 0,
          uniquePageLoadKey: vi.uniquePageLoadKey,
          uniqueUserDataLoadKey: vi.uniqueUserDataLoadKey,
          gitSHA1: VITE_GIT_SHA1,
        }
      })
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [isDebugEnabled, sendSnapshotToWorker])
}
