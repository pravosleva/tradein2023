import baseClasses from '~/App.module.scss'
import { Button, ResponsiveBlock, TColor, TVariant } from '~/common/components/sp-custom'
import clsx from 'clsx'
import { ErrorBoundary } from '~/common/components/tools'
import classes from './ContentWithControls.module.scss'

export type TControlBtn = {
  id: string;
  label: string;
  btn: {
    color: TColor;
    variant: TVariant;
  },
  onClick: () => void;
  isDisabled?: boolean;
}
type TProps = {
  header: string;
  subheader?: string | (string | null | undefined | false)[];
  subheaderJsx?: React.ReactNode;
  children: React.ReactNode;
  controls: TControlBtn[];
  controlsAsGrid?: boolean;
  hasChildrenFreeWidth?: boolean;
}

export const ContentWithControls = ({
  header,
  subheader,
  subheaderJsx,
  children,
  controls,
  controlsAsGrid,
  hasChildrenFreeWidth,
}: TProps) => {
  return (
    <ErrorBoundary>
      <div className={baseClasses.stack4}>
        <ResponsiveBlock
          className={clsx(classes.stickyHeader, 'backdrop-blur--lite')}
        >
          <ResponsiveBlock
            isPaddedMobile
            isLimitedForDesktop
            className={baseClasses.stack2}
          >
            <h2
              className={clsx(
                'text-xl',
                'sm:text-xl',
                'md:text-3xl',
                'font-bold',
              )}
            >{header}</h2>

            {!!subheader && (
              typeof subheader === 'string' ? (
                <h3
                  className={clsx(
                    'text-lg',
                    'sm:text-lg',
                    'md:text-xl',
                    'font-bold',
                  )}
                >{subheader}</h3>
              ) : Array.isArray(subheader) && (
                subheader.map((str, i) => {
                  if (!str) return null
                  const isFirst = i === 0
                  switch (true) {
                    case isFirst:
                      return (
                        <h3
                          key={`${str}-${i}`}
                          className={clsx('text-lg', 'sm:text-lg', 'md:text-xl', 'font-bold')}
                        >{str}</h3>
                      )
                    default:
                      return (
                        <div
                          key={`${str}-${i}`}
                          style={{
                            fontWeight: 'bold',
                            color: 'gray',
                          }}
                        >{str}</div>
                      )
                  }
                })
              )
            )}
            {!!subheaderJsx && subheaderJsx}
          </ResponsiveBlock>
          
        </ResponsiveBlock>
        
        {
          !!children && (
            hasChildrenFreeWidth ? (
              <div className={baseClasses.stack}>
                {children}
              </div>
            ) : (
              <ResponsiveBlock
                isPaddedMobile
                isLimitedForDesktop
              >
                <div className={baseClasses.stack}>
                  {children}
                </div>
              </ResponsiveBlock>
            )
          )
        }

        {
          controls.length > 0 && (
            <>
              <ResponsiveBlock
                style={{
                  // border: '1px dashed red',
                  padding: '16px 0 16px 0',
                  position: 'sticky',
                  bottom: 0,
                }}
                className='backdrop-blur--lite'
              >
                <ResponsiveBlock
                  isPaddedMobile
                  isLimitedForDesktop
                >
                  <div
                    className={clsx({
                      [baseClasses.specialActionsGrid]: controlsAsGrid,
                      [baseClasses.stack]: !controlsAsGrid,
                    })}>
                  {
                    controls.map(({ id, label, onClick, isDisabled, btn }) => (
                      <Button
                        key={id}
                        {...btn}
                        onClick={onClick}
                        disabled={isDisabled}
                      >
                        {label}
                      </Button>
                    ))
                  }
                  </div>
                </ResponsiveBlock> 
              </ResponsiveBlock>
            </>
          )
        }
      </div>
    </ErrorBoundary>
  )
}
