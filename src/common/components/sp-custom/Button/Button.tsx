/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import clsx from 'clsx'
import classes from './Buttom.module.scss'
import baseClasses from '~/App.module.scss'

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
}

// NOTE: See also https://flowbite.com/docs/components/buttons/
export const Button = React.forwardRef(({
  children,
  color,
  fullWidth,
  variant,
  ...nativeProps
}: IButtonProps, ref) => {
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
      )}
      {...nativeProps}
    >
      <span>{children}</span>
    </button>
  )
})
