/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { ECountryCode, TStepMachineContextFormat, phoneValidation } from '~/common/xstate/stepMachine'
import { httpClient, NResponseValidate, NSP } from '~/utils/httpClient'
import { vi } from '~/common/vi'

export const getUserDataMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
  const cleanupInitAppStep = () => {
    context.initApp.response = null
    context.initApp.uiMsg = null
    context.initApp.result.state = 'pending'
  }
  cleanupInitAppStep()
  const res = await httpClient.getUserData({
    rules: {
      user_data: {
        isRequired: true,
        validate: (val) => {
          const requiredFields = ['display_name']
          const res: NResponseValidate.TResult<NSP.TUserDataResponse> = { ok: true }
          const msgs = []

          for (const key of requiredFields) if (!val?.[key]) msgs.push(`Не найдено поле ${key}`)

          if (msgs.length > 0) {
            res.ok = false
            res.message = `Результат проверки поля res.user_data -> ${msgs.join(', ')}`
          }
          return res
        },
      },
      session_data: {
        isRequired: true,
        validate: (val) => {
          const requiredFields = ['tradein_id']
          const res: NResponseValidate.TResult<NSP.TUserDataResponse>  = { ok: true }
          const msgs = []

          for (const key of requiredFields) if (!val?.[key]) msgs.push(`Не найдено поле ${key}`)

          if (msgs.length > 0) {
            res.ok = false
            res.message = `Результат проверки поля res.session_data -> ${msgs.join(', ')}`
          }
          return res
        },
      },
      features: {
        isRequired: true,
        validate: (val) => {
          const subfieldsForCheck = ['country_code']
          const res: NResponseValidate.TResult<NSP.TUserDataResponse> = { ok: true }
          const msgs = []

          for (const key of subfieldsForCheck) {
            switch (key) {
              case 'country_code':
                if (!val?.[key]) msgs.push(`Не найдено поле "${key}"`)
                else if (typeof val[key] !== 'string') msgs.push(`Поле "${key}" лолжно быть строкой (получен тип ${typeof val[key]})`)
                else if (!Object.keys(ECountryCode).includes(val?.[key])) {
                  msgs.push(`Получено нестандартное поле ${key} со значением "${val?.[key]}" (${typeof val?.[key]}). Возможные причины:`)
                  msgs.push(`1) Проверьте, соответствует ли код "${val?.[key]}" стандартам ISO 3166-1 alpha-2 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2`)
                  msgs.push(`2) Список поддерживаемых фронтом ключей "${Object.values(ECountryCode).join(', ')}" не содержит ключ "${val?.[key]}"`)
                }
                // @ts-ignore
                else if (!phoneValidation[val[key]]) msgs.push(`FRONT ERR (не проработан кейс)! Проверьте поддерживаемые фронтом ключи phoneValidation[${val[key]}]: (val: string) => boolean; для проверки количества символов номера телефона`)
                break
              default:
                break
            }
          }

          if (msgs.length > 0) {
            res.ok = false
            res.message = `Результат проверки поля res.features -> ${msgs.join(', ')}`
            // res._showDetailsInUi = true
          }
          return res
        },
      },
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
