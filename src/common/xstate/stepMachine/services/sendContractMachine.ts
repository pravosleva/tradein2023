/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { httpClient } from '~/utils/httpClient'
import { vi } from '~/common/vi'

export const sendContractMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
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
  
  vi.setContractStepResponse(res)

  // NOTE: Commented cuz it will be set in states[EStep.GetPhotoLink].invoke.onDone
  // context.photoLink.response = res
  if (res.ok) {
    context.contract.result.state = 'success'
    return Promise.resolve(res)
  }

  context.photoLink.result.state = 'error'
  return Promise.reject(res)
}
