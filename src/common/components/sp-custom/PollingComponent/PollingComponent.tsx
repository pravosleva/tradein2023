/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useCallback, memo, useLayoutEffect } from 'react';
import baseClasses from '~/App.module.scss'
import { Alert, Loader } from '~/common/components/sp-custom'
import clsx from 'clsx'
import { NSP } from '~/utils/httpClient';

type TProps = {
  delay?: number;
  resValidator: (data: any) => boolean;
  _resFormatValidator?: (json: any) => boolean;
  onEachResponse?: ({ data }: { data: any }) => void;
  onSuccess: ({ data }: { data: any }) => void;
  promise: () => Promise<any>;
  isDebugEnabled?: boolean;
};

export const PollingComponent = memo(({
  delay = 1000,
  resValidator,
  _resFormatValidator,
  onEachResponse,
  onSuccess,
  promise,
  isDebugEnabled,
}: TProps) => {
  const timeoutRef = useRef<any>(null)
  const [isWorking, setIsWorking] = useState<boolean>(true)
  const [retryCounter, setRetryCounter] = useState<number>(0)
  const [lastResponse, setLastResponse] = useState<NSP.TStandartMinimalResponse | null>(null)

  const updateCounterIfNecessary = useCallback(async () => {
    await promise()
      .then((data) => {
        setLastResponse(data)
        if (resValidator(data)) {
          setIsWorking(false)
          onSuccess({ data })
        }
        else setRetryCounter((c) => c + 1)
      })
      .catch((_err: any) => {
        setLastResponse(_err)

        setRetryCounter((c) => c + 1)
      })
  }, [onSuccess, promise, resValidator, setIsWorking])

  useLayoutEffect(() => {
    if (isDebugEnabled) console.log('--- eff: PollingComponent init')
  }, [isDebugEnabled])

  useLayoutEffect(() => {
    if (onEachResponse && (_resFormatValidator ? _resFormatValidator(lastResponse) : true)) onEachResponse({ data: lastResponse })
  }, [lastResponse, onEachResponse, _resFormatValidator])

  useLayoutEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(updateCounterIfNecessary, delay)

    if (timeoutRef.current)
      return () => {
        clearTimeout(timeoutRef.current)
      }
  }, [retryCounter, updateCounterIfNecessary, delay])

  useLayoutEffect(() => {
    if (!isWorking) clearTimeout(timeoutRef.current)
  }, [isWorking])

  switch(true) {
    case isDebugEnabled:
      return (
        <div className={baseClasses.stack2}>
          <h2 className='text-3xl font-bold'><code className={baseClasses.inlineCode}>PollingComponent</code> debug</h2>

          {isWorking && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader />
            </div>
          )}

          <Alert
            header={`retries: ${retryCounter} | work state: ${String(isWorking)}`}
            type='info'
          >
            <pre className={clsx('text-sm', baseClasses.preStyled)}>{JSON.stringify(lastResponse, null, 2)}</pre>
          </Alert>

          {isWorking && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader />
            </div>
          )}
        </div>
      )
    default:
      return null
  }
})
