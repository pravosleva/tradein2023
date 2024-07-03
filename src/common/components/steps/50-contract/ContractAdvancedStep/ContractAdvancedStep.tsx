/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, ReportMessageForDevs } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'
import { useCallback, memo } from 'react'
import { ECountryCode, phoneValidation } from '~/common/xstate/stepMachine'
import { vi } from '~/common/vi'
import { TContractFormProps, TContractFormValiateResult } from '~/common/components/steps/50-contract/types'
import { useSnapshot } from 'valtio'
import { useProxy } from 'valtio/utils'
import clsx from 'clsx'
import { getIsEmailValid } from '~/utils/aux-ops'

const isDev = process.env.NODE_ENV === 'development'
// const isLocalProd = import.meta.env.VITE_LOCAL_PROD === '1'

export const ContractAdvancedStep = memo(({
  defaultCountryCode,
  onFormReady,
  onFormNotReady,
}: TContractFormProps) => {
  const viContractFormSnap = useSnapshot(vi.contractForm)
  const viContractFormProxy = useProxy(vi.contractForm)
  const viContractFormLastEditedFieldInfoProxy = useProxy(vi.contractFormLastEditedFieldInfo)
  const handleSetExternalStore = useCallback(({ name, value }: { name: string; value: any; }) => {
    viContractFormProxy[name] = value
    viContractFormLastEditedFieldInfoProxy.name = name
  }, [viContractFormProxy, viContractFormLastEditedFieldInfoProxy])

  return (
    <div className={baseClasses.stack2}>
      <div className={baseClasses.stack1}>
        {isDev && (
          <pre className={clsx('text-sm', baseClasses.preStyled)}>{JSON.stringify(viContractFormSnap, null, 2)}</pre>
        )}
        <Form
          makeFocusOnFirstInput
          defaultCountryCode={defaultCountryCode}
          onChangeField={handleSetExternalStore}
          getValues={(vals) => {
            console.log(vals)
          }}
          onFormReady={({ state }) => {
            onFormReady({ formState: state })
          }} 
          onFormNotReady={({ state }) => {
            onFormNotReady({ formState: state })
          }}
          defaultFocusedKey='retailer_name'
          __auxStateInitSpecialForKeys={['phone', 'birth_date', 'id_date_of_issue', '_INVERT_in_mailing_list', 'email']}
          schema={{
            retailer_name: {
              type: 'text',
              label: 'ФИО сотрудника салона', // Данные агента — сотрудинка салона
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.retailer_name || undefined,
            },
            id_serial_number: {
              type: 'number',
              label: 'Серия паспорта клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length !== 4:
                    res.ok = false
                    res.reason = 'Некорректное значение'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 4,
                maxLength: 4,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_serial_number || undefined,
            },
            id_number: {
              type: 'number',
              label: 'Номер паспорта клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length !== 6:
                    res.ok = false
                    res.reason = 'Некорректное значение'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 6,
                maxLength: 6,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_number || undefined,
            },
            last_name: {
              type: 'text',
              label: 'Фамилия клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.last_name || undefined,
            },
            first_name: {
              type: 'text',
              label: 'Имя клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.first_name || undefined,
            },
            patronymic: {
              type: 'text',
              label: 'Отчество клиента (не обязательно)',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: false,
              initValue: viContractFormSnap.patronymic || undefined,
            },
            id_city: {
              type: 'text',
              label: 'Место рождения клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_city || undefined,
            },
            birth_date: {
              type: 'date',
              label: 'Дата рождения клиента',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case !value:
                    res.ok = false
                    res.reason = 'Некорректное значение'
                    break
                  default:
                    break
                }
                return res
              },
              isRequired: true,
              initValue: viContractFormSnap.birth_date || undefined,
            },
            id_date_of_issue: {
              type: 'date',
              label: 'Дата выдачи (паспорт клиента)',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case !value:
                    res.ok = false
                    res.reason = 'Некорректное значение'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 1,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_date_of_issue || undefined,
            },
            id_issuing_agency_code: {
              type: 'number',
              label: 'Код подразделения (паспорт клиента)',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length === 0:
                    res.ok = false
                    res.reason = 'Некорректное значение'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 1,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_issuing_agency_code || undefined,
            },
            id_issued_by: {
              type: 'text',
              label: 'Кем выдан (паспорт клиента)',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_issued_by || undefined,
            },
            id_address: {
              type: 'text',
              label: 'Адрес прописки (паспорт клиента)',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  default:
                    break
                }
                return res
              },
              nativeRules: {
                minLength: 2,
              },
              isRequired: true,
              initValue: viContractFormSnap.id_address || undefined,
            },
            phone: {
              type: 'tel',
              label: 'Телефон клиента',
              validate: ({ value, options }) => {
                const res: TContractFormValiateResult = { ok: true }

                try {
                  const _selectedCountryCode = options?.currentCountryInfo?.countryCode // NOTE: 'ru' for example
                  // @ts-ignore
                  const codeInUi: ECountryCode = _selectedCountryCode ? _selectedCountryCode.toUpperCase() : defaultCountryCode
                  if (typeof phoneValidation[codeInUi] === 'function') {
                    res.ok = phoneValidation[codeInUi](value)
                    if (!res.ok) res.reason = 'Неверный формат'
                  } else
                    throw new Error(`Не удалось проверить номер телефона для "${codeInUi}". Проверьте, соответствует ли код стандартам ISO 3166-1 alpha-2 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2`)
                } catch (err: any) {
                  res.ok = false
                  res.reason = err?.message || 'ContractStep err115'
                }
                return res
              },
              // NOTE: No nativeRules!
              isRequired: true,
              initValue: viContractFormSnap.phone || undefined,
            },
            email: {
              type: 'email',
              label: 'Email',
              validate: ({ value }) => {
                const res: TContractFormValiateResult = { ok: true }
                switch (true) {
                  case value.length < 2:
                    res.ok = false
                    res.reason = 'Слишком короткое поле'
                    break
                  case !getIsEmailValid(value):
                    res.ok = false
                    res.reason = 'Некорректный формат'
                    break
                  default:
                    break
                }
                return res
              },
              isRequired: viContractFormSnap._INVERT_in_mailing_list ? false : true,
              initValue: viContractFormSnap.email || undefined,
              isDisabled: viContractFormSnap._INVERT_in_mailing_list || false,
            },
            _INVERT_in_mailing_list: {
              type: 'checkbox',
              label: 'Отказаться от рассылки',
              validate: () => ({ ok: true }),
              isRequired: true,
              initValue: viContractFormSnap._INVERT_in_mailing_list || false,
            },
          }}
        />
        
      </div>
      <ReportMessageForDevs />
    </div>
  )
})
