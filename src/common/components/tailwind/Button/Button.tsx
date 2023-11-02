interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // title: string;
  // showIcon: boolean;
  color: 'primary' | 'secondary';
}

// NOTE: See also https://flowbite.com/docs/components/buttons/
export const Button = ({
  children,
  color,
  ...nativeProps
}: IButtonProps) => {
  let c = ''
  switch (color) {
    case 'primary':
      c = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      break
    case 'secondary':
      c = 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
      break
    default:
      c = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      break
  }

  return (
    <button
      className={c}
      {...nativeProps}
    >
      {children}
    </button>
  )
}
