/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { httpClient } from '~/utils/httpClient'
import { vi } from '~/common/vi'

export const sendContractMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
  if (!context.imei.response?.id) return Promise.reject({
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
  // NOTE: Form should be modified!
  const dict: {
    [key: string]: {
      targetName: string;
      getTargetValue: ({ formState }: {
        formState: { [key: string]: any; } | null;
      }) => any;
    };
  } = {
    _INVERT_in_mailing_list: {
      targetName: 'in_mailing_list',
      getTargetValue: ({ formState }) =>
        typeof formState?._INVERT_in_mailing_list === 'boolean'
        ? !formState?._INVERT_in_mailing_list
        : undefined,
    },
    email: {
      targetName: 'email',
      getTargetValue: ({ formState }) =>
        typeof formState?._INVERT_in_mailing_list === 'boolean'
        ? formState?._INVERT_in_mailing_list
          ? ''
          : formState?.email
        : formState?.email,
    },
  }
  // --

  const res = await httpClient.sendContractData({
    tradeinId: context.imei.response?.id, // NOTE: Old context.baseSessionInfo.tradeinId,
    // form: context.contract.form.state,
    // -- NOTE: For example: _INVERT_in_mailing_list should be modfied...
    form: context.contract.form.state
      ? Object.keys(context.contract.form.state).reduce((acc: { [key: string]: any; }, key) => {
        switch (true) {
          case !!dict[key]:
            acc[dict[key].targetName] = dict[key].getTargetValue({ formState: context.contract.form.state })
            break
          default:
            acc[key] = context.contract.form.state?.[key]
            break
        }
        return acc
      }, {})
      : {},
    // --
    responseValidator: ({ res }) => res.ok === true,
  })
    .catch((err) => err)
  
  vi.setContractStepResponse(res)

  // NOTE: Commented cuz it will be set in states[EStep.GetPhotoLink].invoke.onDone
  // context.photoLink.response = res
  if (res.ok) {
    context.contract.result.state = 'success'
    return Promise.resolve(res)
  }

  context.contract.result.state = 'error'
  return Promise.reject(res)
}
