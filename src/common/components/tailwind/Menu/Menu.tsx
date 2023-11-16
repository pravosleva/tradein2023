import { memo } from 'react'
import { Menu as HuiMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button } from '~/common/components/sp-custom'
import clsx from 'clsx'
import classes from './Menu.module.scss'

type TItem = {
  id: string;
  label: string;
  value: string;
}
type TSention = {
  id: string;
  items: (TItem)[];
}
export type TMenuProps = {
  label: string;
  sections: TSention[];
  selectedId?: string;
  onItemSelect: ({ item }: { item: TItem }) => void;
  isDisabled?: boolean;
  shoudHaveAttention?: boolean;
}

// const Section = ({ items, onSelect }: { items: TItem[]; onSelect: ({ item }: { item: TItem }) => void; }) => {
//   return (
//     <div className="px-1 py-1">
//       {items.map((item) => {
//         return (
//           <HuiMenu.Item key={item.id}>
//             {({ active }) => (
//               <button
//                 className={`${
//                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
//                 } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//                 onClick={() => {
//                   onSelect({ item })
//                 }}
//               >
//                 {active ? (
//                   <EditActiveIcon
//                     className="mr-2 h-5 w-5"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   <EditInactiveIcon
//                     className="mr-2 h-5 w-5"
//                     aria-hidden="true"
//                   />
//                 )}
//                 {item.label}
//               </button>
//             )}
//           </HuiMenu.Item>
//         )
//       })}
//     </div>
//   )
// }
const Section = ({ items, onSelect, selectedId }: { items: TItem[]; onSelect: ({ item }: { item: TItem }) => void; selectedId?: string; }) => {
  return (
    <div className="px-1 py-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {items.map((item) => {
        const isSelected = selectedId === item.id
        return (
          <HuiMenu.Item key={item.id}>
            {({ active }) => (
              <Button
                variant={isSelected ? 'filled' : active ? 'filled' : 'outlined'}
                fullWidth
                color={isSelected ? 'primary' : 'black'}
                onClick={() => {
                  onSelect({ item })
                }}
                // disabled={}
              >
                {/* active ? (
                  <EditActiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <EditInactiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                ) */}
                {item.label}
              </Button>
            )}
          </HuiMenu.Item>
        )
      })}
    </div>
  )
}

export const Menu = memo(({
  label,
  sections,
  onItemSelect,
  isDisabled,
  shoudHaveAttention,
  selectedId,
}: TMenuProps) => {
  return (
    <HuiMenu as="div" className="relative inline-block text-left">
      <div>

        <HuiMenu.Button
          // className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          className={clsx(
            'inline-flex',
            'w-full',
            'justify-center',
            'align-center',
            'text-white',
            'rounded-lg',
            'text-md',
            'text-center',
            'px-5',
            'py-2.5',
            'focus:outline-none',
            'font-medium',
            classes.customHover,
            {
              'cursor-not-allowed': isDisabled,
              ['bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-bl']: !shoudHaveAttention,
              [classes.customHover_ok]: !shoudHaveAttention,

              // ['bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800']: shoudHaveAttention,
              ['bg-gradient-to-br from-red-400 to-red-400 hover:bg-gradient-to-bl']: shoudHaveAttention,
              [classes.customHover_notOk]: shoudHaveAttention,
            },
            'disabled:opacity-50',
          )}
          disabled={isDisabled}
        >
          <span className='truncate'>{label}</span>
          <ChevronDownIcon
            // className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            className="ml-2 -mr-1 h-6 w-6 text-white"
            aria-hidden="true"
          />
        </HuiMenu.Button>
        {/* <Button
          color='primary'
          variant='outlined'
          fullWidth
          // className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          disabled={isDisabled}
        >
          {label}
        </Button> */}
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HuiMenu.Items
          // className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-4 ring-black/10 focus:outline-none py-0"
          style={{ zIndex: 1 }}  
        >
          {sections.map((section) => {
            return <Section key={section.id} items={section.items} onSelect={onItemSelect} selectedId={selectedId} />
          })}
        </HuiMenu.Items>
      </Transition>
    </HuiMenu>
  )
})


export default function Example() {
  return (
    <div className="fixed top-16 w-56 text-right">
      <HuiMenu as="div" className="relative inline-block text-left">
        <div>
          <HuiMenu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Options
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </HuiMenu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <HuiMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <HuiMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <EditActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <EditInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Edit
                  </button>
                )}
              </HuiMenu.Item>
              <HuiMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <DuplicateActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <DuplicateInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Duplicate
                  </button>
                )}
              </HuiMenu.Item>
            </div>
            <div className="px-1 py-1">
              <HuiMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <ArchiveActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArchiveInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Archive
                  </button>
                )}
              </HuiMenu.Item>
              <HuiMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <MoveActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <MoveInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Move
                  </button>
                )}
              </HuiMenu.Item>
            </div>
            <div className="px-1 py-1">
              <HuiMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <DeleteActiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <DeleteInactiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Delete
                  </button>
                )}
              </HuiMenu.Item>
            </div>
          </HuiMenu.Items>
        </Transition>
      </HuiMenu>
    </div>
  )
}

function EditInactiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  )
}

function EditActiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  )
}

function DuplicateInactiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  )
}

function DuplicateActiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  )
}

function ArchiveInactiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  )
}

function ArchiveActiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  )
}

function MoveInactiveIcon(props: React.SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  )
}

function MoveActiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  )
}

function DeleteInactiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  )
}

function DeleteActiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  )
}
