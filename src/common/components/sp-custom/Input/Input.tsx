/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import clsx from 'clsx'
import classes from './Input.module.scss'

interface IInputProps extends React.ButtonHTMLAttributes<HTMLInputElement> {
  // title: string;
  // showIcon: boolean;
  // color: 'primary' | 'secondary';
  isErrored?: boolean;
  isSuccess?: boolean;
}

// NOTE: See also about forwardRef https://legacy.reactjs.org/docs/forwarding-refs.html
export const Input = React.forwardRef(({
  children,
  // color,
  // isErrored,
  isSuccess,
  ...nativeProps
}: IInputProps, ref) => {
  return (
    <input
      // @ts-ignore
      ref={ref}
      className={clsx(classes.spInput, { [classes.borderedGreen]: isSuccess })}
      {...nativeProps}
    >
      {children}
    </input>
  )
})
