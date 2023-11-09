/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import baseClasses from '~/App.module.scss'
import { Input } from '~/common/components/sp-custom'
import { useForm } from 'react-hook-form'
import { useLayoutEffect, Fragment, useState, useCallback } from 'react'
import clsx from 'clsx'
import { PhoneInput } from '~/common/components/sp-custom'
// import classes from './From.module.scss'

type TType = 'text' | 'number' | 'tel'

type TField = {
  label: string;
  initValue?: string | number;
  type: TType;
  validate: (val: any) => boolean;
  isRequired?: boolean;
}

type TProps = {
  schema: {
    [key: string]: TField;
  };
  // onSubmit: (data: any) => void;
  onFormReady: ({ state }: { state: any; }) => void;
  onFormNotReady: ({ state }: { state: any; }) => void;
  getValues: (data: any) => any;
}

export const Form = ({
  schema,
  // onSubmit,
  getValues: _getValues,
  onFormReady,
  onFormNotReady,
}: TProps) => {
  const {
    register,
    // handleSubmit,
    // getValues,
    formState: {
      errors,
      // defaultValues,
      // isDirty,
      // isValid,
      // ...restFormStateProps
    },
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
  const [auxState, setAuxState] = useState<{ [key: string]: any }>({
    phone: '',
  })
  const setFieldValue = useCallback((fn: string, val: any) => {
    setAuxState({ [fn]: val })
  }, [setAuxState])

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  useLayoutEffect(() => {
    const subscription = watch((
      state,
      // { name, type }
    ) => {
      // console.log({ state, name, type })
      const counters = { ok: 0, fail: 0 }
      for (const key in schema) {
        switch (key) {
          // case 'phone':
          //   if (schema[key].validate(auxState[key])) counters.ok += 1
          //   else counters.fail += 1
          //   break
          default:
            if (schema[key].validate(state[key])) counters.ok += 1
            else counters.fail += 1
            break
        }
      }

      // console.log(counters, state.phone)

      if (
        // counters.ok === Object.keys(schema).length &&
        counters.fail === 0
      ) {
        // console.log('-ok')
        onFormReady({ state })
      } else {
        // console.log('-not ok')
        onFormNotReady({ state })
      }

    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, schema, onFormReady, onFormNotReady])

  // const tst = () => {
  //   const values = getValues()
  //   _getValues({ values, isDirty, isValid })
  // }

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
                    <div>
                      {/* <label
                        htmlFor={key}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >{schema[key].label}</label> */}
                      {/* <input
                        type='tel'
                        id={key}
                        className={clsx(
                          'bg-gray-50',
                          'border',
                          'border-gray-300',
                          'text-gray-900',
                          'text-sm',
                          'rounded-lg',
                          // NOTE: Focus
                          'focus:ring-blue-500',
                          'focus:border-blue-500',
                          
                          'block',
                          'w-full',
                          'p-2.5',
                        )}
                        placeholder="123-45-678"
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                        required
                      /> */}
                      <PhoneInput
                        // id={key}
                        value={auxState.phone}
                        // @ts-ignore
                        onChange={(e: string) => {
                          // console.log('--')
                          // console.log(e)
                          // console.log('--')
                          // setFieldValue("phoneNumber", formatPhoneNumberIntl(e))
                          const rusSymbolsToChangeP7 = ['7', '+7', '8', '+8']
                          const rusSymbolsToChangeP79 = ['9', '+9']
                          // TODO? const rusSymbolsToChangeP791 = ['78']
                          if (rusSymbolsToChangeP7.includes(e)) {
                            setFieldValue('phone', '+7' || '');
                            setValue('phone', '7')
                            return;
                          }
                          if (rusSymbolsToChangeP79.includes(e)) {
                            setFieldValue('phone', '+79' || '');
                            setValue('phone', '79')
                            return;
                          }
                          setFieldValue('phone', `+${e}` || '');
                          setValue('phone', e)
                        }}
                        // {...register(key, { required: schema[key].isRequired, maxLength: 30 })}
                      />
                  </div>
                  </Fragment>
                )
              case 'text':
              default:
                return (
                  <Fragment key={key}>
                    {/* <label htmlFor={key}>{schema[key].label}</label> */}
                    <Input
                      id={key}
                      aria-invalid={errors[key] ? 'true' : 'false'}
                      placeholder={schema[key].label}
                      {...register(key, { required: schema[key].isRequired, maxLength: 30 })}
                    />
                    {/* use role="alert" to announce the error message */}
                    {/* {errors.name && errors.name.type === "required" && (
                      <span role="alert">This is required</span>
                    )}
                    {errors.name && errors.name.type === "maxLength" && (
                      <span role="alert">Max length exceeded</span>
                    )} */}
                  </Fragment>
                )
            }
          })
        }
        {/* <Input type="submit" /> */}
      </div>
      {/* <button onClick={tst}>tst</button> */}
    </>
  )
}
