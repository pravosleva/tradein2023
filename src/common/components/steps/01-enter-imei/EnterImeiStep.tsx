/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { stepMachine, EStep } from '~/common/xstate/stepMachine'
import { memo, useMemo, useRef, useEffect } from 'react'
import { Input } from '~/common/components/sp-custom'
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
// import baseClasses from '~/App.module.scss'

type TProps = {
  value: string;
  onChangeIMEI: (e: React.FormEvent<HTMLInputElement>) => void;
  onSendIMEI: () => void;
  isNextBtnDisabled: boolean;
  onPrev?: () => void;
  isPrevBtnDisabled: boolean;
  makeAutofocusOnComplete?: boolean;
}

export const EnterImeiStep = memo(({
  value,
  onChangeIMEI,
  onSendIMEI,
  isNextBtnDisabled,
  onPrev,
  isPrevBtnDisabled,
  makeAutofocusOnComplete,
}: TProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useMemo<TControlBtn[]>(() => {
    const btns: TControlBtn[] = [
      {
        id: '1',
        label: 'Проверить IMEI',
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
  }, [isNextBtnDisabled, onSendIMEI, onPrev, isPrevBtnDisabled])
  useEffect(() => {
    if (inputRef.current && isNextBtnDisabled) inputRef.current.focus()
  }, [isNextBtnDisabled])

  return (
    <ContentWithControls
      header='Введите IMEI'
      controls={controls}
      isStickyBottomControls
      autofocusBtnId={makeAutofocusOnComplete ? (isNextBtnDisabled ? undefined : '1') : undefined}
    >
      <Input
        isSuccess={!isNextBtnDisabled}
        ref={inputRef}
        value={value}
        onChange={onChangeIMEI}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isNextBtnDisabled) onSendIMEI()
        }}
        // @ts-ignore
        maxLength={15}
        style={{
          letterSpacing: '0.15em',
        }}
      />
    </ContentWithControls>
  )
})
