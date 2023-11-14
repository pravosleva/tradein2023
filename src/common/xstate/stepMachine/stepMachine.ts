/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assign,
  // AnyEventObject,
  // NonReducibleUnknown,
  // ParameterizedObject,
  // ProvidedActor,
  // TypegenDisabled,
  createMachine,
  // AnyActorRef,
  // spawn,
  // actions,
} from 'xstate'
// import { httpClient } from '~/utils/httpClient'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { EStep, EErrCode, ECountryCode, TState } from './types'
import { initialContextState } from './initialState'
import {
  getUserDataMachine,
  sendContractMachine,
  getPhotoLinkMachine,
  checkPhoneMachine,
  fetchIMEIMachine,
} from './services'

// NOTE: ISO 3166-1 alpha-2 codes
// See also https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

export const phoneValidation: {
  [key in ECountryCode]: (val: string) => boolean;
} = {
   [ECountryCode.RU]: (val: string) => val.length === 11, // NOTE: 79163385212
   [ECountryCode.KZ]: (val: string) => val.length === 11,
   [ECountryCode.BY]: (val: string) => val.length === 12,
   // Etc.
}

export const stepMachine = createMachine<TState>(
  {
    initial: EStep.AppInit,
    context: initialContextState,
    states: {
      [EStep.AppInit]: {
        invoke: {
          src: 'getUserDataMachine',
          // data: (context) => ({ expText: 'exp text' }),
          onDone: {
            target: EStep.EnterImei,
            actions: assign({
              initApp: (ctx, e) => ({
                ...ctx.initApp,
                response: e.data,
                uiMsg: 'OK',
              })
            })
          },
          onError: {
            target: EStep.AppInitErr,
            actions: assign({
              initApp: (ctx, e: typeof Error | any) => {
                // console.warn(e.data)
                return {
                  ...ctx.initApp,
                  // result: { state: 'error' },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR7}: ${JSON.stringify(e)}`
                }
              }
            })
          },
        },
      },
      [EStep.AppInitErr]: {
        on: {
          goPrev: {
            target: EStep.AppInit,
          },
        },
      },

      // NOTE: IMEI Step
      [EStep.EnterImei]: {
        on: {
          goPrev: {
            cond: (context) => context.imei.result.state !== 'pending',
            target: EStep.AppInit,
          },
          goNext: {
            cond: (context) => context.imei.value.length === 15,
            target: EStep.SendImei,
          },
        },
      },
      [EStep.SendImei]: {
        invoke: {
          src: 'fetchIMEIMachine',
          data: (context) => ({
            imei: context.imei,
            expText: 'exp text',
          }),
          onDone: {
            target: EStep.EnterMemoryAndColor,
            actions: assign({
              imei: (ctx, e) => ({
                ...ctx.imei,
                // result: { state: 'success' },
                response: e.data,
                uiMsg: 'OK',
              })
            })
          },
          onError: {
            target: EStep.ImeiErr,
            actions: assign({
              imei: (ctx, e: typeof Error | any) => {
                // console.warn(e.data)
                return {
                  ...ctx.imei,
                  // result: { state: 'error' },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR1}: ${JSON.stringify(e)}`
                }
              }
            })
          },
        },
      },
      [EStep.ImeiErr]: {
        on: {
          prevStep: {
            cond: () => true,
            target: EStep.EnterImei,
          },
        }
      },

      // NOTE: Выберите память и цвет
      // TODO: если их нет. А если есть?
      [EStep.EnterMemoryAndColor]: {
        on: {
          goPrev: {
            // cond: (ctx) => !!ctx.memory?.selectedItem && !!ctx.color?.selectedItem,
            cond: () => true,
            target: EStep.EnterImei,
          },
          goNext: {
            cond: (ctx) => !!(ctx.imei.response?.phone.memory || !!ctx.memory?.selectedItem) && !!(ctx.imei.response?.phone.color || !!ctx.color?.selectedItem),
            target: EStep.PrePriceTable,
          },
        },
      },

      // NOTE: Предварительная сумма скидки
      [EStep.PrePriceTable]: {
        on: {
          goPrev: {
            target: EStep.EnterMemoryAndColor,
          },
          goNext: {
            target: EStep.CheckPhone,
          },
        },
      },

      // NOTE: POST /phone/check
      [EStep.CheckPhone]: {
        invoke: {
          src: 'checkPhoneMachine',
          // data: (context) => ({}),
          onDone: {
            // NOTE: Uncomment for go automatically
            target: EStep.GetPhotoLink,
            actions: assign({
              checkPhone: (ctx, e) => ({
                ...ctx.checkPhone,
                // result: { state: 'success' },
                response: e.data,
                uiMsg: 'OK',
              })
            }),
          },
          onError: {
            // --
            // TODO? More cases
            // target: EStep.CheckPhoneErr,
            // --
            
            actions: assign({
              checkPhone: (ctx, e: any) => {
                // console.warn(e.data instanceof AxiosError)
                return {
                  ...ctx.checkPhone,
                  // result: { state: 'error' },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR2}: ${JSON.stringify(e)}`
                }
              }
            })
          },
        },
        on: {
          goPrev: {
            cond: (context) => context.checkPhone?.result.state !== 'pending',
            target: EStep.PrePriceTable,
          },
          goNext: {
            cond: (context) => context.checkPhone?.response?.ok === true,
            target: EStep.GetPhotoLink,
          },
        },
      },

      [EStep.GetPhotoLink]: {
        invoke: {
          src: 'getPhotoLinkMachine',
          // data: (context) => ({}),
          onDone: {
            // NOTE: Uncomment for go automatically
            target: EStep.UploadPhotoInProgress,
            actions: assign({
              photoLink: (ctx, e) => ({
                ...ctx.photoLink,
                // result: { state: 'success' },
                response: e.data,
                uiMsg: 'OK',
              })
            }),
          },
          onError: {
            // -- TODO? More cases ->
            // target: EStep.GetPhotoLinkErr,
            // --
            actions: assign({
              photoLink: (ctx, e: any) => {
                // console.warn(e.data instanceof AxiosError)
                return {
                  ...ctx.photoLink,
                  result: { state: 'error' },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR3}: ${JSON.stringify(e)}`
                }
              },
            }),
          },
        },
        on: {
          goPrev: {
            cond: (context) => context.photoLink?.result.state !== 'pending',
            target: EStep.PrePriceTable,
          },
          goNext: {
            cond: (context) => context.photoLink?.response?.ok === true,
            target: EStep.UploadPhotoInProgress,
          },
        },
      },

      // NOTE: Ожидание загрузки фото
      [EStep.UploadPhotoInProgress]: {
        on: {
          goNext: {
            target: EStep.FinalPriceTable,
          },
          goPrev: {
            target: EStep.PrePriceTable,
          },
          goUploadPhotoResultInNotOk: {
            target: EStep.UploadPhotoResultInNotOk,
          },
        },
      },
      [EStep.UploadPhotoResultInNotOk]: {
        on: {
          goPrev: {
            target: EStep.PrePriceTable,
          }
        },
      },

      // NOTE: Итоговая сумма скидки
      [EStep.FinalPriceTable]: {
        on: {
          goNext: {
            target: EStep.Contract,
          },
        },
      },

      // NOTE: Договор
      [EStep.Contract]: {
        on: {
          goPrev: {
            cond: (context) => context.contract.result.state !== 'pending' || !context.contract.response?.ok,
            target: EStep.FinalPriceTable,
          },
          goNext: {
            cond: (context) => context.contract.form.isReady === true,
            target: EStep.ContractSending,
          },
        },
      },
      [EStep.ContractSending]: {
        invoke: {
          src: 'sendContractMachine',
          // data: (context) => ({}),
          onDone: {
            // NOTE: Uncomment for go automatically
            target: EStep.Final,
            actions: assign({
              contract: (ctx, e) => ({
                ...ctx.contract,
                // result: { state: 'success' },
                response: e.data,
                uiMsg: 'OK',
              })
            }),
          },
          onError: {
            target: EStep.ContractError,
            actions: assign({
              contract: (ctx, e: any) => {
                // console.warn(e.data instanceof AxiosError)
                return {
                  ...ctx.contract,
                  // result: { state: 'error' },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR6}: ${JSON.stringify(e)}`
                }
              },
            }),
          },
        },
        on: {
          goPrev: {
            cond: (context) => context.photoLink?.result.state !== 'pending',
            target: EStep.PrePriceTable,
          },
          goNext: {
            cond: (context) => context.photoLink?.response?.ok === true,
            target: EStep.UploadPhotoInProgress,
          },
        },
      },
      [EStep.ContractError]: {
        on: {
          goPrev: {
            target: EStep.Contract,
          },
        },
      },

      // NOTE: Done.
      [EStep.Final]: {
        on: {
          goContract: {
            target: EStep.Contract,
          },
          goStart: {
            target: EStep.AppInit,
          },
        },
      },
    },

    // NOTE: actions
    on: {
      SET_IMEI: {
        actions: assign({
          imei: (ctx, e) => ({ ...ctx.imei, value: e.value } ),
        }),
      },
      SET_COLOR: {
        actions: assign({
          color: (ctx, e) => ({ ...ctx.color, selectedItem: e.value } ),
        }),
      },
      SET_MEMORY: {
        actions: assign({
          memory: (ctx, e) => ({ ...ctx.memory, selectedItem: e.value }),
          color: (ctx, e) => ({
            ...ctx.color,
            selectedItem: null,
            dynamicList: ctx.imei.response?.phone.color_choices
              ? ctx.imei.response?.phone.color_choices[e.value.id].map((val) => ({ id: val, value: val, label: getReadableSnakeCase(val) }))
              : []
          }),
        }),
      },
      SET_PHOTO_STATUS_RESPONSE: {
        actions: assign({
          photoStatus: (ctx, e) => ({ ...ctx.photoStatus, response: e.value }),
        }),
      },
      RESET_ALL_RESPONSES: {
        actions: assign({
          imei: (_ctx, _e) => ({ ...initialContextState.imei }),
          memory: (_ctx, _e) => ({ ...initialContextState.memory }),
          color: (_ctx, _e) => ({ ...initialContextState.color }),
          checkPhone: (_ctx, _e) => ({ ...initialContextState.checkPhone }),
          photoLink: (_ctx, _e) => ({ ...initialContextState.photoLink }),
          photoStatus: (_ctx, _e) => ({ ...initialContextState.photoStatus }),
          initApp: (_ctx, _e) => ({ ...initialContextState.initApp }),
          // NOTE: Etc.
        }),
      },
      SET_CONTRACT_FORM_STATE: {
        actions: assign({
          contract: (ctx, e) => ({
            ...ctx.contract,
            form: {
              // ...ctx.contract.form,
              state: e.value.state,
              isReady: e.value.isReady,
            },
          })
        }),
      },
      // SET_CONTRACT_FORM_IS_READY: {
      //   actions: assign({
      //     contract: (ctx, e) => {
      //       console.log('--SET_CONTRACT_FORM_READY_STATE')
      //       console.log(e.value)
      //       console.log('--')
      //       return {
      //         ...ctx.contract,
      //         form: {
      //           // ...ctx.contract.form,
      //           state: e.state,
      //           isReady: e.isReady,
      //         },
      //       }
      //     }
      //   }),
      // },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      // imeiSendStart: assign({
      //   imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'pending' } }),
      // }),
      // imeiSendOk: assign({
      //   imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'success' } }),
      // }),
      // imeiSendErr: assign({
      //   imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'error' } } ),
      // }),
    },
    services: {
      fetchIMEIMachine,
      checkPhoneMachine,
      getPhotoLinkMachine,
      sendContractMachine,
      getUserDataMachine,
    },
    // guards: {
    //   "imei.length > 5": (context, event) => false,
    //   "!!color && !!memory": (context, event) => false,
    // },
    delays: {},
  },
)
