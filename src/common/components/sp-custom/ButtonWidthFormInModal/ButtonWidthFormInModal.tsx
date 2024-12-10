/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, TBtnUISettings } from '~/common/components/sp-custom'
import { vi } from '~/common/vi'
import { useSnapshot } from 'valtio'
import { ECountryCode } from '~/common/xstate/stepMachine/types'
import { groupLog } from '~/utils'
import { useState, useCallback, memo } from 'react'
import { Dialog } from '~/common/components/tailwind'
// import { FaBan } from 'react-icons/fa'
import { RiErrorWarningFill } from 'react-icons/ri'
// import pkg from '../../../../../package.json'
// import baseClasses from '~/App.module.scss'

// const state = proxy({ count: 0, text: 'hello' })

// const VITE_GIT_SHA1 = import.meta.env.VITE_GIT_SHA1

export type TValiateResult = { ok: boolean; reason?: string; }

type TControlBtnUIOnly = {
  label: string;
  btn: TBtnUISettings;
  EnabledStartIcon?: React.ReactNode;
  DisabledStartIcon?: React.ReactNode;
  isDisabled?: boolean;
}

type TFieldType = 'text' | 'text-multiline' | 'number'
type TField = {
  label?: string;
  initValue?: any; // string | number;
  limit?: number;
  descr?: string;
  type: TFieldType;
  validate: ({ value, cfg }: {
    value: any;
    cfg?: {
      [key: string]: any;
    };
  }) => TValiateResult;
  isRequired?: boolean;
  isDisabled?: boolean;
  nativeRules?: {
    placeholder?: string;
    // min: number | string;
    // max: number | string;
    maxLength?: number;
    minLength?: number;
  };
}
type TProps = {
  // controls: TControlBtn[];
  controlBtn: TControlBtnUIOnly;
  closeBtn: TControlBtnUIOnly;
  submitBtn: TControlBtnUIOnly;
  modal: {
    header: string;
    formSchema: {
      [key: string]: TField;
    };
    onTarget: (state: any) => Promise<{ ok: boolean; message?: string; }>;
    onError: ({ message }: { message?: string }) => void;
  };
  isDebugEnabled?: boolean;
}

export const ButtonWidthFormInModal = memo(({
  controlBtn,
  modal,
  closeBtn,
  submitBtn,
  isDebugEnabled,
}: TProps) => {
  const initAppState = useSnapshot(vi.smState.initApp)
  const defaultCountryCode = initAppState.response?.features?.country_code || ECountryCode.RU

  const [isModalOpened, setIsModalOpened] = useState(false)
  const handleOpenModal = useCallback(() => {
    setIsModalOpened(true)
  }, [])
  const handleCloseModal = useCallback(() => {
    setIsModalOpened(false)
  }, [])

  const [externalForm, setExternalForm] = useState({})
  const [isFormReady, setIsFormReady] = useState(false)

  return (
    <>
      <Dialog
        title={
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* <span>{pkg.version}</span>
            <span>GIT SHA1</span>
            <code className={baseClasses.inlineCode}>{VITE_GIT_SHA1}</code> */}
            {modal.header}
          </span>
        }
        size='md'
        isOpened={isModalOpened}
        onClose={handleCloseModal}
        controls={[
          {
            id: '1',
            label: closeBtn.label,
            btn: closeBtn.btn,
            onClick: handleCloseModal,
          },
          {
            id: '2',
            label: submitBtn.label,
            btn: submitBtn.btn,
            onClick: () => {
              modal.onTarget({ state: externalForm })
                .then((result) => {
                  if (isDebugEnabled) {
                    const { ok, message } = result
                    groupLog({ namespace: 'ButtonWidthFormInModal.onClick (submit)', items: [ok, message] })
                  }
                  handleCloseModal()
                })
                .catch(({ message }) => {
                  modal.onError({ message })
                })
              
            },
            isDisabled: !isFormReady || submitBtn.isDisabled,
            DisabledStartIcon: isFormReady ? submitBtn.DisabledStartIcon : <RiErrorWarningFill />,
          },
        ]}
        Body={
          <Form
            makeFocusOnFirstInput
            defaultCountryCode={defaultCountryCode}
            // onChangeField={handleSetExternalStore}
            getValues={(vals) => {
              console.log(vals)
            }}
            onFormReady={({ state }) => {
              if (isDebugEnabled) groupLog({ namespace: 'ButtonWidthFormInModal.onFormReady', items: [state] })
              setExternalForm(state)
              setIsFormReady(true)
            }} 
            onFormNotReady={({ state }) => {
              if (isDebugEnabled) groupLog({ namespace: 'ButtonWidthFormInModal.onFormNotReady', items: [state] })
              setExternalForm(state)
              setIsFormReady(false)
            }} 
            schema={modal.formSchema}
          />
        }
      />
      
      <Button
        color={controlBtn.btn.color}
        variant={controlBtn.btn.variant}
        onClick={handleOpenModal}
        EnabledStartIcon={controlBtn.EnabledStartIcon}
        DisabledStartIcon={controlBtn.DisabledStartIcon}
        disabled={controlBtn.isDisabled}
      >
        {controlBtn.label}
      </Button>
    </>
  )
})
