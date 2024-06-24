/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useMemo } from 'react'
import clsx from 'clsx'
import classes from './Buttom.module.scss'
import baseClasses from '~/App.module.scss'
// import Icon from '@mdi/react'
// import {
//   mdiArrowRight,
//   // mdiArrowRightBox,
// } from '@mdi/js'
// import { FaBeer } from 'react-icons/fa'
import {
  // FaArrowRightLong,
  // FaArrowRight,
  // FaArrowLeft,
  FaCheck,
} from 'react-icons/fa6'
import {
  FaArrowLeft, FaArrowRight,
  // FaCheck,
  // FaCheckCircle,
} from 'react-icons/fa'
// import { FaCheck } from 'react-icons/fa'
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
// import { FaCheckCircle } from 'react-icons/fa'
import { TColor, TVariant } from './types'

// export enum EVariant {
//   Filled = 'filled',
//   Outlined = 'outlined',
// }
// export enum EColor {
//   Primary = 'primary',
//   Secondary = 'secondary',
//   Default = 'default',
// }

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // title: string;
  // showIcon: boolean;
  color: TColor;
  fullWidth?: boolean;
  variant: TVariant;

  EndIcon?: React.ReactNode;
  EnabledEndIcon?: React.ReactNode;
  DisabledEndIcon?: React.ReactNode;

  StartIcon?: React.ReactNode;
  EnabledStartIcon?: React.ReactNode;
  DisabledStartIcon?: React.ReactNode;

  allowDefaultEnabledEndIconArrowRight?: boolean;
  allowDefaultEnabledStartIconArrowLeft?: boolean;
  allowDefaultEnabledEndIconCheck?: boolean;
}

// NOTE: See also https://flowbite.com/docs/components/buttons/
export const Button = React.forwardRef(({
  children,
  color,
  fullWidth,
  variant,

  EndIcon,
  EnabledEndIcon,
  DisabledEndIcon,

  StartIcon,
  EnabledStartIcon,
  DisabledStartIcon,

  allowDefaultEnabledEndIconArrowRight,
  allowDefaultEnabledEndIconCheck,
  allowDefaultEnabledStartIconArrowLeft,
  ..._nativeProps
}: IButtonProps, ref) => {
  const { className, ...nativeProps } = _nativeProps
  const _EndIcon = useMemo(() => {
    if (nativeProps.disabled) return EndIcon || DisabledEndIcon || null
    switch (true) {
      case !!EndIcon:
        return EndIcon
      case !!EnabledEndIcon:
        return EnabledEndIcon
      case allowDefaultEnabledEndIconArrowRight:
        return <FaArrowRight />
      case allowDefaultEnabledEndIconCheck:
        return <FaCheck />
      default:
        return null
    }
  }, [
    EndIcon,
    allowDefaultEnabledEndIconArrowRight,
    allowDefaultEnabledEndIconCheck,
    nativeProps.disabled,
    EnabledEndIcon,
    DisabledEndIcon,
  ])
  const _StartIcon = useMemo(() => {

    switch (nativeProps.disabled) {
      case true:
        switch (true) {
          case !!StartIcon:
            return StartIcon
          case !!DisabledStartIcon:
            return DisabledStartIcon
          default:
            return null
        }
      default:
        switch (true) {
          case !!StartIcon:
            return StartIcon
          case !!EnabledStartIcon:
            return EnabledStartIcon
          case allowDefaultEnabledStartIconArrowLeft:
            return <FaArrowLeft />
          default:
            return null
        }
    }
  }, [
    StartIcon,
    allowDefaultEnabledStartIconArrowLeft,
    nativeProps.disabled,
    EnabledStartIcon,
    DisabledStartIcon,
  ])
  const isVariantAsBnt = useMemo(() => variant !== 'unstyled' && variant !== 'link', [variant])
  const isVariantAsLink = useMemo(() => variant === 'link', [variant])

  return (
    <button
      // @ts-ignore
      ref={ref}
      className={clsx(
        {
          [classes.spBtn]: isVariantAsBnt,
          [classes[`spBtn_${variant}`]]: isVariantAsBnt,
          [classes.spBtn_fullWidth]: fullWidth,
          [clsx([
            'py-2',
            'px-5',
            'focus:outline',
            'focus:outline-3',
            'focus:outline-offset-4',
          ])]: isVariantAsBnt,
          'underline hover:underline': isVariantAsLink,
        },
        // 'focus:outline',
        // 'focus:outline-3',
        // 'focus:outline-offset-4',
        classes[`spBtn_${variant}_${color}`],
        baseClasses.truncate,
        // 'font-medium',
        'font-bold',
        'text-md',
        // 'rounded-md',

        // 'focus:outline-spBlueMain',
        className,
        {
          // ['focus:outline-spBlueMain']: color === 'primary',
          ['focus:outline-spBlue2']: color === 'primary',
          ['focus:outline-slate-300']: color === 'default',
          ['focus:outline-spGreen']: color === 'success',
          ['focus:outline-mtsRed']: color === 'mtsRed',
          ['focus:outline-mtsGray']: color === 'mtsGray',
        },
      )}
      {...nativeProps}
    >
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          // border: '1px solid red'
        }}
      >
        {_StartIcon}
        <span className={baseClasses.truncate}>{children}</span>
        {_EndIcon}
      </span>
    </button>
  )
})
