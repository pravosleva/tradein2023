/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseClasses from '~/App.module.scss'
import { Input } from '~/common/components/sp-custom'
import { useForm } from 'react-hook-form'
import { useLayoutEffect, Fragment, useState, useCallback, useRef, memo } from 'react'
import clsx from 'clsx'
import { PhoneInput } from '~/common/components/sp-custom'
import { CountryData as ICountryEvent } from 'react-phone-input-2'
import { ECountryCode } from '~/common/xstate/stepMachine'
// import { useCompare } from '~/common/hooks/useDeepEffect'

type TFieldType = 'text' | 'number' | 'tel'
type TField = {
  label: string;
  initValue?: any; // string | number;
  type: TFieldType;
  validate: ({ value, options }: {
    value: any;
    options?: {
      currentCountryInfo?: ICountryEvent;
    };
  }) => ({
    ok: boolean;
    reason?: string;
  });
  isRequired?: boolean;
}

type TProps = {
  onChangeField?: (e: any) => void;
  schema: {
    [key: string]: TField;
  };
  // onSubmit: (data: any) => void;
  onFormReady: ({ state }: { state: any; }) => void;
  onFormNotReady: ({ state }: { state: any; }) => void;
  getValues: (data: any) => any;
  defaultCountryCode: ECountryCode;
}

export const Form = memo(({
  onChangeField,
  schema,
  // onSubmit,
  getValues: _getValues,
  onFormReady,
  onFormNotReady,
  defaultCountryCode,
}: TProps) => {
  const currentCountryInfoRef = useRef<ICountryEvent | undefined>(undefined)

  const {
    register,
    // handleSubmit,
    // getValues,
    // formState: {
    //   errors,
    //   // defaultValues,
    //   isDirty,
    //   // isValid,
    //   // ...restFormStateProps
    // },
    // clearErrors,
    watch,
    setValue,
    // reset,
    // getFieldState,
    // setError,
    // trigger,
    // ... restProps
  } = useForm({
    values: Object.keys(schema).reduce((acc: any, key: string) => {
      acc[key] = schema[key].initValue || ''
      return acc
    }, {})
  })
  const [auxState, setAuxState] = useState<{[key: string]: any}>({
    phone: '',
  })
  const setAuxStateValue = useCallback((fn: string, val: any) => {
    setAuxState((s) => ({ ...s, [fn]: val }))
  }, [setAuxState])

  const [_errsState, _setErrsState] = useState<{[key: string]: any}>({})
  // const _setErrValue = useCallback((fn: string, val: any) => {
  //   _setErrsState((s) => ({ ...s, [fn]: val }))
  // }, [_setErrsState])
  const [_okState, _setOkState] = useState<{[key: string]: any}>({})

  const rendersCounterRef = useRef<number>(0)
  useLayoutEffect(() => {
    if (rendersCounterRef.current === 0) {
      const fieldsToInit = ['phone'].reduce((acc: any, cur: string) => {
        if (schema[cur]?.initValue) acc.push(cur)
        return acc
      }, [])
    
      const isAusStateInitNeeded = fieldsToInit.length > 0
      if (isAusStateInitNeeded) {
        setAuxState((s) => ({
          ...s,
          ...fieldsToInit.reduce((acc: {[key: string]: any}, key: string) => { acc[key] = schema[key]?.initValue; return acc; } ,{}),
        }))
      }
    }

    rendersCounterRef.current += 1
  }, [setAuxState, schema])

  // NOTE: Callback version of watch. It's your responsibility to unsubscribe when done.
  
  useLayoutEffect(() => {
    const subscription = watch(( state, { name /*, type */ }) => {
      // -- NOTE: Aux external store for restore form
      if (onChangeField) onChangeField({ name, value: state[String(name)] })
      // --

      // console.log({ state, name, type })
      // const counters = { ok: 0, fail: 0 }
      const errsObj: any = {}
      const okObj: any = {}
      for (const key in schema) {
        switch (key) {
          default:
            if (schema[key].isRequired) {
              let options = undefined
              if (key === 'phone') {
                options = { currentCountryInfo: currentCountryInfoRef.current }
                // console.log(options)
              }
              const validationResult = schema[key].validate({ value: state[key], options })
              // if (key === 'phone') console.log(validationResult)
              if (!validationResult.ok) {
                // counters.fail += 1
                errsObj[key] = validationResult.reason
                okObj[key] = false
              } else {
                // counters.ok += 1
                okObj[key] = true
              }
            } else {
              // counters.ok += 1
              okObj[key] = true
            }
            break
        }
      }
      // NOTE: _setErrValue(key, null) -> errsObj
      _setErrsState(errsObj)
      _setOkState(okObj)

      if (Object.keys(errsObj).length === 0) onFormReady({ state })
      else onFormNotReady({ state })
    })
    return () => subscription.unsubscribe()
  }, [watch, schema, onFormReady, onFormNotReady, onChangeField, _setErrsState, _setOkState])

  // const tst = () => {
  //   const values = getValues()
  //   _getValues({ values, isDirty, isValid })
  // }

  // useEffect(() => {
  //   const subscription = watch((state) => {
  //     for (const key in schema) {
  //       // console.log(key,schema[key].isRequired )
  //       switch (key) {
  //         default:
  //           if (schema[key].isRequired) {
  //             if (schema[key].validate(state[key])) {
  //               _setErrValue(key, undefined)
  //             } else {
  //               _setErrValue(key, 'Заполните это поле')
  //             }
  //           } else {
  //             _setErrValue(key, undefined)
  //           }
  //           break
  //       }
  //     }
  //   })
  //   return () => subscription.unsubscribe()
  // }, [_setErrValue, schema, watch])

  return (
    <>
      <div
        // onSubmit={handleSubmit(onSubmit)}
        // className={baseClasses.specialActionsGrid}
        className={clsx(
          'grid',
          'gap-3',
          'mb-6',
          'md:grid-cols-1',
        )}
      >
        {
          Object.keys(schema).map((key) => {
            switch (schema[key].type) {
              case 'tel':
                return (
                  <Fragment key={key}>
                    <div
                      // className={clsx(baseClasses.stack1)}
                    >
                      {/* <label
                        htmlFor={key}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >{schema[key].label}</label> */}
                      <PhoneInput
                        // ruOnly
                        defaultCountryCode={defaultCountryCode}
                        // key={key}
                        // isErrored={!!_errsState[key]}
                        isSuccess={_okState[key] === true}
                        value={auxState.phone}
                        // @ts-ignore
                        onChange={(val: string, _countryEvent: TCountryEvent) => {
                          // console.log('--')
                          // console.log(`${currentCountryInfoRef.current?.countryCode} -> ${_countryEvent.countryCode}`)
                          currentCountryInfoRef.current = _countryEvent
                          // console.log('--')
                          // setAuxStateValue("phoneNumber", formatPhoneNumberIntl(e))
                          const rusSymbolsToChangeP7 = ['7', '+7', '8', '+8']
                          const rusSymbolsToChangeP79 = ['9', '+9']
                          // TODO? const rusSymbolsToChangeP791 = ['78']
                          if (rusSymbolsToChangeP7.includes(val)) {
                            setAuxStateValue('phone', '+7' || '');
                            setValue('phone', '7')
                            return;
                          }
                          if (rusSymbolsToChangeP79.includes(val)) {
                            setAuxStateValue('phone', '+79' || '');
                            setValue('phone', '79')
                            return;
                          }
                          setAuxStateValue('phone', `+${val}` || '');
                          setValue('phone', val)
                        }}
                      />
                      {/* !!_errsState[key] && (
                        <span>{_errsState[key]}</span>
                      ) */}
                    </div>
                  </Fragment>
                )
              case 'text':
              default:
                return (
                  <Fragment key={key}>
                    <div
                      className={clsx(baseClasses.stack1)}
                    >
                      {/* <label htmlFor={key}>{schema[key].label}</label> */}
                      <Input
                        style={{ width: '100%' }}
                        // isErrored={!!_errsState[key]}
                        isSuccess={_okState[key] === true}
                        id={key}
                        // aria-invalid={errors[key] ? 'true' : 'false'}
                        placeholder={schema[key].label}
                        {...register(key, { required: schema[key].isRequired, maxLength: 30, minLength: 3 })}
                      />
                      {/* use role="alert" to announce the error message */}
                      {/* {errors.name && errors.name.type === "required" && (
                        <span role="alert">This is required</span>
                      )}
                      {errors.name && errors.name.type === "maxLength" && (
                        <span role="alert">Max length exceeded</span>
                      )} */}
                      {/* !!_errsState[key] && (
                        <span>{_errsState[key]}</span>
                      ) */}
                    </div>
                  </Fragment>
                )
            }
          })
        }
        {/* <Input type="submit" /> */}
      </div>
      {/* <pre>{JSON.stringify(_errsState, null, 2)}</pre> */}
      {/* <button onClick={tst}>tst</button> */}
    </>
  )
})
