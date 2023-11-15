/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react'
// import reactLogo from '~/assets/react.svg'
// import viteLogo from '/vite.svg'
import classes from '~/App.module.scss'
// import { pageMachine } from './xstate/pageMachine'
import { stepMachine, EStep, ECountryCode } from '~/common/xstate/stepMachine'
// import { actions } from 'xstate'
import { useMachine } from '@xstate/react'
import { useLayoutEffect, useMemo, useRef } from 'react'
// import {} from '@headlessui/react'
import { Alert, Menu, Spinner } from '~/common/components/tailwind'
import { ContentWithControls, ResponsiveBlock } from '~/common/components/sp-custom'
import { BaseLayout } from '~/common/components/layout/BaseLayout'
import {
  // InitStep,
  EnterImeiStep,
  PrePriceTableStep,
  UploadPhotoProcessStep,
  FinalPriceTableStep,
  ContractStep,
} from '~/common/components/steps'
import clsx from 'clsx'
import {
  getTranslatedConditionCode,
  getTranslatedConditionSuffixCode,
  getTranslatedDefectReasonCode,
} from '~/common/components/sp-custom/PriceTable/utils'
import { getCapitalizedFirstLetter } from '~/utils/aux-ops'
import { useMetrix } from '~/common/hooks'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { wws } from '~/utils/wws'
import { vi } from '~/common/vi'

function App() {
  const [state, send] = useMachine(stepMachine)
  const can = state.can.bind(state)
  const Step = useMemo(() => {
    switch (state.value) {
      case EStep.AppInit:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>
          </ContentWithControls>
        )
      case EStep.AppInitErr:
        return (
          <ContentWithControls
            header='Oops...'
            controls={[
              {
                id: '2',
                label: 'Попробовать еще раз',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                // isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            <Alert
              type='danger'
              header={state.context.initApp.uiMsg || undefined}
            >
              {
                state.context.initApp.response ? (
                  <pre className={classes.preStyled}>{JSON.stringify(state.context.initApp.response, null, 2)}</pre>
                ) : (
                  <div>No state.context.initApp.response</div>
                )
              }
            </Alert>
          </ContentWithControls>
        )
      case EStep.EnterImei:
        return (
          <EnterImeiStep
            value={state.context.imei.value}
            onChangeIMEI={(e: React.FormEvent<HTMLInputElement>) => {
              send({ type: 'SET_IMEI', value: e.currentTarget.value })
              vi.smState.imei.value = e.currentTarget.value
            }}
            onSendIMEI={() => send({ type: 'goNext' })}
            isNextBtnDisabled={!can({ type: 'goNext' })}
            // onPrev={() => send({ type: 'goPrev' })}
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
          <ContentWithControls
            header='Oops...'
            controls={[
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'prevStep' }),
                isDisabled: !can({ type: 'prevStep' }),
              },
            ]}
          >
            <Alert
              type='danger'
              header={state.context.imei.uiMsg || undefined}
            >
              {
                state.context.imei.response ? (
                  <pre className={classes.preStyled}>{JSON.stringify(state.context.imei.response, null, 2)}</pre>
                ) : (
                  <div>No state.context.imei.response</div>
                )
              }
            </Alert>
          </ContentWithControls>
        )
      case EStep.EnterMemoryAndColor:
        return (
          <ContentWithControls
            header={state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена'}
            subheader={clsx(
              !(!!state.context.imei.response?.phone.color || !!state.context.color.selectedItem || state.context.imei.response?.phone.memory || !!state.context.memory.selectedItem) && 'Выберите параметры',
              getReadableSnakeCase(state.context.imei.response?.phone.color || '') || state.context.color.selectedItem?.label,
              state.context.imei.response?.phone.memory || state.context.memory.selectedItem?.label,
            )}
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
                        items: state.context.memory.dynamicList.length > 0
                          ? state.context.memory.dynamicList
                          : state.context.imei.result.memoryList
                      }
                    ]}
                    label={!state.context.memory.selectedItem ? 'Выберите Память' : state.context.memory.selectedItem.label}
                    isDisabled={state.context.memory.dynamicList.length === 0 && state.context.imei.result.memoryList.length === 0}
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
                    isDisabled={state.context.imei.response?.phone.memory ? state.context.color.dynamicList.length === 0 : !state.context.memory.selectedItem}
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
            subheader={clsx(
              state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
              getReadableSnakeCase(state.context.imei.response?.phone.color || '') || state.context.color.selectedItem?.label,
              state.context.imei.response?.phone.memory || state.context.memory.selectedItem?.label,
            )}
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
              clsx(
                state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(state.context.imei.response?.phone.color || '') || state.context.color.selectedItem?.label,
                state.context.imei.response?.phone.memory || state.context.memory.selectedItem?.label,
              ),
              '/phone/check',
            ]}
            controls={[
              // {
              //   id: '2',
              //   label: 'Назад',
              //   btn: { variant: 'outlined', color: 'default' },
              //   onClick: () => send({ type: 'goPrev' }),
              //   isDisabled: !can({ type: 'goPrev' }),
              // },
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
              clsx(
                state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(state.context.imei.response?.phone.color || '') || state.context.color.selectedItem?.label,
                state.context.imei.response?.phone.memory || state.context.memory.selectedItem?.label,
              ),
              '/photo/link',
            ]}
            controls={[
              // {
              //   id: '2',
              //   label: 'Назад',
              //   btn: { variant: 'outlined', color: 'default' },
              //   onClick: () => send({ type: 'goPrev' }),
              //   isDisabled: !can({ type: 'goPrev' }),
              // },
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
                header={`Загрузите фото устройства${state.context.imei.response?.phone.model ? ` ${state.context.imei.response?.phone.model}` : ''}`}
                subheader={[
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
                      console.log(`-APP: UNKNOWN CASE for status ${value.status} (TODO: This case should be tested)`)
                      break
                  }
                }}
                photoLinkResponse={state.context.photoLink.response}
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
              clsx(
                state.context.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(state.context.imei.response?.phone.color || '') || state.context.color.selectedItem?.label,
                state.context.imei.response?.phone.memory || state.context.memory.selectedItem?.label,
              ),
              clsx(
                state.context.checkPhone.response?.condition
                ? `Состояние – ${getCapitalizedFirstLetter(getTranslatedConditionCode(
                  state.context.checkPhone.response?.condition,
                  ))}${
                    state.context.photoStatus.response?.condition_limit_reason
                      ? ` ${getTranslatedConditionSuffixCode({ suffixCode: state.context.photoStatus.response.condition_limit_reason })}`
                      : ''
                  }`
                : undefined,
                state.context.photoStatus.response?.condition_limit_reason
                ? `/ ${getCapitalizedFirstLetter(getTranslatedDefectReasonCode({
                  deviceType: state.context.imei.response?.phone.type || 'NO DEVICE TYPE in imei.response!',
                  defectCode: state.context.photoStatus.response.condition_limit_reason,
                }))}`
                : undefined
              ),
              // clsx(
              //   state.context.photoStatus.response?.condition_limit_reason
              //     ? getCapitalizedFirstLetter(getTranslatedDefectReasonCode({
              //       deviceType: state.context.imei.response?.phone.type || 'NO DEVICE TYPE in imei.response!',
              //       defectCode: state.context.photoStatus.response.condition_limit_reason,
              //     }))
              //     : undefined
              // )
            ]}
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
                  
                  finalPriceTableProps={{
                    subsidiesStruct2: {
                      tableHeader: 'Сумма с учетом дополнительной скидки при покупке следующих моделей',
                      price: state.context.checkPhone.response.price || 0,
                      subsidies: state.context.checkPhone.response.subsidies || [],
                      noAllZeroSubsidies: true,
                      itemValidation: ({ price /* vendor, model, title */ }) => !!price,
                    },
                  }}
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
      case EStep.Contract:
        return (
          <ContentWithControls
            header='Договор'
            controls={[
              {
                id: '1',
                label: 'Далее',
                onClick: () => {
                  send({ type: 'goNext' })
                },
                btn: {
                  color: 'success',
                  variant: 'filled',
                },
                isDisabled: !can({ type: 'goNext' }),
              },
              {
                id: '2',
                label: 'Назад',
                onClick: () => {
                  send({ type: 'goPrev' })
                },
                btn: {
                  color: 'default',
                  variant: 'outlined',
                },
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
          >
            <div className={classes.stack}>
              <ContractStep
                // NOTE: Корректный features.country_code будет в любом случае,
                // иначе пользователь не продвинулся бы далее EStep.AppInit
                defaultCountryCode={state.context.initApp.response?.features.country_code || ECountryCode.RU}
                onFormReady={({ formState }) => {
                  send({ type: 'SET_CONTRACT_FORM_STATE', value: { state: formState, isReady: true } })
                }}
                onFormNotReady={({ formState }) => {
                  send({ type: 'SET_CONTRACT_FORM_STATE', value: { state: formState, isReady: false } })
                }}
              />
              {/* <pre className={classes.preStyled}>{JSON.stringify(state.context.contract, null, 2)}</pre> */}
            </div>
          </ContentWithControls>
        )
      case EStep.ContractSending:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>
          </ContentWithControls>
        )
      case EStep.ContractError:
        return (
          <ContentWithControls
            header='ERR'
            controls={[
              {
                id: '2',
                label: 'Вернуться',
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
              header={state.context.contract.uiMsg || 'Что-то пошло не так'}
            >
              <pre className={classes.preStyled}>{JSON.stringify({
                contractResponse: state.context.contract.response,
              }, null, 2)}</pre>
            </Alert>
          </ContentWithControls>
        )
      case EStep.Final:
        return (
          <ContentWithControls
            header='🎉 Done.'
            controls={[
              {
                id: '1',
                label: 'Скачать договор повторно',
                onClick: () => {
                  // TODO: state.context.baseSessionInfo.tradeinId
                  // should be moved to state.context.initApp.response?.session_data.tradein_id
                  window.open(`/partner_api/tradein/buyout_doc/i/${state.context.baseSessionInfo.tradeinId}.pdf`, '_blank')
                },
                btn: {
                  color: 'primary',
                  variant: 'outlined',
                },
              },
              {
                id: '2',
                label: 'Изменить данные или согласие клиента',
                onClick: () => send({ type: 'goContract' }),
                btn: {
                  color: 'default',
                  variant: 'outlined',
                },
              },
              {
                id: '3',
                label: 'Клиент подписал договор (завершить)',
                onClick: () => {
                  send({ type: 'RESET_ALL_RESPONSES' })
                  for (const key in vi.contractForm) delete vi.contractForm[key] // NOTE: Reset aux contract form
                  wws.resetMxHistory()
                  send({ type: 'goStart' })
                },
                btn: {
                  color: 'success',
                  variant: 'filled',
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
    state.context.contract,
    state.context.memory.dynamicList,
    state.context.initApp.response,
    state.context.initApp.uiMsg,
  ])

  // NOTE: ⛔ Dont touch!
  useMetrix({ isDebugEnabled: false })

  const stepContentTopRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    // @ts-ignore
    if (state.value) vi.common.stateValue = String(state.value)
    else vi.common.stateValue = EStep.AppInit

    if (stepContentTopRef.current) window.scrollTo({ top: stepContentTopRef.current.offsetTop, behavior: 'smooth'})
  }, [state.value])

  return (
    <>
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

          {/* <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
            <div className={classes.card}>
              <pre className={classes.preStyled}>{JSON.stringify(state.context.photoLink, null, 2)}</pre>
            </div>
          </ResponsiveBlock> */}
        </div>
      </BaseLayout>
    </>
  )
}

export default App
