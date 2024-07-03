/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseClasses from '~/App.module.scss'
import { Input, Textarea } from '~/common/components/sp-custom'
import { useForm } from 'react-hook-form'
import { useLayoutEffect, Fragment, useState, useCallback, useRef, memo } from 'react'
import clsx from 'clsx'
import { Alert, PhoneInput } from '~/common/components/sp-custom'
import { CountryData as ICountryEvent } from 'react-phone-input-2'
import { ECountryCode } from '~/common/xstate/stepMachine'
// import useDynamicRefs from 'use-dynamic-refs'
import classes from './Form.module.scss'
import inputClasses from '~/common/components/sp-custom/Input/Input.module.scss'
// import {
//   FiSlash,
//   // FiCheckCircle,
//   // FiCheck,
// } from 'react-icons/fi'
import { HiCheckCircle, HiMinusCircle } from 'react-icons/hi'

type TFieldType = 'text' | 'text-multiline' | 'number' | 'tel' | 'date' | 'email' | 'checkbox'
type TField = {
  label?: string;
  initValue?: any; // string | number;
  type: TFieldType;
  limit?: number;
  descr?: string;
  validate: ({ value, options, cfg }: {
    value: any;
    options?: {
      currentCountryInfo?: ICountryEvent;
    };
    cfg?: {
      [key: string]: any;
    };
  }) => ({
    ok: boolean;
    reason?: string;
  });
  nativeRules?: {
    placeholder?: string;
    // min: number | string;
    // max: number | string;
    maxLength?: number;
    minLength?: number;
  };
  isRequired?: boolean;
  isDisabled?: boolean;
}

type TProps = {
  defaultFocusedKey?: string;
  onChangeField?: (e: any) => void;
  schema: {
    [key: string]: TField;
  };
  // onSubmit: (data: any) => void;
  onFormReady: ({ state }: { state: any; }) => void;
  onFormNotReady: ({ state }: { state: any; }) => void;
  getValues: (data: any) => any;
  defaultCountryCode: ECountryCode;
  makeFocusOnFirstInput?: boolean;
  __auxStateInitSpecialForKeys?: string[];
}

export const Form = memo(({
  defaultFocusedKey,
  onChangeField,
  schema,
  // onSubmit,
  getValues: _getValues,
  onFormReady,
  onFormNotReady,
  defaultCountryCode,
  // makeFocusOnFirstInput,
  __auxStateInitSpecialForKeys,
}: TProps) => {
  const currentCountryInfoRef = useRef<ICountryEvent | undefined>(undefined)

  // const [getRef, setRef] = useDynamicRefs()
  // useEffect(() => {
  //   if (makeFocusOnFirstInput) {
  //     const focusedInput = getRef('lastName')
  //     console.log(focusedInput?.current)
  //     try {
  //       // @ts-ignore
  //       focusedInput?.current?.focus()
  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   }
  // }, [makeFocusOnFirstInput, getRef, schema])
  const {
    register,
    // handleSubmit,
    // getValues,
    // formState: {
    //   errors,
    //   // defaultValues,
    //   isDirty,
    //   // isValid,
    //   ...restFormStateProps
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
      acc[key] = typeof schema[key].initValue !== 'undefined'
        ? schema[key].initValue
        : ''
      return acc
    }, {})
  })
  const [__auxState, __setAuxState] = useState<{[key: string]: any}>({
    phone: '',
  })
  const setAuxStateValue = useCallback((fn: string, val: any) => {
    __setAuxState((s) => ({ ...s, [fn]: val }))
  }, [__setAuxState])

  const [__errsState, __setErrsState] = useState<{[key: string]: any}>({})
  // const _setErrValue = useCallback((fn: string, val: any) => {
  //   __setErrsState((s) => ({ ...s, [fn]: val }))
  // }, [__setErrsState])
  const [__okState, __setOkState] = useState<{[key: string]: any}>({})

  const rendersCounterRef = useRef<number>(0)
  useLayoutEffect(() => {
    if (rendersCounterRef.current === 0) {
      const fieldsToInit = (__auxStateInitSpecialForKeys || ['phone']).reduce((acc: any, cur: string) => {
        if (typeof schema[cur]?.initValue !== 'undefined') acc.push(cur)
        return acc
      }, [])
    
      const isAuxStateInitNeeded = fieldsToInit.length > 0
      if (isAuxStateInitNeeded) {
        __setAuxState((s) => ({
          ...s,
          ...fieldsToInit.reduce((acc: {[key: string]: any}, key: string) => { acc[key] = schema[key]?.initValue; return acc; } ,{}),
        }))
      }
    }

    rendersCounterRef.current += 1
  }, [__setAuxState, schema, __auxStateInitSpecialForKeys])

  const lastNameRef = useRef<HTMLInputElement>(null)
  const retailerNameRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    if (rendersCounterRef.current > 1) return
    else {
      if (defaultFocusedKey && !!schema[defaultFocusedKey]) {
        switch (defaultFocusedKey) {
          case 'retailer_name':
            if (retailerNameRef?.current) retailerNameRef?.current?.focus()
            break
          case 'last_name':
            if (lastNameRef?.current) lastNameRef?.current?.focus()
            break
          default:
            console.warn(`Init focus: Не настроено для ${defaultFocusedKey}`)
            break
        }
      }
      rendersCounterRef.current += 1
    }
  }, [defaultFocusedKey, schema])

  // NOTE: Callback version of watch. It's your responsibility to unsubscribe when done.
  
  useLayoutEffect(() => {
    const subscription = watch(( state, { name, /* type */ }) => {
      // -- NOTE: Aux external store for restore form
      if (onChangeField && !!name) onChangeField({ name, value: state[String(name)] })
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
              const validationResult = schema[key].validate({ value: state[key], options, cfg: schema[key] })
              // if (key === 'comment') console.log(validationResult)
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
      __setErrsState(errsObj)
      __setOkState(okObj)

      if (Object.keys(errsObj).length === 0) onFormReady({ state })
      else onFormNotReady({ state })
    })
    return () => subscription.unsubscribe()
  }, [watch, schema, onFormReady, onFormNotReady, onChangeField, __setErrsState, __setOkState])

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
        // className={baseClasses.specialActionsGrid2}
        className={clsx(
          'grid',
          'gap-3',
          // 'mb-6',
          'grid-cols-1',
          // 'md:grid-cols-1',
        )}
      >
        {
          Object.keys(schema).map((key) => {
            switch (schema[key].type) {
              case 'tel':
                return (
                  <Fragment key={key}>
                    <div className={clsx(baseClasses.stack1)}>
                      {
                        !!schema[key].label && (
                          <label
                            htmlFor={key}
                            // className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          ><b>{schema[key].label}</b></label>
                        )
                      }
                      <div className={classes.relativeInputWrapper}>
                        <PhoneInput
                          id={key}
                          // @ts-ignore
                          // ref={setRef(key)}
                          // ruOnly
                          defaultCountryCode={defaultCountryCode}
                          // key={key}
                          // isErrored={!!__errsState[key]}
                          isSuccess={__okState[key] === true}
                          value={__auxState.phone}
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
                              setAuxStateValue('phone', '+7' || '')
                              setValue('phone', '7')
                              return;
                            }
                            if (rusSymbolsToChangeP79.includes(val)) {
                              setAuxStateValue('phone', '+79' || '');
                              setValue('phone', '79')
                              return;
                            }
                            setAuxStateValue('phone', `+${val}` || '')
                            setValue('phone', val)
                          }}
                        />
                        {/* <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        /> */}
                        <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        >
                          {__okState[key] ? <HiCheckCircle className='text-spGreen' fontSize='20px' /> : <HiMinusCircle className='text-mtsRed' fontSize='20px' />}
                        </span>
                      </div>
                      {/* !!__errsState[key] && (
                        <span>{__errsState[key]}</span>
                      ) */}
                    </div>
                  </Fragment>
                )
              case 'text-multiline': {
                const { ref, ...rest } = register(key, { required: schema[key].isRequired, maxLength: schema[key].limit || 100, minLength: schema[key].nativeRules?.minLength })
                return (
                  <Fragment key={key}>
                    <div
                      className={clsx(baseClasses.stack1)}
                    >
                      {
                        !!schema[key].label && (
                          <label htmlFor={key}><b>{schema[key].label}</b></label>
                        )
                      }
                      <div className={classes.relativeInputWrapper}>
                        <Textarea
                          // @ts-ignore
                          ref={(e) => {
                            ref(e)
                            // @ts-ignore
                            if (key === 'comment') lastNameRef.current = e // you can still assign to ref
                          }}
                          style={{
                            width: '100%',
                            maxHeight: '230px',
                            minHeight: '100px',
                          }}
                          // isErrored={!!__errsState[key]}
                          isSuccess={__okState[key] === true}
                          // isErrored={!!__errsState[key]}
                          id={key}
                          // aria-invalid={errors[key] ? 'true' : 'false'}
                          placeholder={schema[key].nativeRules?.placeholder || ''}
                          {...rest}
                          // multiple
                          onChange={(e) => {
                            setAuxStateValue(key, e.target.value)
                            setValue(key, e.target.value)
                          }}
                          required={schema[key].isRequired}
                          disabled={schema[key].isDisabled}
                        />
                        {/* <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        /> */}
                        <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        >
                          {__okState[key] ? <HiCheckCircle className='text-spGreen' fontSize='20px' /> : <HiMinusCircle className='text-mtsRed' fontSize='20px' />}
                        </span>
                      </div>
                      {/* use role="alert" to announce the error message */}
                      {/* {errors.name && errors.name.type === "required" && (
                        <span role="alert">This is required</span>
                      )}
                      {errors.name && errors.name.type === "maxLength" && (
                        <span role="alert">Max length exceeded</span>
                      )} */}
                      {/* !!__errsState[key] && (
                        <span>{__errsState[key]}</span>
                      ) */}
                      {
                        !!schema[key]?.limit
                        && typeof schema[key]?.limit === 'number'
                        && typeof __auxState[key]?.length === 'number'
                          && (typeof __auxState[key]?.length === 'number')
                            ? (
                              <span
                                style={{ fontSize: 'small' }}
                                className={clsx([
                                  {
                                    // @ts-ignore
                                    ['text-mtsRed']: __auxState[key]?.length > schema[key]?.limit,
                                    // @ts-ignore
                                    ['text-mtsGray']: __auxState[key]?.length <= schema[key]?.limit,
                                  }
                                ])}
                              >
                                {__auxState[key]?.length || 0} / {schema[key]?.limit}
                              </span>
                            ) : (
                              <span style={{ fontSize: 'small' }}>
                                0 / {schema[key]?.limit}
                              </span>
                            )
                      }
                      {
                        !!schema[key].descr && (
                          <Alert type='danger'>
                            {schema[key].descr}
                          </Alert>
                        )
                      }
                    </div>
                  </Fragment>
                )
              }
              case 'date': {
                const { ref, ...rest } = register(key, { required: schema[key].isRequired })
                return (
                  <Fragment key={key}>
                    <div
                      className={clsx(baseClasses.stack1)}
                    >
                      {
                        !!schema[key].label && (
                          <label htmlFor={key}><b>{schema[key].label}</b></label>
                        )
                      }
                      <div className={classes.relativeInputWrapper}>
                        <Input
                          // type={__auxFocusState[key] ? schema[key].type : 'text'}
                          type={schema[key].type}
                          ref={ref}
                          // onFocus={() => handleFocusDateInput(key)}
                          // @ts-ignore
                          // onBlur={() => handleBlurDateInput(key)}
                          style={{ width: '100%' }}
                          // isErrored={!!__errsState[key]}
                          isSuccess={__okState[key] === true && schema[key].isRequired}
                          id={key}
                          // aria-invalid={errors[key] ? 'true' : 'false'}
                          placeholder={schema[key].nativeRules?.placeholder}
                          {...rest}
                          value={__auxState[key] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // console.log('--')
                            // console.log(e.target.value)
                            // console.log('--')
                            setAuxStateValue(key, e.target.value)
                            setValue(key, e.target.value)
                          }}
                          required={schema[key].isRequired}
                          disabled={schema[key].isDisabled}
                        />
                        {/* <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        /> */}
                        <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        >
                          {__okState[key] ? <HiCheckCircle className='text-spGreen' fontSize='20px' /> : <HiMinusCircle className='text-mtsRed' fontSize='20px' />}
                        </span>
                      </div>
                      {/* use role="alert" to announce the error message */}
                      {/* {errors.name && errors.name.type === "required" && (
                        <span role="alert">This is required</span>
                      )}
                      {errors.name && errors.name.type === "maxLength" && (
                        <span role="alert">Max length exceeded</span>
                      )} */}
                      {/* !!__errsState[key] && (
                        <span>{__errsState[key]}</span>
                      ) */}
                    </div>
                  </Fragment>
                )
              }
              case 'checkbox': {
                const { ref, ...rest } = register(key, { required: schema[key].isRequired })
                return (
                  <Fragment key={key}>
                    <div className={clsx(baseClasses.row2)}>
                      <Input
                        type={schema[key].type}
                        // @ts-ignore
                        ref={(e) => {
                          ref(e)
                        }}
                        // style={{ width: '100%' }}
                        // isErrored={!!__errsState[key]}
                        isSuccess={__okState[key] === true && schema[key].isRequired}
                        id={key}
                        // aria-invalid={errors[key] ? 'true' : 'false'}
                        placeholder={schema[key].nativeRules?.placeholder || ''}
                        {...rest}
                        minLength={schema[key].nativeRules?.minLength}
                        required={schema[key].isRequired}
                        disabled={schema[key].isDisabled}
                        value={__auxState[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAuxStateValue(key, e.target.checked)
                          setValue(key, e.target.checked)
                        }}
                      />
                      {
                        !!schema[key].label && (
                          <label htmlFor={key}><b>{schema[key].label}</b></label>
                        )
                      }
                    </div>
                  </Fragment>
                )
              }
              case 'text':
              case 'number':
              case 'email':
              default: {
                const { ref, ...rest } = register(key, {
                  required: schema[key].isRequired,
                  maxLength: schema[key].nativeRules?.maxLength,
                  minLength: schema[key].nativeRules?.minLength,
                })
                return (
                  <Fragment key={key}>
                    <div className={clsx(baseClasses.stack1)}>
                      {
                        !!schema[key].label && (
                          <label htmlFor={key}><b>{schema[key].label}</b></label>
                        )
                      }
                      <div className={classes.relativeInputWrapper}>
                        <Input
                          type={schema[key].type}
                          // @ts-ignore
                          ref={(e) => {
                            ref(e)
                            // -- NOTE: // you can still assign to ref
                            switch (key) {
                              case 'last_name':
                                // @ts-ignore
                                lastNameRef.current = e
                                break
                              case 'retailer_name':
                                // @ts-ignore
                                retailerNameRef.current = e
                                break
                              default:
                                break
                            }
                            // --
                          }}
                          style={{ width: '100%' }}
                          // isErrored={!!__errsState[key]}
                          isSuccess={__okState[key] === true && schema[key].isRequired}
                          id={key}
                          // aria-invalid={errors[key] ? 'true' : 'false'}
                          placeholder={schema[key].nativeRules?.placeholder || ''}
                          {...rest}
                          minLength={schema[key].nativeRules?.minLength}
                          required={schema[key].isRequired}
                          disabled={schema[key].isDisabled}
                        />
                        {/* <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        /> */}
                        <span
                          className={clsx([
                            classes.absoluteValidityBadge,
                            {
                              [inputClasses.borderedGreen]: __okState[key] === true && schema[key].isRequired,
                            },
                          ])}
                        >
                          {__okState[key] ? <HiCheckCircle className='text-spGreen' fontSize='20px' /> : <HiMinusCircle className='text-mtsRed' fontSize='20px' />}
                        </span>
                      </div>
                      {/* use role="alert" to announce the error message */}
                      {/* {errors.name && errors.name.type === "required" && (
                        <span role="alert">This is required</span>
                      )}
                      {errors.name && errors.name.type === "maxLength" && (
                        <span role="alert">Max length exceeded</span>
                      )} */}
                      {/* !!__errsState[key] && (
                        <span>{__errsState[key]}</span>
                      ) */}
                    </div>
                  </Fragment>
                )
              }
            }
          })
        }
        {/* <Input type="submit" /> */}
        {/* <pre>{JSON.stringify(__okState, null, 2)}</pre>  */}
      </div>
      {/* <pre>{JSON.stringify(__errsState, null, 2)}</pre> */}
      {/* <button onClick={tst}>tst</button> */}
    </>
  )
})
