/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'
import { useStore } from '~/common/context/WithAppContextHOC';
import { useCallback } from 'react';
import { useCompare } from '~/common/hooks/useDeepEffect';
import { ECountryCode, phoneValidation } from '~/common/xstate/stepMachine';

type TProps = {
  defaultCountryCode: ECountryCode;
  onFormReady: ({ formState }: { formState: any; }) => void;
  onFormNotReady: ({ formState }: { formState: any; }) => void;
}
type TValiateResult = { ok: boolean; reason?: string; }

export const ContractStep = ({
  defaultCountryCode,
  onFormReady,
  onFormNotReady,
}: TProps) => {
  // : [{ [key: string]: any } | null, (data: any) => void]
  const [auxContractForm, setStore] = useStore((store) => store.auxContractForm)
  const handleSetExternalStore = useCallback(({ name, value }: { name: string; value: any; }) => {
    // console.log(name, value)
    setStore({ auxContractForm: { ...auxContractForm, [name]: value } })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStore, useCompare([auxContractForm])])

  return (
    <div className={baseClasses.stack}>
      <Form
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
        schema={{
          lastName: {
            type: 'text',
            label: 'Фамилия',
            validate: ({ value }) => {
              const res: TValiateResult = { ok: true }
              switch (true) {
                case value.length < 3:
                  res.ok = false
                  res.reason = 'Слишком короткое поле'
                  break
                default:
                  break
              }
              return res
            },
            isRequired: true,
            initValue: auxContractForm?.['lastName'] || undefined,
          },
          name: {
            type: 'text',
            label: 'Имя',
            validate: ({ value }) => {
              const res: TValiateResult = { ok: true }
              switch (true) {
                case value.length < 3:
                  res.ok = false
                  res.reason = 'Слишком короткое поле'
                  break
                default:
                  break
              }
              return res
            },
            isRequired: true,
            initValue: auxContractForm?.['name'] || undefined,
          },
          middleName: {
            type: 'text',
            label: 'Отчество',
            validate: ({ value }) => {
              const res: TValiateResult = { ok: true }
              switch (true) {
                case value.length < 3:
                  res.ok = false
                  res.reason = 'Слишком короткое поле'
                  break
                default:
                  break
              }
              return res
            },
            isRequired: true,
            initValue: auxContractForm?.['middleName'] || undefined,
          },
          phone: {
            type: 'tel',
            label: 'Телефон',

            // -- TODO? Validation for other countries
            validate: ({ value, options }) => {
              const res: TValiateResult = { ok: true }

              try {
                const _selectedCountryCode = options?.currentCountryInfo?.countryCode // NOTE: 'ru' for example
                // @ts-ignore
                const codeInUi: ECountryCode = _selectedCountryCode ? _selectedCountryCode.toUpperCase() : defaultCountryCode

                if (typeof phoneValidation[codeInUi] === 'function') {
                  res.ok = phoneValidation[codeInUi](value)
                  if (!res.ok) res.reason = 'Неверный формат'
                } else throw new Error(`Не удалось проверить номер телефона для ${codeInUi}. Проверьте, соответствует ли код стандартам ISO 3166-1 alpha-2 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2`)

              } catch (err: any) {
                res.ok = false
                res.reason = err?.message || 'ContractStep err120'
              }

              // switch (true) {
              //   case value.length !== 11:

              //     // TODO: countryCode

              //     res.ok = false
              //     res.reason = 'Заполните это поле корректно'
              //     break
              //   default:
              //     break
              // }
              return res
            },
            // NOTE: For example (ru) 79163385212
            // -- 
            
            isRequired: true,
            initValue: auxContractForm?.['phone'] || undefined,
          },
        }}
      />
      {/* <pre className={baseClasses.preStyled}>{JSON.stringify(auxContractForm, null, 2)}</pre> */}
    </div>
  )
}
