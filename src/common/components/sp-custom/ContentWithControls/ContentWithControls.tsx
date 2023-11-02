import baseClasses from '~/App.module.scss'
import { Button, TColor, TVariant } from '~/common/components/sp-custom'
import clsx from 'clsx'
import { ErrorBoundary } from '~/common/components/tools'

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
}

export const ContentWithControls = ({
  header,
  children,
  controls,
  controlsAsGrid,
}: TProps) => {
  return (
    <ErrorBoundary>
      <div className={baseClasses.stack}>
        <h2 className='text-3xl font-bold' style={{ marginBottom: '30px' }}>{header}</h2>
        {children}
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
      </div>
    </ErrorBoundary>
  )
}
