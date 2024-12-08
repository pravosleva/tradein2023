/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useMemo } from 'react'
import { useMachine } from '@xstate/react'
import { stepMachine, NStepMachine } from '~/common/xstate/stepMachine'
import { initialStepMachineContextFormat } from '~/common/xstate/stepMachine/initialState'
import { StateValue } from 'xstate'

// NOTE: See also https://github.com/statelyai/xstate/discussions/1754#discussioncomment-227301

const ServiceContext = createContext<{
  stateContext: NStepMachine.TContext;
  stateValue: StateValue | undefined;
  send: (arg: NStepMachine.TEvent) => void;
  colorAndMemoryHasDetectedOnServer: boolean;
  can: (e: string | NStepMachine.TEvent) => boolean;
}>({
  stateValue: undefined,
  stateContext: initialStepMachineContextFormat,
  send: () => {},
  colorAndMemoryHasDetectedOnServer: false,
  can: () => false,
})

type TProps = {
  children: React.ReactNode;
}

export const StepMachineContext = ({ children }: TProps) => {
  const [state, send] = useMachine(stepMachine)
  const can = state.can.bind(state)
  const colorAndMemoryHasDetectedOnServer = useMemo(
    () => !!state.context.imei.response?.phone?.memory && !!state.context.imei.response?.phone?.color,
    [
      state.context.imei.response?.phone?.memory,
      state.context.imei.response?.phone?.color,
    ],
  )

  return (
    <ServiceContext.Provider
      value={{
        stateValue: state.value,
        stateContext: state.context,
        send,
        colorAndMemoryHasDetectedOnServer,
        can,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export const useStepMachineContext = () => useContext(ServiceContext)
