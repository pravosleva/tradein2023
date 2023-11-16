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
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa6'
// import { FaCheck } from 'react-icons/fa'
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
// import { FaCheckCircle } from 'react-icons/fa'


// export enum EVariant {
//   Filled = 'filled',
//   Outlined = 'outlined',
// }
// export enum EColor {
//   Primary = 'primary',
//   Secondary = 'secondary',
//   Default = 'default',
// }
export type TColor = 'default' | 'primary' | 'secondary' | 'success' | 'black';
export type TVariant = 'filled' | 'outlined';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // title: string;
  // showIcon: boolean;
  color: TColor;
  fullWidth?: boolean;
  variant: TVariant;
  EnabledEndIcon?: React.ReactNode;
  allowDefaultEnabledEndIconArrowRight?: boolean;
  allowDefaultEnabledEndIconCheck?: boolean;
}

// NOTE: See also https://flowbite.com/docs/components/buttons/
export const Button = React.forwardRef(({
  children,
  color,
  fullWidth,
  variant,
  EnabledEndIcon,
  allowDefaultEnabledEndIconArrowRight,
  allowDefaultEnabledEndIconCheck,
  ..._nativeProps
}: IButtonProps, ref) => {
  const { className, ...nativeProps } = _nativeProps
  const EndIcon = useMemo(() => {
    if (nativeProps.disabled) return null
    switch (true) {
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
    allowDefaultEnabledEndIconArrowRight,
    allowDefaultEnabledEndIconCheck,
    nativeProps.disabled,
    EnabledEndIcon,
  ])

  return (
    <button
      // @ts-ignore
      ref={ref}
      className={clsx(
        classes.spBtn,
        classes[`spBtn_${variant}`],
        classes[`spBtn_${variant}_${color}`],
        {
          [classes.spBtn_fullWidth]: fullWidth,
        },
        baseClasses.truncate,
        'font-medium',
        'text-md',
        'py-2',
        'px-5',

        'focus:outline',
        'focus:outline-3',
        'focus:outline-offset-4',
        // 'focus:outline-spBlueMain',
        className,
        {
          // ['focus:outline-spBlueMain']: color === 'primary',
          ['focus:outline-spBlue2']: color === 'primary',
          ['focus:outline-slate-300']: color === 'default',
          ['focus:outline-spGreen']: color === 'success'
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
        }}
      >
        <span>{children}</span>
        {EndIcon}
      </span>
    </button>
  )
})
