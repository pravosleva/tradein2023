/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx'
import baseClasses from '~/App.module.scss'

type TColor = 'default' | 'primary' | 'secondary' | 'success' | 'black' | 'mtsRed' | 'mtsGray';

export interface ILinkProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  // title: string;
  // showIcon: boolean;
  color: TColor;
  fullWidth?: boolean;
  children: React.ReactNode;
  // variant: TVariant;
  // EnabledEndIcon?: React.ReactNode;
  // EnabledStartIcon?: React.ReactNode;
  // DisabledStartIcon?: React.ReactNode;
  // allowDefaultEnabledEndIconArrowRight?: boolean;
  // allowDefaultEnabledEndIconCheck?: boolean;
}

export const Link = ({
  color,
  href,
  children,
  // className,
  ...nativeProps
}: ILinkProps) => {

  return (
    <a
      href={href}
      className={clsx(
        // classes.spBtn,
        // classes[`spBtn_${variant}`],
        // classes[`spBtn_${variant}_${color}`],
        // {
        //   [classes.spBtn_fullWidth]: fullWidth,
        // },
        baseClasses.truncate,
        // 'font-medium',
        'font-bold',
        'text-md',
        // 'rounded-md',
        'py-2',
        'px-5',

        'focus:outline',
        'focus:outline-3',
        'focus:outline-offset-4',
        // 'focus:outline-spBlueMain',
        // className,
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
      {children}
    </a>
  )
}
