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
}

export const EnterImeiStep = memo(({
  value,
  onChangeIMEI,
  onSendIMEI,
  isNextBtnDisabled,
  onPrev,
  isPrevBtnDisabled,
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
    if (inputRef.current) inputRef.current.focus()
  }, [])

  return (
    <ContentWithControls
      header='Введите IMEI'
      controls={controls}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={onChangeIMEI}
      />
    </ContentWithControls>
  )
})
