/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsiveBlock } from '~/common/components/sp-custom'
import classes from './BaseLayout.module.scss'
import clsx from 'clsx'

export const BaseLayout: React.FC<any> = ({ children }) => {
  return (
    <div className={classes.appWrapper}>
      <div
        className={clsx(classes.siteHeader, 'backdrop-blur--lite')}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ResponsiveBlock
          isPaddedMobile
          isLimitedForDesktop
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              }}>
            <div>Logo</div>
            <div>menu</div>
          </div>
        </ResponsiveBlock>
      </div>
      <div className={classes.siteBody}>
        {children}
      </div>
      <div className={classes.siteFooter}>
        <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
          2023
        </ResponsiveBlock>
      </div>
    </div>
  )
}
