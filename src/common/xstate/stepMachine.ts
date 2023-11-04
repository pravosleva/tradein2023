/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
// import { fetchIMEIMachine } from './tools/fetchIMEIMachine'
import { httpClient, NSP } from '~/utils/httpClient'
import { getReadableSnakeCase } from '~/utils/aux-ops'

export enum EStep {
  Init = 'init',
  EnterImei = 'enter-imei',
  SendImei = 'send-imei',
  ImeiErr = 'imei-err',
  EnterMemoryAndColor = 'enter-memory-and-color',
  PrePriceTable = 'pre-price-table',
  CheckPhone = 'check-phone',
  GetPhotoLink = 'get-photo-link',
  UploadPhotoInProgress = 'upload-photo:in-progress',
  UploadPhotoResultInNotOk = 'upload-photo:result-is-not-ok',
  FinalPriceTable = 'final-price-table',
  Final = 'final',
}
enum EErrCode {
  ERR1 = 'ERR1',
  ERR2 = 'ERR2',
  ERR3 = 'ERR3',
  ERR4 = 'ERR4',
  ERR5 = 'ERR5',
  ERR6 = 'ERR6',
}

// const fetchIMEIMachine

export type TSelectedItem = { value: string; label: string; }
type TState = {
  baseSessionInfo: {
    tradeinId: number | null;
  },
  imei: {
    value: string;
    response: null | NSP.TImeiResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
      memoryList: { id: string; value: string; label: string; }[];
      // fullDiscountTable: any[];
    };
  },
  memory: {
    selectedItem: TSelectedItem | null;
  };
  color: {
    selectedItem: TSelectedItem | null;
    dynamicList: { id: string; value: string; label: string; }[];
  };
  checkPhone: {
    response: null | NSP.TCheckPhoneResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  photoLink: {
    response: null | NSP.TPhotoLinkResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
  photoStatus: {
    response: null | NSP.TPhotoStatusResponse; // NOTE: Success only or null!
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  };
}
const initialContextState: TState = {
  baseSessionInfo: {
    tradeinId: 1,
  },
  imei: {
    value: '',
    response: null,
    uiMsg: null,
    result: {
      state: 'stopped',
      memoryList: [],
      // fullDiscountTable: [],
    },
  },
  memory: {
    selectedItem: null,
  },
  color: {
    selectedItem: null,
    dynamicList: [],
  },
  checkPhone: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  photoLink: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  photoStatus: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
}

export const stepMachine = createMachine<TState>(
  {
    initial: EStep.Init,
    context: initialContextState,
    states: {
      [EStep.Init]: {
        on: {
          goIMEI: {
            target: EStep.EnterImei,
          },
        }
      },

      // NOTE: IMEI
      [EStep.EnterImei]: {
        on: {
          goPrev: {
            cond: (context) => context.imei.result.state !== 'pending',
            target: EStep.Init,
          },
          goNext: {
            cond: (context) => context.imei.value.length > 5,
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
              imei: (ctx, e) => ({ ...ctx.imei, response: e.data, uiMsg: 'OK' })
            })
          },
          onError: {
            target: EStep.ImeiErr,
            actions: assign({
              imei: (ctx, e: typeof Error | any) => {
                // console.warn(e.data)
                return {
                  ...ctx.imei,
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
            target: EStep.EnterImei,
          },
        }
      },

      // NOTE: Выберите память и цвет
      // TODO: если их нет. А если есть?
      [EStep.EnterMemoryAndColor]: {
        on: {
          goPrev: {
            // cond: (context) => !!context.memory?.selectedItem && !!context.color?.selectedItem,
            cond: () => true,
            target: EStep.EnterImei,
          },
          goNext: {
            cond: (context) => !!context.memory?.selectedItem && !!context.color?.selectedItem,
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
              checkPhone: (ctx, e) => ({ ...ctx.checkPhone, response: e.data, uiMsg: 'OK' })
            }),
          },
          onError: {
            // TODO?
            // target: EStep.CheckPhoneErr,
            actions: assign({
              checkPhone: (ctx, e: any) => {
                // console.warn(e.data instanceof AxiosError)
                return {
                  ...ctx.checkPhone,
                  result: {
                    state: 'error',
                  },
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
              photoLink: (ctx, e) => ({ ...ctx.photoLink, response: e.data, uiMsg: 'OK' })
            }),
          },
          onError: {
            // TODO?
            // target: EStep.GetPhotoLinkErr,
            actions: assign({
              photoLink: (ctx, e: any) => {
                // console.warn(e.data instanceof AxiosError)
                return {
                  ...ctx.photoLink,
                  result: {
                    state: 'error',
                  },
                  response: e?.data || e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR3}: ${JSON.stringify(e)}`
                }
              }
            })
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
            target: EStep.Final,
          },
        },
      },

      // NOTE: Done.
      [EStep.Final]: {
        on: {
          goStart: {
            target: EStep.Init,
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
          imei: (_ctx, _e) => ({ ...initialContextState.imei } ),
          memory: (_ctx, _e) => ({ ...initialContextState.memory } ),
          color: (_ctx, _e) => ({ ...initialContextState.color } ),
          checkPhone: (_ctx, _e) => ({ ...initialContextState.checkPhone } ),
          photoLink: (_ctx, _e) => ({ ...initialContextState.photoLink } ),
          photoStatus: (_ctx, _e) => ({ ...initialContextState.photoStatus } ),
          // NOTE: Etc.
        }),
      },
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
      fetchIMEIMachine: async (context, _ev, _invMeta) => {
        // NOTE: thats received data
        // console.log(_invMeta.data)
        const cleanupImeiStep = () => {
          context.imei.response = null
          context.imei.uiMsg = null
          context.imei.result.state = 'pending'
        }
        cleanupImeiStep()
        const cleanupEnterMemoryAndColorStep = () => {
          context.memory.selectedItem = null
          context.color.selectedItem = null
        }
        cleanupEnterMemoryAndColorStep()

        const res = await httpClient.sendIMEI({
          IMEI: context.imei.value,
          responseValidator: ({ res }) => res.ok && !!res?.phone?.color_choices
        })
          .catch((err) => {
            console.log(err)
            return err
          })

        if (res.ok) {
          context.imei.result.state = 'success'

          // -- TODO: Set anything to context
          // 1. Reset colorList (Will be update when memoryList will be selected)
          context.color.dynamicList = []
          // 2. Set memoryList from response
          try {
            const memoryList = Object.keys(res.phone.color_choices)
            context.imei.result.memoryList = memoryList.map((value) => ({ id: value, value, label: value.toUpperCase() }))
          } catch (err: any) {
            context.imei.result.state = 'error'
            return Promise.reject(new Error(`${EErrCode.ERR2}: res.ok But! Не удалось составить список memoryList: ${err?.message || 'No err?.message'}`))
          }
          // --

          return Promise.resolve(res)
        }

        context.imei.result.state = 'error'
        return Promise.reject(res)
      },
      checkPhoneMachine: async (context, _ev, _invMeta) => {
        const cleanupCheckPhoneStep = () => {
          context.checkPhone.response = null
          context.checkPhone.uiMsg = null
          context.checkPhone.result.state = 'pending'
        }
        cleanupCheckPhoneStep()

        const res = await httpClient.checkPhone({
          IMEI: context.imei.value,
          memory: context.imei.response?.phone.memory || context.memory.selectedItem?.value || '',
          color: context.imei.response?.phone.color || context.color.selectedItem?.value || '',
          responseValidator: ({ res }) => res.ok === true,
        })
          .catch((err) => err)

        // context.checkPhone.response = res
        if (res.ok) {
          context.checkPhone.result.state = 'success'

          // TODO?

          return Promise.resolve(res)
        }

        context.checkPhone.result.state = 'error'
        return Promise.reject(res)
      },
      getPhotoLinkMachine: async (context, _ev, _invMeta) => {
        const cleanupPhotoLinkStep = () => {
          context.photoLink.response = null
          context.photoLink.uiMsg = null
          context.photoLink.result.state = 'pending'
        }
        cleanupPhotoLinkStep()

        if (!context.baseSessionInfo.tradeinId) return Promise.reject({
          ok: false,
          message: 'tradeinId не установлен для данной сессии (запрос не был отправлен)',
        })

        const res = await httpClient.getPhotoLink({
          // TODO: Should be got from state!
          tradeinId: context.baseSessionInfo.tradeinId || 0,
          responseValidator: ({ res }) => res.ok === true,
        })
          .catch((err) => err)

        // context.photoLink.response = res
        if (res.ok) {
          context.photoLink.result.state = 'success'

          // TODO?

          return Promise.resolve(res)
        }

        context.photoLink.result.state = 'error'
        return Promise.reject(res)
      },
    },
    // guards: {
    //   "imei.length > 5": (context, event) => false,
    //   "!!color && !!memory": (context, event) => false,
    // },
    delays: {},
  },
);

// const pageActor = createActor(pageMachine).start();
