/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react'
// import reactLogo from '~/assets/react.svg'
// import viteLogo from '/vite.svg'
import classes from '~/App.module.scss'
// import { pageMachine } from './xstate/pageMachine'
import { stepMachine, EStep } from '~/common/xstate/stepMachine'
// import { actions } from 'xstate'
import { useMachine } from '@xstate/react'
import { useLayoutEffect, useMemo, useRef } from 'react'
// import {} from '@headlessui/react'
import { Alert, Menu, Spinner } from '~/common/components/tailwind'
import { Button, ContentWithControls, ResponsiveBlock } from '~/common/components/sp-custom'
import { BaseLayout } from '~/common/components/layout/BaseLayout'
import {
  InitStep,
  EnterImeiStep,
  PrePriceTableStep,
  UploadPhotoProcessStep,
  FinalPriceTableStep,
} from '~/common/components/steps'
import {
  WithAppContextHOC,
  // useStore, NEvent, TAppMicroStore, initialState,
} from '~/common/context/WithAppContextHOC'
import clsx from 'clsx'
// import { getTranslatedConditionCode } from '~/common/components/sp-custom/PriceTable/utils'

function App() {
  const [state, send] = useMachine(stepMachine)
  const can = state.can.bind(state)
  const Step = useMemo(() => {
    switch (state.value) {
      case EStep.Init:
        return <InitStep onStart={() => send({ type: 'goIMEI' })} />
      case EStep.EnterImei:
        return (
          <EnterImeiStep
            value={state.context.imei.value}
            onChangeIMEI={(e: React.FormEvent<HTMLInputElement>) => send({ type: 'SET_IMEI', value: e.currentTarget.value })}
            onSendIMEI={() => send({ type: 'goNext' })}
            isNextBtnDisabled={!can({ type: 'goNext' })}
            onPrev={() => send({ type: 'goPrev' })}
            isPrevBtnDisabled={!can({ type: 'goPrev' })}
          />
        )
      case EStep.SendImei:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
          >
            {/* <div>{state.context.imei.result.state}</div> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>
          </ContentWithControls>
        )
      case EStep.ImeiErr:
        return (
          <div className={classes.stack}>
            <Alert
              type='danger'
              // header={state.context.checkPhone.result.state}
            >
              <div>{state.context.imei.uiMsg}</div>
            </Alert>
            <Button
              variant='outlined'
              color='default'
              onClick={() => send({ type: 'prevStep' })}
            >
              Назад
            </Button>
          </div>
        )
      case EStep.EnterMemoryAndColor:
        return (
          <ContentWithControls
            header={state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена'}
            controls={[
              {
                id: '1',
                label: 'Дальше',
                btn: { variant: 'filled', color: 'primary' },
                onClick: () => send({ type: 'goNext' }),
                isDisabled: !can({ type: 'goNext' }),
              },
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            <div className={clsx(classes.specialActionsGrid)}>
              {
                !state.context.imei.response?.phone.memory && (
                  <Menu
                    selectedId={state.context.memory.selectedItem?.value}
                    onItemSelect={({ item }) => send({ type: 'SET_MEMORY', value: item })}
                    sections={[
                      {
                        id: 'mem',
                        items: state.context.imei.result.memoryList
                      }
                    ]}
                    label={!state.context.memory.selectedItem ? 'Выберите Память' : state.context.memory.selectedItem.label}
                    isDisabled={state.context.imei.result.memoryList.length === 0}
                    shoudHaveAttention={!state.context.memory.selectedItem}
                  />
                )
              }
              {
                !state.context.imei.response?.phone.color && (
                  <Menu
                    selectedId={state.context.color.selectedItem?.value}
                    onItemSelect={({ item }) => send({ type: 'SET_COLOR', value: item })}
                    sections={[
                      {
                        id: 'col',
                        items: state.context.color.dynamicList,
                      }
                    ]}
                    label={!state.context.color.selectedItem ? 'Выберите Цвет' : state.context.color.selectedItem.label}
                    isDisabled={!state.context.memory.selectedItem}
                    shoudHaveAttention={!state.context.color.selectedItem}
                  />
                )
              }
            </div>
            {/* <pre className={classes.preStyled}>{JSON.stringify(state.context.imei.response, null, 2)}</pre> */}
          </ContentWithControls>
        )
      case EStep.PrePriceTable:
        return (
          <ContentWithControls
            hasChildrenFreeWidth
            header='Предварительная сумма скидки'
            subheader={state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена'}
            controls={[
              {
                id: '1',
                label: 'Клиент согласен',
                btn: { variant: 'filled', color: 'success' },
                onClick: () => send({ type: 'goNext' }),
                // isDisabled: !can({ type: 'goNext' }),
              },
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                // isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            {
              state.context.imei.response ? (
                <PrePriceTableStep
                  imeiResponse={state.context.imei.response}
                  checkPhoneResponse={state.context.checkPhone.response}
                  // photoStatusResponse={state.context.}
                  byUser={{
                    selectedColor: state.context.color.selectedItem,
                    selectedMemory: state.context.memory.selectedItem,
                  }}
                  conditionCodeValidator={() => true}
                />
              ) : (
                <ResponsiveBlock
                  isPaddedMobile
                  isLimitedForDesktop
                >
                  <Alert
                    type='danger'
                    header='Что-то пошло не так'
                  >
                    <div>Отсутствуют ожидаемые ответы от сервера</div>
                    <pre className={classes.preStyled}>{JSON.stringify({
                      'imei.response': state.context.imei.response ? 'OK' : String(state.context.imei.response),
                      'checkPhone.response': state.context.checkPhone.response ? 'OK' : String(state.context.checkPhone.response),
                    }, null, 2)}</pre>
                  </Alert>
                </ResponsiveBlock>
              )
            }
          </ContentWithControls>
        )
      case EStep.CheckPhone:
        return (
          <ContentWithControls
            header='Подождите...'
            subheader={[
              state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
              '/phone/check',
            ]}
            controls={[
              {
                id: '2',
                label: 'Prev (dev)',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            {
              state.context.checkPhone.result.state === 'pending' ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>
              ) : (
                <Alert
                  type={state.context.checkPhone.result.state === 'error' ? 'danger' : 'info'}
                  header={state.context.checkPhone.result.state}
                >
                  <div>{state.context.checkPhone.uiMsg}</div>
                </Alert>
              )
            }
            {
              !!state.context.checkPhone.response && (
                <pre className={classes.preStyled}>{JSON.stringify(state.context.checkPhone.response, null, 2)}</pre>
              )
            }
          </ContentWithControls>
        )
      case EStep.GetPhotoLink:
        return (
          <ContentWithControls
            header='Подождите...'
            subheader={[
              state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
              '/photo/link',
            ]}
            controls={[
              {
                id: '2',
                label: 'Prev (dev)',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            {
              state.context.photoLink.result.state === 'pending' ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>
              ) : (
                <Alert
                  type={state.context.photoLink.result.state === 'error' ? 'danger' : 'info'}
                  header={state.context.photoLink.result.state}
                >
                  <div>{state.context.photoLink.uiMsg}</div>
                </Alert>
              )
            }
            {
              !!state.context.photoLink.response && (
                <pre className={classes.preStyled}>{JSON.stringify(state.context.photoLink.response, null, 2)}</pre>
              )
            }
          </ContentWithControls>
        )
      case EStep.UploadPhotoInProgress:
        return (
          <>
            {!state.context.baseSessionInfo.tradeinId ? (
              <Alert
                type='danger'
                header='Отсутствует Tradein-Id для текущей сессии'
              >
                <pre className={classes.preStyled}>{JSON.stringify(state.context.baseSessionInfo, null, 2)}</pre>
              </Alert>
            ) : (
              <UploadPhotoProcessStep
                tradeinId={state.context.baseSessionInfo.tradeinId}
                header='Загрузите фото устройства'
                subheader={[
                  // state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                  'Для финальной оценки и подтверждения состояния',
                ]}
                controls={[
                  {
                    id: '2',
                    label: 'Назад',
                    btn: { variant: 'outlined', color: 'default' },
                    onClick: () => send({ type: 'goPrev' }),
                  },
                ]}
                onDone={({ value }) => {
                  console.log('- App: UploadPhotoProcessStep.onDone')

                  send({ type: 'SET_PHOTO_STATUS_RESPONSE', value })

                  switch (value.status) {
                    case 'fake':
                    case 'bad_quality':
                      send({ type: 'goUploadPhotoResultInNotOk' })
                      break
                    case 'ok':
                      send({ type: 'goNext' })
                      break
                    default:
                      console.log(`- APP: UNKNOWN CASE for ${value.status}`)
                      break
                  }
                }}
              />
            )}
          </>
        )
      case EStep.UploadPhotoResultInNotOk:
        return (
          <ContentWithControls
            header='📵 Что-то пошло не так'
            controls={[
              {
                id: '2',
                label: 'Вернуться к скидке',
                onClick: () => send({ type: 'goPrev' }),
                btn: {
                  color: 'primary',
                  variant: 'outlined',
                },
              },
            ]}
          >
            <Alert
              type='danger'
              header='Oops...'
            >
              {
                state.context.photoStatus.uiMsg ? (
                  <div>{state.context.photoStatus.uiMsg}</div>
                ) : (
                  <pre className={classes.preStyled}>{JSON.stringify(state.context.photoStatus.response, null, 2)}</pre>
                )
              }
            </Alert>
          </ContentWithControls>
        )
      case EStep.FinalPriceTable:
        return (
          <ContentWithControls
            hasChildrenFreeWidth
            header='Итоговая сумма скидки'
            subheader={[
              `${state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена'}`,
            ]}
            // subheaderJsx={
            //   <div
            //     style={{
            //       display: 'flex',
            //       flexDirection: 'column',
            //       alignItems: 'center',
            //       color: 'gray',
            //     }}
            //   >
            //     <b>{!!state.context.checkPhone.response?.condition && `Состояние: ${getTranslatedConditionCode(state.context.checkPhone.response?.condition)}`}</b>
            //     <div>Дефекты: [ TODO ]</div>
            //   </div>
            // }
            controls={[
              {
                id: '1',
                label: 'Клиент согласен',
                onClick: () => send({ type: 'goNext' }),
                btn: {
                  color: 'success',
                  variant: 'filled',
                },
              },
            ]}
          >
            {
              state.context.imei.response && state.context.checkPhone.response ? (
                <FinalPriceTableStep
                  imeiResponse={state.context.imei.response}
                  checkPhoneResponse={state.context.checkPhone.response}
                  photoStatusResponse={state.context.photoStatus.response}
                  byUser={{
                    selectedColor: state.context.color.selectedItem,
                    selectedMemory: state.context.memory.selectedItem,
                  }}
                  conditionCodeValidator={({ value }) => value === state.context.checkPhone.response?.condition }
                  /* NOTE: Originl legacy arg
                    cfg: {},
                    originalDataCases: {
                      possiblePricesStruct: {
                        tableHeader: 'Сумма без учета дополнительной скидки',
                        prices: window.proxiedState.imeiStep?.__response?.possible_prices || {},
                      },
                      subsidiesStruct2: {
                        price: window.proxiedState.phoneCheckResponse?.price || 0,
                        tableHeader: 'Сумма с учетом дополнительной скидки при покупке следующих моделей',
                        subsidies: window.proxiedState.phoneCheckResponse?.subsidies || [],
                        noAllZeroSubsidies: true,
                        itemValidation: ({ price }) => !!price,
                      },
                    },
                  */
                />
              ) : (
                <ResponsiveBlock
                  isPaddedMobile
                  isLimitedForDesktop
                >
                  <Alert
                    type='danger'
                    header='Что-то пошло не так'
                  >
                    <div>Отсутствуют ожидаемые ответы от сервера</div>
                    <pre className={classes.preStyled}>{JSON.stringify({
                      'imei.response': state.context.imei.response ? 'OK' : String(state.context.imei.response),
                      'checkPhone.response': state.context.checkPhone.response,
                    }, null, 2)}</pre>
                  </Alert>
                </ResponsiveBlock>
              )
            }
          </ContentWithControls>
        )
      case EStep.Final:
        return (
          <ContentWithControls
            header='🎉 Done.'
            controls={[
              {
                id: '1',
                label: 'Go Start',
                onClick: () => {
                  send({ type: 'RESET_ALL_RESPONSES' })
                  send({ type: 'goStart' })
                },
                btn: {
                  color: 'primary',
                  variant: 'outlined',
                },
              },
            ]}
          >
            {null}
          </ContentWithControls>
        )
      default:
        return (
          <ContentWithControls
            header={`Unknown step: ${String(state.value)}`}
            controls={[]}
          >
            {null}
          </ContentWithControls>
        )
    }
  }, [
    state.value, send, state.context.imei, can,
    state.context.color.selectedItem, state.context.memory.selectedItem,
    state.context.color.dynamicList,
    state.context.checkPhone.result.state,
    state.context.checkPhone.response,
    state.context.checkPhone.uiMsg,
    state.context.photoLink.response,
    state.context.photoLink.result.state,
    state.context.photoLink.uiMsg,
    state.context.baseSessionInfo,
    state.context.photoStatus.uiMsg,
    state.context.photoStatus.response,
  ])

  const stepContentTopRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (stepContentTopRef.current) window.scrollTo({ top: stepContentTopRef.current.offsetTop, behavior: 'smooth'})
  }, [state.value])

  return (
    <WithAppContextHOC>
      <div ref={stepContentTopRef} />
      <BaseLayout>
        <div className={classes.stack}>
          {/* <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
            <h1 className="text-3xl font-bold underline" style={{ marginBottom: '50px' }}>Vite + React + Tailwind</h1>
          </ResponsiveBlock> */}

          <div className={classes.stack}>
            {/* <h2 className="text-2xl font-bold">{String(state.value)}</h2> */}
            {Step}
          </div>
          {/* <ResponsiveBlock isPaddedMobile isLimitedForDesktop></ResponsiveBlock> */}

          {/* <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
            <div className={classes.card}>
              <pre className={classes.preStyled}>{JSON.stringify(state.context.photoLink, null, 2)}</pre>
            </div>
          </ResponsiveBlock> */}
        </div>
      </BaseLayout>
    </WithAppContextHOC>
  )
}

export default App
