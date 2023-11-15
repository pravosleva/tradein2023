/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { httpClient } from '~/utils/httpClient'

export const checkPhoneMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
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
}