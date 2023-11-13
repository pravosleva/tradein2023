/* eslint-disable @typescript-eslint/no-unused-vars */
// import { stepMachine, EStep } from '~/common/xstate/stepMachine'
import { ContentWithControls } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'

const envs = import.meta.env
const isDev = process.env.NODE_ENV === 'development'
const isLocalProd = import.meta.env.VITE_LOCAL_PROD

type TProps = {
  onStart: () => void;
}

export const InitStep = ({
  onStart,
}: TProps) => {
  // const [_state, send] = useMachine(stepMachine)
  // const can = state.can.bind(state)

  return (
    <ContentWithControls
      header='TODO: INIT'
      controls={[
        {
          id: '1',
          label: 'Start',
          onClick: onStart,
          btn: {
            color: 'primary',
            variant: 'filled',
          },
        }
      ]}
    >
      <div className={baseClasses.stack}>
        {/* <h3 className='text-2xl font-bold'></h3> */}
        {
          (isDev || isLocalProd) && (
            <>
              <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                <li>Init page
                  <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    <li>⚠️ Get user data method
                      <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                        <li><code className={baseClasses.inlineCode}>onSuccess</code>
                          <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>Put to <code className={baseClasses.inlineCode}>state.context.baseSessionInfo</code>
                              <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                <li><code className={baseClasses.inlineCode}>tradeinId</code></li>
                              </ul>
                            </li>
                            
                            <li>Select Device type?
                              <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                <li>Mobile phohe <b>IMEI</b></li>
                                <li>Smartwatch <b>S/N</b></li>
                              </ul>
                            </li>

                            <li>✅ Go next step btn or automatically?</li>
                          </ul>
                        </li>
                        <li><code className={baseClasses.inlineCode}>onError</code> Err ui message
                          <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>⛔ Go back btn</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
              <pre className={baseClasses.preStyled}>{JSON.stringify({
                envs,
              }, null, 2)}</pre>
            </>
          )
        }
      </div>
    </ContentWithControls>
  )
}
