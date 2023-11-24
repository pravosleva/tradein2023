/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsiveBlock } from '~/common/components/sp-custom'
import classes from './BaseLayout.module.scss'
import clsx from 'clsx'
import { useMemo } from 'react'
import { vi } from '~/common/vi'

export const BaseLayout: React.FC<any> = ({ children }) => {
  const fullyear = useMemo(() => new Date().getFullYear(), [])

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
              {
                !!vi.smState.initApp.response?.user_data?.display_name && (
                  <div>{vi.smState.initApp.response?.user_data.display_name}</div>
                )
              }
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
              gap: '8px',
              minHeight: '50px',
            }}
          >
            <div>
              2017 – {fullyear}
            </div>
            <div id='footer-compary'>
              SmartPrice
            </div>
          </div>
        </ResponsiveBlock>
      </div>
    </div>
  )
}
