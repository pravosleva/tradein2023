import { TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
import { Dialog as HuiDialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from '~/common/components/sp-custom'
import clsx from 'clsx'

type TProps = {
  isOpened: boolean;
  controls: TControlBtn[];
  onClose: () => void;
  title?: string;
  description?: string;
  Body: React.ReactNode;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export function Dialog({
  isOpened,
  controls,
  onClose,
  title,
  description,
  Body,
  size,
}: TProps) {
  return (
    <>
      <Transition appear show={isOpened} as={Fragment}>
        <HuiDialog
          as="div"
          className="relative z-10"
          // open={isOpened}
          onClose={onClose}
        >
          {/* <div style={{ border: '1px solid red' }} ref={stepContentTopRef}>TOP</div> */}

          {/* NOTE: The backdrop, rendered as a fixed sibling to the panel container */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
          </Transition.Child>

          <div
            className={clsx(
              // NOTE: Full-screen scrollable container
              'fixed',
              'inset-0',
              // 'w-screen',
              'overflow-y-auto',

              'p-1',
            )}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <HuiDialog.Panel
                  // NOTE: Container to center the panel
                  // flex min-h-full items-center justify-center p-4
                  className={clsx(
                    // 'mx-auto',
                    'w-full',
                    `max-w-${size}`,
                    'transform overflow-hidden',
                    'rounded-2xl',
                    'bg-white',
                    'p-6',
                    'text-left',
                    'align-middle',
                    'shadow-xl',
                    'transition-all',
                  )}
                >
                  <HuiDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </HuiDialog.Title>

                  {/* <HuiDialog.Description>
                    This will permanently deactivate your account
                  </HuiDialog.Description> */}

                  {
                    !!description && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {description}
                        </p>
                      </div>
                    )
                  }

                  <div
                    // className={clsx('mt-2')}
                  >
                    {Body}
                  </div>
                  
                  <div
                    className="mt-4 flex flex-row flex-wrap"
                    style={{ gap: '16px' }}
                    // NOTE: grid grid-rows-4 grid-flow-col gap-4
                  >
                    {
                      controls.map(({
                        id, label, onClick, isDisabled,
                        btn,
                      }) => (
                        <Button
                          // className='basis-1/3'
                          key={id}
                          {...btn}
                          onClick={onClick}
                          disabled={isDisabled}
                        >
                          {label}
                        </Button>
                        // NOTE: Or example from doc
                        // <button key={id} onClick={onClick} disabled={isDisabled}>{label}</button>
                      ))
                    }
                  </div>
                </HuiDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HuiDialog>
      </Transition>
    </>
  )
}
