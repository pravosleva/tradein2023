type TAlertType = 'info' | 'warning' | 'danger' | 'success';
type TAlertProps = {
  type: TAlertType;
  header?: string;
  children: React.ReactNode;
}

const getColor = ({ type }: { type: TAlertType }): string => {
  switch (type) {
    case 'info':
      return 'border-l-4 border-blue-500 text-blue-500 border rounded-lg bg-blue-50'
    case 'warning':
      return 'border-l-4 border-yellow-600 text-yellow-600 border rounded-lg bg-yellow-50'
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
    <div className={`flex items-start p-4 text-sm ${color}`} role="alert">
      <div style={{ width: '100%' }}>
        {!!header && (
          <span
            // className="font-medium"
          >{header}</span>
        )}
        {children}
      </div>
    </div>
  )
}
