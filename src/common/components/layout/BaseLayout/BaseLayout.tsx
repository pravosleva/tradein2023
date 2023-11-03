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
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <img className={classes.logo} src='/static3/img/logo/sp/logo.svg' />
            <div
              style={{
                marginLeft: 'auto',
              }}
            >
              <div>display_name</div>
            </div>
            
          </div>
        </ResponsiveBlock>
      </div>
      <div className={classes.siteBody}>
        {children}
      </div>
      <div className={classes.siteFooter}>
        <ResponsiveBlock isPaddedMobile isLimitedForDesktop>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              minHeight: '50px',
            }}
          >
            <div>
              2023
            </div>
            <div>
              SmartPrice
            </div>
          </div>
        </ResponsiveBlock>
      </div>
    </div>
  )
}
