/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { ECountryCode, TStepMachineContextFormat, phoneValidation } from '~/common/xstate/stepMachine'
import { httpClient } from '~/utils/httpClient'
import { vi } from '~/common/vi'

export const getUserDataMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
  const cleanupInitAppStep = () => {
    context.initApp.response = null
    context.initApp.uiMsg = null
    context.initApp.result.state = 'pending'
  }
  cleanupInitAppStep()
  const res = await httpClient.getUserData({
    // NOTE: Validation by different ways exp
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

            for (const key of requiredFields) if (!val?.[key]) msgs.push(`Не найдено поле ${key}`)

            if (msgs.length > 0) {
              res.ok = false
              res.message = `res.user_data -> ${msgs.join(', ')}`
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

            for (const key of requiredFields) if (!val?.[key]) msgs.push(`Не найдено поле ${key}`)

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
            const requiredFields = ['country_code']
            const res: { ok: boolean; message?: string; } = { ok: true }
            const msgs = []

            for (const key of requiredFields) {
              switch (key) {
                case 'country_code':
                  if (!val?.[key]) msgs.push(`Не найдено поле ${key}`)
                  else if (typeof val[key] !== 'string') msgs.push(`Поле ${key} лолжно быть строкой (получен тип ${typeof val[key]})`)
                  else if (!Object.keys(ECountryCode).includes(val?.[key])) {
                    msgs.push(`Получено нестандартное поле ${key} со значением "${val?.[key]}" (${typeof val?.[key]})`)
                    msgs.push(`1) Проверьте, соответствует ли код "${val?.[key]}" стандартам ISO 3166-1 alpha-2 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2`)
                    msgs.push(`2) Поддерживаемые фронтом ключи: ${Object.values(ECountryCode).join(', ')}`)
                  }
                  // @ts-ignore
                  else if (!phoneValidation[val[key]]) msgs.push(`FRONT WTF! Проверьте поддерживаемые фронтом ключи phoneValidation[${val[key]}]: (val: string) => boolean; для проверки количества символов номера телефона: Не проработан кейс!`)
                  break
                default:
                  break
              }
            }

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
        if (rules[key].isRequired && !res[key]) msgs.push(`Не найдено обязательное поле ${key} в ответе`)
        else {
          const validateResult = rules[key].validate(res[key])
          if (!validateResult.ok) msgs.push(validateResult?.message || 'No message')
        }
      }

      if (msgs.length > 0) {
        result.ok = false
        result.message = `Неожиданный ответ от сервера: ${msgs.join(' // ')}`
      }

      return result
    }
  })
    .catch((err: any) => err)

  vi.setUserDataResponse(res)

  if (res.ok) {
    context.contract.result.state = 'success'
    return Promise.resolve(res)
  }

  context.photoLink.result.state = 'error'
  return Promise.reject(res)
}
