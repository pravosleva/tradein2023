import { Fragment, useState, useCallback, useLayoutEffect, useRef } from 'react'
import { Listbox as ListboxHui, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import inputClasses from '~/common/components/sp-custom/Input/Input.module.scss'

type TItem = {
  id: string;
  label: string;
  value: string;
}
export type TListboxProps = {
  placeholder: string;
  items: TItem[];
  selectedId?: string;
  onItemSelect: ({ item }: { item: TItem }) => void;
  isDisabled?: boolean;
  // shoudHaveAttention?: boolean;
  makeAutofocus?: boolean;
}

// const people = [
//   { name: 'Wade Cooper' },
//   { name: 'Arlene Mccoy' },
//   { name: 'Devon Webb' },
//   { name: 'Tom Cook' },
//   { name: 'Tanya Fox' },
//   { name: 'Hellen Schmidt' },
// ]

export const Listbox = ({
  placeholder,
  items,
  selectedId,
  onItemSelect,
  isDisabled,
  // shoudHaveAttention,
  makeAutofocus,
}: TListboxProps) => {
  const [selected, setSelected] = useState<TItem | null>(selectedId ? (items.find(({ id }) => selectedId === id) || null): null)

  useLayoutEffect(() => {
    if (!selectedId) setSelected(null)
  }, [selectedId])

  const btnRef = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    if (makeAutofocus && !!btnRef.current) btnRef.current.focus()
  }, [makeAutofocus])

  const handleChange = useCallback((item: TItem) => {
    setSelected(item)
    onItemSelect({ item })
  }, [setSelected, onItemSelect])

  return (
    <div
      className={clsx(
        // 'fixed',
        // 'top-16',
        // 'w-72'
        'w-full',
      )}
      style={{
        // zIndex: 1,
      }}
    >
      <ListboxHui
        value={selected}
        onChange={handleChange}
      >
        <div className='relative'>
          <ListboxHui.Button
            ref={btnRef}
            aria-disabled={isDisabled}
            // disabled={isDisabled}
            className={clsx(
              inputClasses.spInput,
              'relative',
              'w-full',
              'cursor-default',
              'rounded-md',
              'bg-white',
              // 'py-2',
              // 'pl-3',
              // 'pr-10',
              'text-left',
              // 'shadow-md',
              'focus:outline-none',
              'focus-visible:border-slate-300',
              'focus-visible:ring-2',
              'focus-visible:ring-slate-300',
              'focus-visible:ring-offset-2',
              'focus-visible:ring-offset-slate-300',
              // 'sm:text-sm',

              // 'disabled:opacity-50',
              // 'disabled:cursor-not-allowed',
              {
                ['opacity-50 cursor-not-allowed']: isDisabled,
                ['cursor-pointer']: !isDisabled,
                [inputClasses.borderedGreen]: !!selectedId,
              },
            )}
          >
            <span className="block truncate">{selected?.label || placeholder}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxHui.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxHui.Options
              className={clsx(
                'absolute',
                'mt-3',
                'max-h-60',
                'w-full',
                'overflow-auto',
                'rounded-md',
                'bg-white',
                // 'py-1',
                'text-base',
                // 'shadow-lg',
                'menu-box-shadow',
                // 'ring-2',
                // 'ring-spBlueMain',
                // 'ring-black/5',
                'focus:outline-none',
                // 'sm:text-sm',
                // 'divide-y',
                // 'divide-slate-200',
              )}
              style={{
                zIndex: 1,
              }}
              // onChange={(e) => {
              //   console.log(e)
              // }}
            >
              {items.map((item, i) => (
                <ListboxHui.Option
                  key={`${item.value}-${i}`}
                  // className={({ active }) =>
                  //   `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  //     active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  //   }`
                  // }
                  className={({ active }) => clsx(
                    'relative',
                    'cursor-pointer',
                    'select-none',
                    'py-2',
                    'pl-4',
                    'pr-4',
                    {
                      // ['bg-slate-100 text-slate-900']: active,
                      ['bg-spBlueMain text-white']: active,
                      // ['text-gray-900']: !active,
                    },
                  )}
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item.label}
                      </span>
                      {selected ? (
                        <span
                          // className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                          className={clsx(
                            'absolute',
                            'inset-y-0',
                            'right-0',
                            'flex',
                            'items-center',
                            'pr-3',
                            // 'text-slate-600',
                            // 'text-spBlueMain',
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxHui.Option>
              ))}
            </ListboxHui.Options>
          </Transition>
        </div>
      </ListboxHui>
    </div>
  )
}
