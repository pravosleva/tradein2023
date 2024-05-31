/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { httpClient } from '~/utils/httpClient'

export const getPhotoLinkMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
  const cleanupPhotoLinkStep = () => {
    context.photoLink.response = null
    context.photoLink.uiMsg = null
    context.photoLink.result.state = 'pending'
  }
  cleanupPhotoLinkStep()

  if (!context.imei.response?.id) return Promise.reject({
    ok: false,
    message: 'tradeinId не установлен для данной сессии (запрос не был отправлен)',
  })

  const res = await httpClient.getPhotoLink({
    tradeinId: context.imei.response?.id || 0,
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
}
