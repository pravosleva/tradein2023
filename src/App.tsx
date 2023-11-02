/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { pageMachine } from './xstate/pageMachine'
import { stepMachine, EStep } from './xstate/stepMachine'
// import { actions } from 'xstate'
import { useMachine } from '@xstate/react'
import { useMemo } from 'react'

function App() {
  // const [count, setCount] = useState(0)
  const [state, send] = useMachine(stepMachine)
  const can = state.can.bind(state)

  const Step = useMemo(() => {
    switch (state.value) {
      case EStep.INIT:
        return (
          <div className='stack'>
            <div>{state.value}</div>
            <button onClick={() => send({ type: 'goIMEI' })}>
              Start
            </button>
          </div>
        )
      case EStep.ENTER_IMEI:
        return (
          <div className='stack'>
            <div>{state.value} | {state.context.imei.value}</div>
            <input
              value={state.context.imei.value}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                send({ type: 'SET_IMEI', value: e.currentTarget.value })
              }}
            />
            <button
              onClick={() => {
                send({ type: 'goNext' })
              }}
              disabled={!can({ type: 'goNext' })}
            >
              Проверить IMEI
            </button>
          </div>
        )
      case EStep.SEND_IMEI:
        return (
          <div className='stack'>
            <div>{state.value} [{state.context.imei.result.state}]</div>
            {/* <pre className='pre-style'>{JSON.stringify(fetchIMEIMachineState.context, null, 2)}</pre> */}
          </div>
        )
      case EStep.IMEI_ERR:
        return (
          <div className='stack'>
            <div>{state.value} | {state.context.imei.uiMsg}</div>
            <button
              onClick={() => {
                send({ type: 'prevStep' })
              }}
            >
              Назад
            </button>
          </div>
        )
      case EStep.FINAL:
        return (
          <div className='stack'>
            <div>{state.value}</div>
          </div>
        )
      case EStep.ENTER_MEM_AND_COLOR:
        return (
          <div className='stack'>
            <div>{state.value}</div>
            {/* <input
              value={state.context.color.value || ''}
              onChange={(e: React.FormEvent<HTMLInputElement>) => send({ type: 'SET_COLOR', value: { value: e.currentTarget.value, label: 'wip' } })}
            />
            <input
              value={state.context.memory.value || ''}
              onChange={(e: React.FormEvent<HTMLInputElement>) => send({ type: 'SET_MEMORY', value: { value: e.currentTarget.value, label: 'wip' } })}
            /> */}
            <button
              onClick={() => send({ type: 'goNext' })}
              disabled={!can({ type: 'goNext' })}
            >
              Next
            </button>
          </div>
        )
      default:
        return (
          <div className='stack'>
            <div>Unknown step: {String(state.value)}</div>
          </div>
        )
    }
  }, [
    state.value, send, state.context.imei, can,
    // state.context.color.selectedItem, state.context.memory.selectedItem,
  ])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {Step}
      <div className="card">
        <pre className='pre-style'>{JSON.stringify(state.context, null, 2)}</pre>
      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
