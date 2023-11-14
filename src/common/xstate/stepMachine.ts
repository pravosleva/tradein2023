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
  AppInit = 'app-init',
  AppInitErr = 'app-init-err',
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
  Contract = 'contract',
  ContractSending = 'contract-sending',
  ContractError = 'contract-error',

  Final = 'final',
}
enum EErrCode {
  ERR1 = 'ERR1',
  ERR2 = 'ERR2',
  ERR3 = 'ERR3',
  ERR4 = 'ERR4',
  ERR5 = 'ERR5',
  ERR6 = 'ERR6',
  ERR7 = 'initApp error',
  ERR8 = 'ERR8',
}

export type TSelectedItem = { value: string; label: string; }

// NOTE: ISO 3166-1 alpha-2 codes
// See also https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export enum ECountryCode {
  RU = 'RU',
  KZ = 'KZ',
  BY = 'BY',
  // Etc.
}
export const phoneValidation: {
  [key in ECountryCode]: (val: string) => boolean;
} = {
   [ECountryCode.RU]: (val: string) => val.length === 11, // NOTE: 79163385212
   [ECountryCode.KZ]: (val: string) => val.length === 11,
   [ECountryCode.BY]: (val: string) => val.length === 12,
   // Etc.
}

type TState = {
  baseSessionInfo: {
    // -- TODO: Wich format will be received from backend?
    tradeinId: number | null;
    defaultCountryCode: ECountryCode;
    // --
  },
  initApp: {
    response: null | NSP.TUserDataResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
  },
  imei: {
    value: string;
    response: null | NSP.TImeiResponse;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
      memoryList: { id: string; value: string; label: string; }[];
    };
  },
  memory: {
    selectedItem: TSelectedItem | null;
    dynamicList: { id: string; value: string; label: string; }[];
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
  contract: {
    response: any;
    uiMsg: string | null;
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
    };
    form: {
      state: null | {
        [key: string]: any;
      };
      isReady: boolean;
    };
  },
}
const initialContextState: TState = {
  baseSessionInfo: {
    tradeinId: 1,
    defaultCountryCode: ECountryCode.RU,
  },
  initApp: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
  },
  imei: {
    value: '',
    response: null,
    uiMsg: null,
    result: {
      state: 'stopped',
      memoryList: [],
    },
  },
  memory: {
    dynamicList: [],
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
  contract: {
    response: null,
    uiMsg:null,
    result: {
      state: 'stopped',
    },
    form: {
      state: null,
      isReady: false,
    },
  },
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
      fetchIMEIMachine: async (context, _ev, _invMeta) => {
        // NOTE: thats received data from states[EStep.SendImei].invoke.data (for example)
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
            return { ok: false, ...(err || { ok: false, message: err?.message || EErrCode.ERR4 }) }
          })

        if (res.ok) {
          context.imei.result.state = 'success'

          // -- NOTE: Set anything to state.context
          // 1. Reset dynamic lists (Col: Will be update when memoryList will be selected; Mem: too)
          context.color.dynamicList = []
          context.memory.dynamicList = []
          // 2. Set memoryList from response
          try {
            // ---
            // TODO: Check color_choices
            // 2.1 Incorrect res.phone?.color_choices
            // ---
            const memoryList = Object.keys(res.phone?.color_choices)
            context.imei.result.memoryList = memoryList.map((value) => ({ id: value, value, label: value.toUpperCase() }))
          } catch (err: any) {
            context.imei.result.state = 'error'
            return Promise.reject(new Error(`${EErrCode.ERR5}: res.ok But! Не удалось составить список memoryList: ${err?.message || 'No err?.message'}`))
          }
          // ---
          // TODO: Обработка ошибочных кейсов
          // 3.1 Память определена: Формируем список выбора цветов
          if (res.phone.memory) {
            if (!res.phone.color_choices[res.phone.memory]) return Promise.reject({ ok: false, message: `Неконсистентный ответ: нет выбора цвета для памяти ${res.phone.memory}` })
            context.color.dynamicList = res.phone.color_choices[res.phone.memory].map((value: string) => ({ id: value, label: getReadableSnakeCase(value), value }))
          }
          // 3.2 Цвет определен, память - нет: Формируем выбор памяти
          if (res.phone.color && !res.phone.memory) {
            if (!res.phone.memory_choices) return Promise.reject({ ok: false, message: 'Неконсистентный ответ: нет выбора памяти' })
            const memoryDynamicList = []
            for (const memory in res.phone.color_choices) {
              const _list = res.phone.color_choices[memory]
              if (_list.includes(res.phone.color)) memoryDynamicList.push({ id: memory, value: memory, label: memory.toUpperCase() })
            }
            if (memoryDynamicList.length === 0) return Promise.reject({ ok: false, message: `Неконсистентный ответ: не удалось сформировать список выбора памяти для цвета ${res.phone.color}` })
            context.memory.dynamicList = memoryDynamicList
          }
          // ---
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

        // NOTE: Commented cuz it will be set in states[EStep.CheckPhone].invoke.onDone
        // context.checkPhone.response = res
        if (res.ok) {
          context.checkPhone.result.state = 'success'

          // --
          // TODO? More cases for status.fake | status.bad_quality
          // --

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
          tradeinId: context.baseSessionInfo.tradeinId || 0,
          responseValidator: ({ res }) => res.ok === true,
        })
          .catch((err) => err)

        // NOTE: Commented cuz it will be set in states[EStep.GetPhotoLink].invoke.onDone
        // context.photoLink.response = res
        if (res.ok) {
          context.photoLink.result.state = 'success'

          // TODO: Seit image src to state -> show it in ui

          return Promise.resolve(res)
        }

        context.photoLink.result.state = 'error'
        return Promise.reject(res)
      },
      sendContractMachine: async (context, _ev, _invMeta) => {
        if (!context.baseSessionInfo.tradeinId) return Promise.reject({
          ok: false,
          message: 'tradeinId не установлен для данной сессии (запрос не был отправлен)',
        })
        if (!context.contract.form.state || !context.contract.form.isReady) return Promise.reject({
          ok: false,
          message: '(FRONT WTF) Неожиданное состояние формы Договора',
        })

        const cleanupContractStep = () => {
          context.contract.response = null
          context.contract.uiMsg = null
          context.contract.result.state = 'pending'
        }
        cleanupContractStep()

        // --
        // TODO: form should be modified!
        // --

        const res = await httpClient.sendContractData({
          tradeinId: context.baseSessionInfo.tradeinId,
          form: context.contract.form.state,
          responseValidator: ({ res }) => res.ok === true,
        })
          .catch((err) => err)

        // NOTE: Commented cuz it will be set in states[EStep.GetPhotoLink].invoke.onDone
        // context.photoLink.response = res
        if (res.ok) {
          context.contract.result.state = 'success'
          return Promise.resolve(res)
        }

        context.photoLink.result.state = 'error'
        return Promise.reject(res)
      },
      getUserDataMachine: async (context, _ev, _invMeta) => {
        const cleanupInitAppStep = () => {
          context.initApp.response = null
          context.initApp.uiMsg = null
          context.initApp.result.state = 'pending'
        }
        cleanupInitAppStep()
        const res = await httpClient.getUserData({
          // responseValidator: ({ res }) => res.ok === true,
          responseValidate: ({ res }): { ok: boolean; message?: string; } => {
            const result: { ok: boolean; message?: string; } = { ok: true }
            const rules: {
              [key: string]: {
                isRequired: boolean;
                validate: (val: any) => { ok: boolean; message?: string; }
              };
            } = {
              user_data: {
                isRequired: true,
                validate: (val: any): { ok: boolean; message?: string; } => {
                  const requiredFields = ['display_name']
                  const res: { ok: boolean; message?: string; } = { ok: true }
                  const msgs = []
                  for (const key of requiredFields) if (!val?.[key]) msgs.push(`Отсутствует обязательное поле ${key}`)

                  if (msgs.length > 0) {
                    res.ok = false
                    res.message = `res.user_data ${msgs.join(', ')}`
                  }
                  return res
                },
              },
              session_data: {
                isRequired: true,
                validate: (val: any): { ok: boolean; message?: string; } => {
                  const requiredFields = ['tradein_id']
                  const res: { ok: boolean; message?: string; } = { ok: true }
                  const msgs = []
                  for (const key of requiredFields) if (!val?.[key]) msgs.push(`Отсутствует обязательное поле ${key}`)

                  if (msgs.length > 0) {
                    res.ok = false
                    res.message = `res.session_data -> ${msgs.join(', ')}`
                  }
                  return res
                },
              },
              features: {
                isRequired: true,
                validate: (val: any): { ok: boolean; message?: string; } => {
                  const res: { ok: boolean; message?: string; } = { ok: true }
                  const msgs = []
                  if (!val) msgs.push('Отсутствует обязательное поле res.features')
                  if (msgs.length > 0) {
                    res.ok = false
                    res.message = `res.features -> ${msgs.join(', ')}`
                  }
                  return res
                },
              },
            }

            const msgs: string[] = []
            for (const key in rules) {
              const validateResult = rules[key].validate(res[key])
              if (!validateResult.ok) msgs.push(validateResult?.message || 'No message')
            }

            if (msgs.length > 0) {
              result.ok = false
              result.message = `Неожиданный ответ от сервера: ${msgs.join('; ')}`
            }

            return result
          }
        })
          .catch((err) => err)

        if (res.ok) {
          context.contract.result.state = 'success'
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
