/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useCallback, memo, useLayoutEffect } from 'react'
// @ts-ignore
// import __BottomSheet from 'react-animated-bottomsheet'
import classes from './BottomSheet.module.scss'
import clsx from 'clsx'
// import { GiGears } from 'react-icons/gi'
// import { FaGear } from 'react-icons/fa6'
import { FaTools } from 'react-icons/fa'
import baseClasses from '~/App.module.scss'
import { vi } from '~/common/vi'
import { useSnapshot } from 'valtio'
import { CollapsibleBox } from '~/common/components/sp-custom/devtools/CollapsibleBox'
import { getNormalizedDateTime4 } from '~/utils/time-ops'
import { Dialog } from '~/common/components/tailwind'
// import { MdError } from 'react-icons/md'
import {
  // FaCheck,
  // FaCheckCircle,
} from 'react-icons/fa'
// import { FaCheck } from 'react-icons/fa6'
import { IoIosCheckmarkCircleOutline, IoIosCloseCircle, IoIosWarning } from 'react-icons/io'
// import { IoWarningOutline } from 'react-icons/io5'
import { MdTimelapse } from 'react-icons/md'
import { useSearchParams } from '~/common/hooks'
import pkg from '../../../../../../../package.json'
const VITE_GIT_SHA1 = import.meta.env.VITE_GIT_SHA1

export const BottomSheet = memo(() => {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened])
  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])
  const xhrViSnap = useSnapshot(vi.common.devtools.network.xhr)
  const debugViSnap = useSnapshot(vi.common.devtools)
  const isDebugUIEnabled = debugViSnap.isUIEnabled

  const { get } = useSearchParams()
  const shouldDebugUIBeEnabled = get('debug') === '1'

  useLayoutEffect(() => {
    if (shouldDebugUIBeEnabled) vi.enableDebugUI()
  }, [shouldDebugUIBeEnabled])

  return (
    <>
      {
        isDebugUIEnabled && (
          <div
            className={clsx(
              classes.fixedBottomLeftTogglerMobileOnly,
              'backdrop-blur--dark',
              'slide-in-to-right',
            )}
            onClick={handleOpen}
          >
            <FaTools fontSize='2rem' color='#FFF' />
          </div>
        )
      }
      <Dialog
        title={
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{pkg.version}</span>
            <span>GIT SHA1</span>
            <code className={baseClasses.inlineCode}>{VITE_GIT_SHA1}</code>
          </span>
        }
        size='md'
        isOpened={isOpened}
        onClose={handleClose}
        controls={[
          {
            id: '1',
            label: 'Закрыть',
            btn: {
              color: 'primary',
              variant: 'outlined',
            },
            onClick: handleClose,
          },
        ]}
        Body={
          <div
            className={clsx(
              classes.wrapper,
              baseClasses.stack0,
              baseClasses.truncate,
            )}
            style={{
              width: '100%',
              // border: '1px solid red',
              // maxHeight: '305px',
              // overflowY: 'auto',
              fontWeight: 'bold',
            }}
          >
            <CollapsibleBox
              title='common.devtools.network.xhr'
              level={1}
            >
              {
                Object.keys(xhrViSnap).map((key) => (
                  <CollapsibleBox
                    title={key}
                    key={key}
                    level={2}
                  >
                    {
                      key === 'total' ? (
                        <pre
                          className={clsx(baseClasses.preStyled, 'bg-spBlueMain', 'text-xs')}
                          style={{
                            padding: '8px',
                            // maxHeight: '305px',
                            // overflowY: 'auto',
                            // backgroundColor: 'gray',
                            color: '#FFF',
                            overflowY: 'hidden',
                            fontWeight: 'bold',
                          }}
                        >
                          {/* @ts-ignore */}
                          {JSON.stringify(xhrViSnap[key], null, 2)}
                        </pre>
                      ) :
                      // @ts-ignore
                      Object.keys(xhrViSnap[key]).map((url) => {
                        // @ts-ignore
                        const isOk = key === 'state' && Object.keys(xhrViSnap[key][url]).every((tsstr) => xhrViSnap[key]?.[url]?.[tsstr]?.__details?.res?.ok === true)
                        const hasPending = key === 'state' && Object.keys(xhrViSnap[key][url]).some((tsstr) => xhrViSnap[key]?.[url]?.[tsstr]?.code === 'pending')

                        let hasLastErrored = false
                        if (key === 'state') {
                          const lastTs = Object.keys(xhrViSnap[key]?.[url]).reduce((acc, cur) => {
                            const ts = Number(cur)
                            if (ts > acc) acc = ts
                            return acc
                          }, 0)
                          hasLastErrored = !xhrViSnap[key]?.[url]?.[String(lastTs)].__details?.res.ok
                        }
                        // IoIosWarning
                        const hasErrored = !isOk
                        return (
                          <CollapsibleBox
                            title={url}
                            key={url}
                            level={3}
                            StartIcon={
                            hasPending
                            ? <MdTimelapse />
                            : hasLastErrored
                              ? <IoIosCloseCircle color='red' />
                              : hasErrored
                                ? <IoIosWarning color='yellow' />
                                : <IoIosCheckmarkCircleOutline />
                            // : !isOk
                            //   ? <IoIosCloseCircleOutline color='red' />
                            //   : <IoIosCheckmarkCircleOutline />
                            }
                          >
                            {
                              // @ts-ignore
                              Object.keys(xhrViSnap[key][url]).map((tsstr) => (
                                <CollapsibleBox
                                  title={getNormalizedDateTime4(Number(tsstr))}
                                  key={tsstr}
                                  level={4}
                                  StartIcon={
                                    key === 'state'
                                    ? xhrViSnap[key]?.[url]?.[tsstr]?.code === 'pending'
                                      ? <MdTimelapse />
                                      : xhrViSnap[key]?.[url]?.[tsstr]?.__details?.res?.ok === true
                                        ? <IoIosCheckmarkCircleOutline />
                                        : <IoIosCloseCircle color='red' />
                                    : undefined
                                  }
                                >
                                  <pre
                                    className={clsx(
                                      baseClasses.preStyled,
                                      {
                                        // @ts-ignore
                                        'bg-spBlueMain': xhrViSnap[key]?.[url]?.[tsstr]?.__details?.res?.ok === true,
                                        // @ts-ignore
                                        'bg-spRed': xhrViSnap[key]?.[url]?.[tsstr]?.__details?.res?.ok !== true,
                                      },
                                      'text-xs',
                                    )}
                                    style={{
                                      padding: '8px',
                                      // maxHeight: '305px',
                                      // overflowY: 'auto',
                                      // backgroundColor: 'gray',
                                      color: '#FFF',
                                      overflowY: 'hidden',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {/* @ts-ignore */}
                                    {JSON.stringify(xhrViSnap[key][url][tsstr], null, 2)}
                                  </pre>
                                </CollapsibleBox>
                              ))
                            }
                          </CollapsibleBox>
                        )
                      })
                    }
                  </CollapsibleBox>
                ))
              }
            </CollapsibleBox>
          </div>
        }
      />
      {/* @ts-ignore */}
      {/* <__BottomSheet
        isBottomSheetVisible={isOpened}
        closeBottomSheet={handleClose}
      >
        
      </__BottomSheet> */}
    </>
  )
})
