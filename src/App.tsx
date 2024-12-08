/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react'
// import reactLogo from '~/assets/react.svg'
// import viteLogo from '/vite.svg'
import classes from '~/App.module.scss'
import { EStep, ECountryCode, useStepMachineContext } from '~/common/xstate/stepMachine'
import { useLayoutEffect, useMemo, useRef } from 'react'
// import { Spinner } from '~/common/components/tailwind'
import { Alert, BottomSheet, ContentWithControls, Loader, ResponsiveBlock, ReportMessageForDevs } from '~/common/components/sp-custom'
import { BaseLayout } from '~/common/components/layout/BaseLayout'
import {
  // InitStep,
  EnterImeiStep,
  EnterMemoryAndColorStep,
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
import { IoMdRefresh } from 'react-icons/io'
import { getCapitalizedFirstLetter } from '~/utils/aux-ops'
import { useMetrix } from '~/common/hooks'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { wws } from '~/utils/wws/wws'
import { vi } from '~/common/vi'
import 'react-image-lightbox/style.css'

function App() {
  const { stateContext, stateValue, colorAndMemoryHasDetectedOnServer, send, can } = useStepMachineContext()
  const Step = useMemo(() => {
    switch (stateValue) {
      case EStep.AppInit:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
            isStickyBottomControls
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
          </ContentWithControls>
        )
      case EStep.AppInitErr:
        return (
          <ContentWithControls
            header='Oops!'
            controls={[
              {
                id: '2',
                label: 'Попробовать еще раз',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                // isDisabled: !can({ type: 'goPrev' }),
                EnabledStartIcon: <IoMdRefresh style={{ fontSize: '20px' }} />,
              },
            ]}
            isStickyBottomControls
          >
            <Alert
              type='danger'
              header={stateContext.initApp.uiMsg || undefined}
            >
              {
                stateContext.initApp.response && stateContext.initApp.response._showDetailsInUi && (
                  <pre className={classes.preStyled}>{JSON.stringify(stateContext.initApp.response._fromServer || stateContext.initApp.response, null, 2)}</pre>
                )
              }
            </Alert>
          </ContentWithControls>
        )
      case EStep.EnterImei:
        return (
          <EnterImeiStep
            value={stateContext.imei.value}
            onChangeIMEI={(e: React.FormEvent<HTMLInputElement>) => {
              send({ type: 'SET_IMEI', value: e.currentTarget.value })
              vi.smState.imei.value = e.currentTarget.value
            }}
            onSendIMEI={() => send({ type: 'goNext' })}
            isNextBtnDisabled={!can({ type: 'goNext' })}
            // onPrev={() => send({ type: 'goPrev' })}
            isPrevBtnDisabled={!can({ type: 'goPrev' })}
            makeAutofocusOnComplete
            hasDeviceTypePseudoChoice={stateContext.initApp.response?.features.smartwatch_allowed}
          />
        )
      case EStep.SendImei:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
            isStickyBottomControls
          >
            {/* <div>{stateContext.imei.result.state}</div> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
          </ContentWithControls>
        )
      case EStep.SendImeiErr:
        return (
          <ContentWithControls
            header='Oops...'
            controls={[
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
            isStickyBottomControls
          >
            <Alert
              type='danger'
              header={stateContext.imei.uiMsg || undefined}
            >
              {
                stateContext.imei.response && stateContext.imei.response._showDetailsInUi && (    
                  <pre className={classes.preStyled}>{JSON.stringify(stateContext.imei.response._fromServer || stateContext.imei.response, null, 2)}</pre>
                )
              }
            </Alert>
            <ReportMessageForDevs />
          </ContentWithControls>
        )
      case EStep.EnterMemoryAndColor:
        return (
          <EnterMemoryAndColorStep
            skipStepSettings={{
              doIt: colorAndMemoryHasDetectedOnServer,
              cb: () => send({ type: 'goNext' }),
            }}
            header={clsx(
              stateContext.imei.response?.phone.vendor,
              stateContext.imei.response?.phone.model || '⚠️ Модель устройства не определена',
            )}
            subheader={clsx(
              !(!!stateContext.imei.response?.phone.color || !!stateContext.color.selectedItem || stateContext.imei.response?.phone.memory || !!stateContext.memory.selectedItem) && 'Выберите параметры',
              getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
              stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
            )}
            nextBtn={{
              id: 'next',
              label: 'Дальше',
              btn: { variant: 'filled', color: 'primary' },
              onClick: () => send({ type: 'goNext' }),
              isDisabled: !can({ type: 'goNext' }),
              allowDefaultEnabledEndIconArrowRight: true,
            }}
            prevBtn={{
              id: 'prev',
              label: 'Назад',
              btn: { variant: 'outlined', color: 'default' },
              onClick: () => send({ type: 'goPrev' }),
              isDisabled: !can({ type: 'goPrev' }),
            }}
            defaultAutofocusId={
              can({ type: 'goNext' })
              ? undefined
              : !!stateContext.imei.response?.phone.memory && !!stateContext.imei.response?.phone.color
                ? undefined
                : (
                  !!stateContext.imei.response?.phone.memory && !stateContext.imei.response?.phone.color
                  ? 'col'
                  : !stateContext.imei.response?.phone.memory
                    ? 'mem'
                    : undefined
                  )
            }
            listboxes={[
              {
                id: 'mem',
                placeholder: 'Выберите память',
                isEnabled: !stateContext.imei.response?.phone.memory,
                selectedId: stateContext.memory.selectedItem?.value,
                onItemSelect: ({ item }) => send({ type: 'SET_MEMORY', value: item }),
                items: stateContext.memory.dynamicList.length > 0
                  ? stateContext.memory.dynamicList
                  : stateContext.imei.result.memoryList,
                isDisabled: stateContext.memory.dynamicList.length === 0 && stateContext.imei.result.memoryList.length === 0,
              },
              {
                id: 'col',
                placeholder: 'Выберите цвет',
                isEnabled: !stateContext.imei.response?.phone.color,
                selectedId: stateContext.color.selectedItem?.value,
                onItemSelect: ({ item }) => send({ type: 'SET_COLOR', value: item }),
                items: stateContext.color.dynamicList,
                isDisabled: stateContext.imei.response?.phone.memory ? stateContext.color.dynamicList.length === 0 : !stateContext.memory.selectedItem,
              },
            ]}
            autofocusControlBtnId={
              can({ type: 'goNext' }) ? 'next' : undefined
            }
            imeiResponse={stateContext.imei.response}
          />
        )
      case EStep.PrePriceTable:
        return (
          <ContentWithControls
            hasChildrenFreeWidth
            header='Предварительная сумма скидки'
            subheader={clsx(
              stateContext.imei.response?.phone.vendor,
              stateContext.imei.response?.phone.model || '⚠️ Модель устройства не определена',
              getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
              stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
            )}
            controls={[
              {
                id: '1',
                label: 'Клиент согласен',
                btn: { variant: 'filled', color: 'success' },
                onClick: () => send({ type: 'goNext' }),
                // isDisabled: !can({ type: 'goNext' }),
                allowDefaultEnabledEndIconCheck: true,
              },
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: colorAndMemoryHasDetectedOnServer, // !can({ type: 'goPrev' }),
              },
            ]}
            isStickyBottomControls
            autofocusBtnId='1'
          >
            {
              stateContext.imei.response ? (
                <PrePriceTableStep
                  imeiResponse={stateContext.imei.response}
                  checkPhoneResponse={stateContext.checkPhone.response}
                  photoStatusResponse={null}
                  byUser={{
                    selectedColor: stateContext.color.selectedItem,
                    selectedMemory: stateContext.memory.selectedItem,
                  }}
                  conditionCodeValidator={() => true}
                />
              ) : (
                <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
                  <Alert
                    type='danger'
                    header='Что-то пошло не так'
                  >
                    <div>Отсутствуют ожидаемые ответы от сервера</div>
                    <pre className={classes.preStyled}>{JSON.stringify({
                      'imei.response': stateContext.imei.response ? 'OK' : String(stateContext.imei.response),
                      'checkPhone.response': stateContext.checkPhone.response ? 'OK' : String(stateContext.checkPhone.response),
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
                stateContext.imei.response?.phone.vendor,
                stateContext.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
                stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
              ),
              '/phone/check',
            ]}
            controls={[
              {
                id: '2',
                label: 'Назад',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
                isDisabled: !can({ type: 'goPrev' }),
              },
            ]}
            isStickyBottomControls
          >
            {
              stateContext.checkPhone.result.state === 'pending' ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
              ) : (
                <Alert
                  type={stateContext.checkPhone.result.state === 'error' ? 'danger' : 'info'}
                  header={stateContext.checkPhone.result.state}
                >
                  <div>{stateContext.checkPhone.uiMsg}</div>
                </Alert>
              )
            }
            {
              !!stateContext.checkPhone.response && (
                <pre className={classes.preStyled}>{JSON.stringify(stateContext.checkPhone.response, null, 2)}</pre>
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
                stateContext.imei.response?.phone.vendor,
                stateContext.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
                stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
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
            // isStickyBottomControls
          >
            {
              stateContext.photoLink.result.state === 'pending' ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
              ) : (
                <Alert
                  type={stateContext.photoLink.result.state === 'error' ? 'danger' : 'info'}
                  header={stateContext.photoLink.result.state}
                >
                  <div>{stateContext.photoLink.uiMsg}</div>
                </Alert>
              )
            }
            {
              !!stateContext.photoLink.response && (
                <pre className={classes.preStyled}>{JSON.stringify(stateContext.photoLink.response, null, 2)}</pre>
              )
            }
          </ContentWithControls>
        )
      case EStep.UploadPhotoInProgress:
        return (
          <>
            {!stateContext.imei.response?.id ? (
              <Alert
                type='danger'
                header='Отсутствует Tradein-Id для текущей сессии'
              >
                <pre className={classes.preStyled}>{JSON.stringify(stateContext.imei, null, 2)}</pre>
              </Alert>
            ) : (
              <UploadPhotoProcessStep
                tradeinId={stateContext.imei.response?.id}
                header='Загрузите фото устройства'
                subheader={[
                  clsx(
                    stateContext.imei.response?.phone.vendor,
                    stateContext.imei.response?.phone.model,
                    getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
                    stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
                  ),
                ]}
                initLastSubheader='Для финальной оценки и подтверждения состояния'
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
                      send({ type: 'goErr' })
                      break
                    case 'ok':
                      send({ type: 'goNext' })
                      break
                    default:
                      console.log(`-APP: UNKNOWN CASE for status ${value.status} (TODO: This case should be tested)`)
                      break
                  }
                }}
                photoLinkResponse={stateContext.photoLink.response}
              />
            )}
          </>
        )
      case EStep.UploadPhotoResultIsFuckup:
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
            // isStickyBottomControls
          >
            <Alert
              type='danger'
              header='Oops...'
            >
              {
                stateContext.photoStatus.uiMsg ? (
                  <div>{stateContext.photoStatus.uiMsg}</div>
                ) : (
                  <pre className={classes.preStyled}>{JSON.stringify(stateContext.photoStatus.response, null, 2)}</pre>
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
                stateContext.imei.response?.phone.vendor,
                stateContext.imei.response?.phone.model || '⚠️ Модель устройства не определена',
                getReadableSnakeCase(stateContext.imei.response?.phone.color || '') || stateContext.color.selectedItem?.label,
                stateContext.imei.response?.phone.memory || stateContext.memory.selectedItem?.label,
              ),
              clsx(
                stateContext.checkPhone.response?.condition
                ? `Состояние – ${getCapitalizedFirstLetter(getTranslatedConditionCode(
                  stateContext.checkPhone.response?.condition,
                  ))}${
                    stateContext.photoStatus.response?.condition_limit_reason
                      ? ` ${getTranslatedConditionSuffixCode({ suffixCode: stateContext.photoStatus.response.condition_limit_reason })}`
                      : ''
                  }`
                : undefined,
                stateContext.photoStatus.response?.condition_limit_reason
                ? `/ ${getCapitalizedFirstLetter(getTranslatedDefectReasonCode({
                  deviceType: stateContext.imei.response?.phone.type || 'NO DEVICE TYPE in imei.response!',
                  defectCode: stateContext.photoStatus.response.condition_limit_reason,
                }))}`
                : undefined
              ),
              // clsx(
              //   stateContext.photoStatus.response?.condition_limit_reason
              //     ? getCapitalizedFirstLetter(getTranslatedDefectReasonCode({
              //       deviceType: stateContext.imei.response?.phone.type || 'NO DEVICE TYPE in imei.response!',
              //       defectCode: stateContext.photoStatus.response.condition_limit_reason,
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
                allowDefaultEnabledEndIconCheck: true,
              },
            ]}
            isStickyBottomControls
            autofocusBtnId='1'
          >
            {
              stateContext.imei.response && stateContext.checkPhone.response && stateContext.photoStatus.response ? (
                <FinalPriceTableStep
                  imeiResponse={stateContext.imei.response}
                  checkPhoneResponse={stateContext.checkPhone.response}
                  photoStatusResponse={stateContext.photoStatus.response}
                  byUser={{
                    selectedColor: stateContext.color.selectedItem,
                    selectedMemory: stateContext.memory.selectedItem,
                  }}
                  conditionCodeValidator={({ value }) => value === stateContext.photoStatus.response?.condition }
                  finalPriceTableProps={{
                    subsidiesStruct2: {
                      tableHeader: 'Сумма с учетом дополнительной скидки при покупке следующих моделей',
                      price: stateContext.checkPhone.response.price || 0,
                      subsidies: stateContext.checkPhone.response.subsidies || [],
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
                      'imei.response': stateContext.imei.response ? 'OK' : String(stateContext.imei.response),
                      'checkPhone.response': stateContext.checkPhone.response,
                      'photoStatus.response': stateContext.photoStatus.response,
                    }, null, 2)}</pre>
                  </Alert>
                </ResponsiveBlock>
              )
            }
            <ResponsiveBlock
              isPaddedMobile
              isLimitedForDesktop
            >
              <ReportMessageForDevs />
            </ResponsiveBlock>
          </ContentWithControls>
        )
      case EStep.Contract:
        return (
          <ContentWithControls
            autofocusBtnId={
              can({ type: 'goNext' })
              ? vi.contractFormLastEditedFieldInfo.name === 'phone'
                ? '1'
                : undefined
              : undefined
            }
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
                allowDefaultEnabledEndIconCheck: true,
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
            isStickyBottomControls
          >
            <div className={classes.stack2}>
              <ContractStep
                // NOTE: Корректный features.country_code будет в любом случае,
                // иначе пользователь не продвинулся бы далее EStep.AppInit
                defaultCountryCode={stateContext.initApp.response?.features.country_code || ECountryCode.RU}
                onFormReady={({ formState }) => {
                  send({ type: 'SET_CONTRACT_FORM_STATE', value: { state: formState, isReady: true } })
                }}
                onFormNotReady={({ formState }) => {
                  send({ type: 'SET_CONTRACT_FORM_STATE', value: { state: formState, isReady: false } })
                }}
              />
              {/* <pre className={classes.preStyled}>{JSON.stringify(stateContext.contract, null, 2)}</pre> */}
            </div>
          </ContentWithControls>
        )
      case EStep.ContractSending:
        return (
          <ContentWithControls
            header='Подождите...'
            controls={[]}
            // isStickyBottomControls
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
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
            isStickyBottomControls
          >
            <Alert
              type='danger'
              header={stateContext.contract.uiMsg || 'Что-то пошло не так'}
            >
              <pre className={classes.preStyled}>{JSON.stringify({
                contractResponse: stateContext.contract.response,
              }, null, 2)}</pre>
            </Alert>
            <ReportMessageForDevs />
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
                  // NOTE: Expected in stateContext.imei.response?.id
                  window.open(`/partner_api/tradein/buyout_doc/i/${stateContext.imei.response?.id}.pdf`, '_blank')
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
                  
                  // NOTE: Reset aux contract form, and etc.
                  try { vi.resetState() } catch (err) { console.log(err) }

                  wws.resetMxHistory()
                  send({ type: 'goStart' })
                },
                btn: {
                  color: 'success',
                  variant: 'filled',
                },
              },
            ]}
            isStickyBottomControls
          >
            <div>Договор подписан</div>
            <ReportMessageForDevs />
          </ContentWithControls>
        )
      default:
        return (
          <ContentWithControls
            header={`Unknown step: ${String(stateValue)}`}
            controls={[]}
            isStickyBottomControls
          >
            {null}
          </ContentWithControls>
        )
    }
  }, [
    stateValue, send, stateContext.imei, can,
    stateContext.color.selectedItem, stateContext.memory.selectedItem,
    stateContext.color.dynamicList,
    stateContext.checkPhone.result.state,
    stateContext.checkPhone.response,
    stateContext.checkPhone.uiMsg,
    stateContext.photoLink.response,
    stateContext.photoLink.result.state,
    stateContext.photoLink.uiMsg,
    stateContext.photoStatus.uiMsg,
    stateContext.photoStatus.response,
    stateContext.contract,
    stateContext.memory.dynamicList,
    stateContext.initApp.response,
    stateContext.initApp.uiMsg,
    colorAndMemoryHasDetectedOnServer,
  ])

  // NOTE: ⛔ Dont touch!
  useMetrix({ isDebugEnabled: false })

  const stepContentTopRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    // @ts-ignore
    if (stateValue) vi.common.stateValue = String(stateValue)
    else vi.common.stateValue = EStep.AppInit

    if (stepContentTopRef.current) window.scrollTo({ top: stepContentTopRef.current.offsetTop, behavior: 'smooth'})
  }, [stateValue])

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
              <pre className={classes.preStyled}>{JSON.stringify(stateContext.photoLink, null, 2)}</pre>
            </div>
          </ResponsiveBlock> */}
        </div>
      </BaseLayout>
      <BottomSheet />
    </>
  )
}

export default App
