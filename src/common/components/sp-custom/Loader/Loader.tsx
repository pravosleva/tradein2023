import { memo } from 'react'
import clsx from 'clsx'
import classes from './Loader.module.scss'

export const Loader = memo(() => {
  return (
    <div
      className={clsx(
        classes.loaderAndroidLike,
        classes.width100,
      )}
    >
      <svg
        className={clsx(
          classes['loaderAndroidLike_circular'],
        )}
        viewBox="25 25 50 50"
      >
        <circle
          className={clsx(
            classes['loaderAndroidLike_path'],
          )}
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="5"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  )
})
