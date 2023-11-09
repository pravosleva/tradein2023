/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import classes from './PhoneInput.module.scss'
import inputClasses from '~/common/components/sp-custom/Input/Input.module.scss'

interface IProps {
  onChange: (phone: string) => void;
  value: string;
  // originalProps?: any;
  className?: string;
  ruOnly?: boolean;
}

const customizedOriginalProps = {
  containerClass: 'react-phone-input-2_containerClass',
  inputClass: clsx(
    'react-phone-input-2_inputClass',
    inputClasses.spInput
  ),
  // buttonClass: clsx(inputClasses.buttonClass),
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
    borderWidth: '2px',
    // padding: '1px',
    border: '2px solid lightgray',
    // padding: '5px 10px',
    // fontSize: '16px',
    height: '100%',
    width: '100%',
  },
  buttonStyle: {
    borderRadius: '8px 0 0 8px',
    borderWidth: '2px',
  },
  dropdownStyle: {
    // border: '2px solid lightgray',
    maxWidth: '220px',
    borderRadius: '8px',
  },
  // searchStyle: {},
}

export const PhoneInput = ({
  onChange,
  value,
  // className,
  ruOnly,
}: IProps) => {
  return (
    <div
      className={classes.phoneInputWrapper}
    >
      <_PhoneInput
        // className={className}
        country={'ru'}
        onlyCountries={ruOnly ? ['ru'] : ['ru', 'by', 'kz']}
        // enableSearch
        placeholder="Номер телефона"
        value={value}
        onChange={onChange}
        {...customizedOriginalProps}
      />
    </div>
  )
}
