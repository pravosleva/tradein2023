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
  AnyActorRef,
  // spawn,
  // actions,
} from 'xstate'
// import { fetchIMEIMachine } from './tools/fetchIMEIMachine'
import { httpClient } from '../utils/httpClient'

export enum EStep {
  INIT = 'INIT',
  ENTER_IMEI = 'ENTER_IMEI',
  SEND_IMEI = 'SEND_IMEI',
  IMEI_ERR = 'IMEI_ERR',
  ENTER_MEM_AND_COLOR = 'ENTER_MEM_AND_COLOR',
  FINAL = 'FINAL',
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

type TState = {
  // stepName: EStep;
  imei: {
    value: string;
    response: null | any,
    uiMsg: string | null,
    result: {
      state: 'stopped' | 'pending' | 'success' | 'error';
      memoryList: { value: string; label: string; }[];
    };
    dynamic: {
      colorList: { value: string; label: string; }[];
    };
  },
  memory: {
    selectedItem: string | null;
  };
  color: {
    selectedItem: string | null;
  };
  someRef?: AnyActorRef;
}

export const stepMachine = createMachine<TState>(
  {
    initial: EStep.INIT,
    context: {
      imei: {
        value: '',
        response: null,
        uiMsg: null,
        result: {
          state: 'stopped',
          memoryList: [],
        },
        dynamic: {
          colorList: [],
        },
      },
      memory: {
        selectedItem: null,
      },
      color: {
        selectedItem: null,
      },
    },
    states: {
      [EStep.INIT]: {
        on: {
          goIMEI: {
            target: EStep.ENTER_IMEI,
          },
        }
      },

      // NOTE: IMEI
      [EStep.ENTER_IMEI]: {
        on: {
          goNext: {
            cond: (context) => context.imei.value.length > 5,
            target: EStep.SEND_IMEI,
          },
        }
      },
      [EStep.SEND_IMEI]: {
        invoke: {
          src: 'fetchIMEIMachine',
          data: (context) => ({
            imei: context.imei,
            expText: 'exp text',
          }),
          onDone: {
            target: EStep.ENTER_MEM_AND_COLOR,
            actions: assign({
              imei: (ctx, e) => ({ ...ctx.imei, response: e, uiMsg: 'OK' })
            })
          },
          onError: {
            target: EStep.IMEI_ERR,
            actions: assign({
              imei: (ctx, e: typeof Error | any) => {
                console.warn(e.data)
                return {
                  ...ctx.imei,
                  response: e,
                  uiMsg: e?.data?.message || `${EErrCode.ERR1}: ${JSON.stringify(e)}`
                }
              }
            })
          },
        },
      },
      [EStep.IMEI_ERR]: {
        on: {
          prevStep: {
            target: EStep.ENTER_IMEI,
          },
        }
      },

      // NOTE: Memory and Color
      [EStep.ENTER_MEM_AND_COLOR]: {
        on: {
          goNext: {
            cond: (context) => !!context.memory?.selectedItem && !!context.color?.selectedItem,
            target: EStep.FINAL,
          },
        }
      },

      [EStep.FINAL]: {},
    },
    on: {
      SET_IMEI: {
        actions: assign({
          imei: (ctx, e) => ({ ...ctx.imei, value: e.value } ),
        }),
      },
      SET_COLOR: {
        actions: assign({
          color: (ctx, e) => ({ ...ctx.color, value: e.value } ),
        }),
      },
      SET_MEMORY: {
        actions: assign({
          memory: (ctx, e) => ({ ...ctx.memory, value: e.value } ),
        }),
      },
    },
  },
  {
    // actions: {
    //   imeiSendStart: assign({
    //     imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'pending' } }),
    //   }),
    //   imeiSendOk: assign({
    //     imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'success' } }),
    //   }),
    //   imeiSendErr: assign({
    //     imei: (ctx) => ({ ...ctx.imei, req: { ...ctx.imei.req, state: 'error' } } ),
    //   }),
    // },
    services: {
      fetchIMEIMachine: async (context, _ev, _invMeta) => {
        context.imei.result.state = 'pending'

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
          context.imei.dynamic.colorList = []
          // 2. Set memoryList from response
          try {
            const memoryList = Object.keys(res.phone.color_choices)
            context.imei.result.memoryList = memoryList.map((value) => ({ value, label: value.toUpperCase() }))
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
    },
    // guards: {
    //   "imei.length > 5": (context, event) => false,
    //   "!!color && !!memory": (context, event) => false,
    // },
    delays: {},
  },
);

// const pageActor = createActor(pageMachine).start();
