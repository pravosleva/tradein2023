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
  children: React.ReactNode;
  controls: TControlBtn[];
  controlsAsGrid?: boolean;
  hasChildrenFreeWidth?: boolean;
}

export const ContentWithControls = ({
  header,
  children,
  controls,
  controlsAsGrid,
  hasChildrenFreeWidth,
}: TProps) => {
  return (
    <ErrorBoundary>
      <div className={baseClasses.stack4}>
        <ResponsiveBlock
          // isPaddedMobile
          // isLimitedForDesktop
          className={clsx(classes.stickyHeader, 'backdrop-blur--lite')}
        >
          <ResponsiveBlock
            isPaddedMobile
            isLimitedForDesktop
          >
            <h2 className='text-3xl font-bold'>{header}</h2>
          </ResponsiveBlock>
          
        </ResponsiveBlock>
        
        {
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
        }

        {
          controls.length > 0 && (
            <>
              <ResponsiveBlock
                style={{
                  // border: '1px solid red',
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
