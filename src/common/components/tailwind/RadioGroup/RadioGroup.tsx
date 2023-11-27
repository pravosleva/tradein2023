import { RadioGroup as HuiRadioGroup } from '@headlessui/react'
import clsx from 'clsx'

// NOTE: See also https://headlessui.com/react/radio-group

type TItem = {
  value: string;
  label: string;
}
type TProps = {
  items: TItem[];
  selectedItem: TItem | null;
  onSelect: (val: TItem) => void;
}

export const RadioGroup = ({ items, selectedItem, onSelect }: TProps) => {
  // const [selected, setSelected] = useState(selectedItem)

  return (
    <div className='w-full'>
      <div
        className={clsx(
          'mx-auto',
          'w-full',
        )}
        // style={{
        //   border: '1px solid red',
        // }}
      >
        <HuiRadioGroup
          value={selectedItem}
          onChange={(item) => {
            if (item) onSelect(item)
          }}
          // style={{
          //   border: '1px solid red',
          // }}
        >
          {/* <HuiRadioGroup.Label className='sr-only'>
            Server size
          </HuiRadioGroup.Label> */}
          <div className='space-y-4'>
            {items.map((item) => {
              const isSelected = selectedItem?.value === item.value
              return (
                <HuiRadioGroup.Option
                  key={item.value}
                  value={item}
                  className={({ active, checked }) =>
                    clsx(
                      'relative',
                      'flex',
                      'cursor-pointer',
                      'rounded-lg',
                      'px-4',
                      'py-4',
                      'shadow-md',
                      'focus:outline-none',
                      {
                        [
                          clsx(
                            'ring-2',
                            'ring-white/60',
                            'ring-offset-2',
                            // 'ring-offset-spBlueMain/75',
                            'ring-offset-spGreenDark/75',
                          )
                        ]: active || isSelected,

                        // ['bg-spBlueMain/75 text-white']: checked || isSelected,
                        ['bg-spGreenDark/75 text-white']: checked || isSelected,
                        ['bg-white']: !isSelected,
                      },
                    )
                  }
                >
                  {({
                    // active,
                    checked,
                    // disabled,
                  }) => (
                    <>
                      <div
                        className='flex w-full items-center justify-between'
                      >
                        <div className='flex items-center'>
                          <div className='text-md'>
                            <HuiRadioGroup.Label
                              as='p'
                              className={
                                clsx(
                                  'font-medium',
                                  {
                                    ['text-white']: checked || isSelected,
                                    ['text-gray-900']: !(checked || isSelected),
                                  },
                                )
                              }
                            >
                              {item.label}
                            </HuiRadioGroup.Label>

                            {/* <HuiRadioGroup.Description
                              as="span"
                              className={`inline ${
                                checked ? 'text-sky-100' : 'text-gray-500'
                              }`}
                            >
                              <span>
                                {plan.ram}/{plan.cpus}
                              </span>{' '}
                              <span aria-hidden="true">&middot;</span>{' '}
                              <span>{plan.disk}</span>
                            </HuiRadioGroup.Description> */}

                          </div>
                        </div>
                        {(checked || isSelected) ? (
                          <div className='shrink-0 text-white'>
                            <CheckIcon className='h-6 w-6' />
                          </div>
                        ) : (
                          <div className="shrink-0 text-white">
                            <EmptyIcon
                              // className='h-6 w-6 stroke-spBlueMain/75'
                              className='h-6 w-6 stroke-slate-300'
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </HuiRadioGroup.Option>
              )
            })}
          </div>
        </HuiRadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
      <path
        d='M7 13l3 3 7-7'
        stroke='#fff'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function EmptyIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx={12} cy={12} r={11}
        // fill="#fff"
        // opacity="0.2"
        fill='none'
        // stroke='#FF62E1'
        strokeWidth='2'
      />
    </svg>
  )
}
