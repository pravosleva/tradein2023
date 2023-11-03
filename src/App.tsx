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
import {
  Alert,
  // Button,
  Menu,
  Spinner,
} from '~/common/components/tailwind'
import { Button, ContentWithControls } from '~/common/components/sp-custom'
import { BaseLayout } from '~/common/components/layout/BaseLayout'
import {
  InitStep,
  EnterImeiStep,
  PrePriceTableStep,
  UploadPhotoProcessStep,
} from '~/common/components/steps'
import {
  WithAppContextHOC,
  // useStore, NEvent, TAppMicroStore, initialState,
} from '~/common/context/WithAppContextHOC'
import clsx from 'clsx'

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
            <PrePriceTableStep />
          </ContentWithControls>
        )
      case EStep.CheckPhone:
        return (
          <ContentWithControls
            header='/phone/check'
            controls={[
              {
                id: '1',
                label: 'Next (dev)',
                btn: { variant: 'filled', color: 'primary' },
                onClick: () => send({ type: 'goNext' }),
                isDisabled: !can({ type: 'goNext' }),
              },
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
            header='/photo/link'
            controls={[
              {
                id: '1',
                label: 'Next (dev)',
                btn: { variant: 'filled', color: 'primary' },
                onClick: () => send({ type: 'goNext' }),
                isDisabled: !can({ type: 'goNext' }),
              },
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
      case EStep.UploadPhotoProcess:
        return (
          <UploadPhotoProcessStep
            header='Ожидание загрузки фото'
            controls={[
              {
                id: '1',
                label: 'Next (dev)',
                btn: { variant: 'filled', color: 'primary' },
                onClick: () => send({ type: 'goNext' }),
              },
              {
                id: '2',
                label: 'Prev (dev)',
                btn: { variant: 'outlined', color: 'default' },
                onClick: () => send({ type: 'goPrev' }),
              },
            ]}
          />
        )
      case EStep.Final:
        return (
          <ContentWithControls
            header='Done.'
            controls={[
              {
                id: '1',
                label: 'Go Start',
                onClick: () => send({ type: 'goStart' }),
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
