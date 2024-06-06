/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import clsx from 'clsx';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import classes from './PhoneInput.module.scss'
import inputClasses from '~/common/components/sp-custom/Input/Input.module.scss'

const borderWidth = 1

interface IProps {
  defaultCountryCode?: string;
  // isErrored?: boolean;
  isSuccess?: boolean;
  onChange: (phone: string) => void;
  value: string;
  // originalProps?: any;
  className?: string;
  ruOnly?: boolean;
}

export const PhoneInput = React.forwardRef(({
  defaultCountryCode,
  // isErrored,
  isSuccess,
  onChange,
  value,
  // className,
  ruOnly,
}: IProps, ref) => {
  const customizedOriginalProps = {
    containerClass: 'react-phone-input-2_containerClass',
    inputClass: clsx(
      'react-phone-input-2_inputClass',
      inputClasses.spInput,
      {
        // borderColor: '#cbd5e1', // stale-300
        // [classes.borderedRed]: isErrored,
        [classes.borderedGreen]: isSuccess,
        [classes.borderedGray]: !isSuccess,
      },
      'py-2',
      'pl-2',
      'pr-6',
    ),
    buttonClass: clsx(
      // inputClasses.buttonClass,
      {
        // [classes.borderedRed]: isErrored,
        [classes.borderedGreen]: isSuccess,
        [classes.borderedGray]: !isSuccess,
      },
    ),
    searchClass: 'react-phone-input-2_searchClass',
    // dropdownClass: 'react-phone-input-2_dropdownClass',
    dropdownClass: clsx(
      // 'absolute',
      // 'left-0',
      // 'mt-2',
      // 'w-56',
      // 'origin-top-right',
      'divide-y',
      'divide-gray-200',
      // 'rounded-xl',
      // 'bg-white',
      // 'shadow-lg',
      // 'ring-4',
      // 'py-0',
      // 'focus:outline-none',
      // 'ring-black/10',
    ),
    containerStyle: {
      // border: '2px solid red',
      borderRadius: '0px',
      // height: '60px',
      height: '100%',
    },
    inputStyle: {
      borderWidth: `${borderWidth}px`,
      borderColor: '#cbd5e1', // stale-300
      // padding: '1px',
      // border: '2px solid lightgray',
      // padding: '5px 10px',
      // fontSize: '16px',
      height: '100%',
      width: '100%',
      // letterSpacing: '0.05em',
    },
    buttonStyle: {
      borderRadius: '10px 0 0 10px',
      borderWidth: `${borderWidth}px`,
      // borderColor: '#cbd5e1', // stale-300
    },
    dropdownStyle: {
      // border: '2px solid lightgray',
      maxWidth: '220px',
      borderRadius: '10px',
    },
    // searchStyle: {},
  }

  return (
    <div
      className={classes.phoneInputWrapper}
    >
      <_PhoneInput
        // @ts-ignore
        ref={ref}
        // className={className}
        country={defaultCountryCode?.toLowerCase() || 'ru'}
        onlyCountries={ruOnly ? ['ru'] : ['ru', 'by', 'kz']}
        // enableSearch
        placeholder="Номер телефона"
        value={value}
        onChange={onChange}
        {...customizedOriginalProps}
      />
    </div>
  )
})
