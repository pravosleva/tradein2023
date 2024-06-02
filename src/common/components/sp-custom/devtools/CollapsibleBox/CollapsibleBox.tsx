/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import clsx from 'clsx'
import baseClasses from '~/App.module.scss'
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import classes from './CollapsibleBox.module.scss'

type TProps = {
  children: React.ReactNode;
  title: string;
  level?: 1 | 2 | 3 | 4;
  StartIcon?: React.ReactNode;
};

export const CollapsibleBox = ({ title, children, level, StartIcon }: TProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const toggler = useCallback(() => {
    setIsOpened((s) => !s);
  }, [setIsOpened])

  return (
    <>
      <button
        className={clsx(
          classes.toggler,
          {
            [classes[`toggler_level_${level}`]]: !!level,
          },
          baseClasses.truncate,
        )}
        onClick={toggler}
      >
        <span>{isOpened ? <FaMinus fontSize='small' /> : <FaPlus fontSize='small' />}</span>
        {!!StartIcon && <span>{StartIcon}</span>}
        <span className={baseClasses.truncate}>{title}</span>
      </button>
      {isOpened && <div>{children}</div>}
    </>
  )
}
