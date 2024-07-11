/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { stepMachine, EStep } from '~/common/xstate/stepMachine'
import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react'
import {
  Alert,
  CopyToClipboardWrapper,
  ImageGalleryAsGrid,
  Input,
  // ReportMessageForDevs,
} from '~/common/components/sp-custom'
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
// import baseClasses from '~/App.module.scss'
import { RadioGroup } from '~/common/components/tailwind'

const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL || ''

type TProps = {
  value: string;
  onChangeIMEI: (e: React.FormEvent<HTMLInputElement>) => void;
  onSendIMEI: () => void;
  isNextBtnDisabled: boolean;
  onPrev?: () => void;
  isPrevBtnDisabled: boolean;
  makeAutofocusOnComplete?: boolean;
  hasDeviceTypePseudoChoice?: boolean;
}

type TOption = {
  label: string;
  value: string;
}
enum EDeviceType {
  PhoneAndTablet = 'mobile_phone,tablet',
  Smartwatch = 'smartwatch',
}
const options: TOption[] = [
  {
    label: 'Смартфоны / Планшеты',
    value: EDeviceType.PhoneAndTablet,
  },
  {
    label: 'Смарт-часы',
    value: EDeviceType.Smartwatch,
  },
]
const stepHeader: {
  [key in EDeviceType]: string;
} = {
  [EDeviceType.PhoneAndTablet]: 'Введите IMEI',
  [EDeviceType.Smartwatch]: 'Введите S/N',
}
const stepBtnLabel: {
  [key in EDeviceType]: string;
} = {
  [EDeviceType.PhoneAndTablet]: 'Проверить IMEI',
  [EDeviceType.Smartwatch]: 'Проверить S/N',
}

export const EnterImeiStep = memo(({
  value,
  onChangeIMEI,
  onSendIMEI,
  isNextBtnDisabled,
  onPrev,
  isPrevBtnDisabled,
  makeAutofocusOnComplete,
  hasDeviceTypePseudoChoice,
}: TProps) => {
  const [selectedDeviceType, setSelectedDeviceType] = useState<TOption | null>(options[0])
  const handleSelect = useCallback((item: TOption) => {
    // TODO: Set external state...
    setSelectedDeviceType(item)
  }, [])

  const [_isUSSDCopied, setIsUSSDCopied] = useState(false)
  const handleUSSDCopy = useCallback(() => {
    setIsUSSDCopied(true)
  }, [setIsUSSDCopied])

  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useMemo<TControlBtn[]>(() => {
    const btns: TControlBtn[] = [
      {
        id: '1',
        // @ts-ignore
        label: selectedDeviceType?.value ? stepBtnLabel[selectedDeviceType?.value] : 'Проверить IMEI',
        onClick: onSendIMEI,
        isDisabled: isNextBtnDisabled,
        btn: {
          variant: 'filled',
          color: 'primary',
        },
        allowDefaultEnabledEndIconArrowRight: true,
      }
    ]
    if (onPrev) btns.push({
      id: '2',
      label: 'Назад',
      onClick: onPrev,
      isDisabled: isPrevBtnDisabled,
      btn: {
        variant: 'outlined',
        color: 'default',
      },
    })
    return btns
  }, [isNextBtnDisabled, onSendIMEI, onPrev, isPrevBtnDisabled, selectedDeviceType?.value])
  useEffect(() => {
    if (inputRef.current && isNextBtnDisabled) inputRef.current.focus()
  }, [isNextBtnDisabled])

  return (
    <ContentWithControls
      // @ts-ignore
      header={selectedDeviceType?.value ? stepHeader[selectedDeviceType?.value] : 'Введите IMEI'}
      controls={controls}
      isStickyBottomControls
      autofocusBtnId={makeAutofocusOnComplete ? (isNextBtnDisabled ? undefined : '1') : undefined}
    >
      {
        hasDeviceTypePseudoChoice && (
          <RadioGroup
            items={options}
            selectedItem={selectedDeviceType}
            onSelect={handleSelect}
            iconPosition='left'
          />
        )
      }
      <Input
        style={{
          letterSpacing: '0.15em',
        }}
        isSuccess={!isNextBtnDisabled}
        ref={inputRef}
        value={value}
        // @ts-ignore
        placeholder={selectedDeviceType?.value ? stepHeader[selectedDeviceType?.value] : 'Введите IMEI'}
        onChange={onChangeIMEI}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isNextBtnDisabled) onSendIMEI()
        }}
        // @ts-ignore
        maxLength={15}
        type='number'
      />

      <div
        style={{
          // marginTop: '60px',
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Alert
          type='danger'
        >
          IMEI устройства можно проверить запросом USSD-команды <CopyToClipboardWrapper text='*#06#' onCopy={handleUSSDCopy} /> в приложении «Телефон»
        </Alert>

        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
            padding: '8px',
            fontSize: 'small'
          }}
        >
          <div>
            В случае, если не получилось найти или проверить IMEI, обратитесь в круглосуточную поддержку в Telegram, отсканировав QR-код
          </div>
          <img
            style={{
              width: '90px',
              height: '90px',
            }}
            src={`${PUBLIC_URL}/static3/img/common/qr-tg-support-bot.gif`}
            alt='tg'
          />
        </div> */}
        {/* <ReportMessageForDevs /> */}
        <ImageGalleryAsGrid
          items={[
            {
              title: 'Example 1.',
              caption: 'Huawei',
              src: `${PUBLIC_URL}/static3/img/hints/imei/imei-huawei.png`,
            },
            {
              title: 'Example 2.',
              caption: 'Apple',
              src: `${PUBLIC_URL}/static3/img/hints/imei/imei-apple.jpeg`,
            },
          ]}
        />
      </div>
    </ContentWithControls>
  )
})
