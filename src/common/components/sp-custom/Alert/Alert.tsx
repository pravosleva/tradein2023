import baseClasses from '~/App.module.scss'
import clsx from 'clsx'

type TAlertType = 'info' | 'warning' | 'danger' | 'success' | 'default' | 'slate';
type TAlertProps = {
  type: TAlertType;
  header?: string;
  children: React.ReactNode;
}

const getColor = ({ type }: { type: TAlertType }): string => {
  switch (type) {
    case 'default':
      return 'p-3 border-none text-gray-500 rounded-lg bg-gray-100'
    case 'slate':
      return 'p-3 border-none text-slate-600 rounded-lg bg-slate-100'
    case 'info':
      return 'p-3 border-none text-blue-400 rounded-lg bg-blue-50'
    case 'warning':
      return 'p-3 border-none text-black border rounded-lg bg-yellow-100 shadow-md'
    case 'danger':
      return 'p-3 border-none text-black rounded-lg bg-mtsRedLight'
    case 'success':
      return 'border-l-4 border-green-600 text-green-600 border rounded-lg bg-green-50'
    default:
      return 'text-gray-800 border border-gray-300 rounded-lg bg-gray-50'
  }
}

export const Alert = ({
  type,
  header,
  children,
}: TAlertProps) => {
  const color = getColor({ type })
  return (
    <div
      className={clsx(['flex', 'items-start', 'p-4', 'text-sm', color])}
      role="alert"
      style={{
        // whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      <div
        className={baseClasses.stack1}
        style={{ width: '100%' }}
      >
        {!!header && (
          <b
            // className="font-medium"
          >{header}</b>
        )}
        {!!children && (
          <div>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
