type TAlertType = 'info' | 'warning' | 'danger' | 'success';
type TAlertProps = {
  type: TAlertType;
  header?: string;
  children: React.ReactNode;
}

const getColor = ({ type }: { type: TAlertType }): string => {
  switch (type) {
    case 'info':
      // return 'text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800'
      return 'border-l-4 border-blue-500 text-blue-500 border rounded-lg bg-blue-50'
    case 'warning':
      // return 'text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800'
      return 'border-l-4 border-yellow-600 text-yellow-600 border rounded-lg bg-yellow-50'
    case 'danger':
      // return 'text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800'
      return 'border-l-4 border-red-500 text-red-500 border rounded-lg bg-red-50'
    case 'success':
      // return 'text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800'
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
    <div className={`flex items-start p-4 text-sm ${color}`} role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span className="sr-only">Info</span>
      <div>
        {!!header && (
          <span className="font-medium">{header}</span>
        )}
        {children}
      </div>
    </div>
  )
}
