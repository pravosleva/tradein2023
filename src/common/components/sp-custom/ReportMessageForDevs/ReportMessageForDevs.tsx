import { memo, useCallback } from 'react'
import baseClasses from '~/App.module.scss'
import { vi } from '~/common/vi/vi'
import { useSnapshot } from 'valtio'
import { useProxy } from 'valtio/utils'
import { Alert, ButtonWidthFormInModal, TValiateResult } from '~/common/components/sp-custom'
import { groupLog } from '~/utils'
import { BsEnvelopeExclamation } from 'react-icons/bs'
// import { TbFilePower } from 'react-icons/tb'
// import { MdOutlineQuickreply } from 'react-icons/md'
// import { MdQuickreply } from 'react-icons/md'
// import { TbMailBolt } from 'react-icons/tb'
import { MdOutlineWifiOff } from 'react-icons/md'
import { wws } from '~/utils/wws/wws'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
} from 'notistack'

type TProps = {
  isDebugEnabled?: boolean;
}

export const ReportMessageForDevs = memo(({ isDebugEnabled }: TProps) => {
  const devtoolsViSnap = useSnapshot(vi.common.devtools)
  const devtoolsViProxy = useProxy(vi.common.devtools)

  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [enqueueSnackbar])
  const showError = useCallback(({ message }: { message: string }) => {
    if (isDebugEnabled) showNotif(message || 'No message', { variant: 'error' })
  }, [showNotif, isDebugEnabled])
  const showSuccess = useCallback(({ message }: { message: string }) => {
    if (isDebugEnabled) showNotif(message || 'No message', { variant: 'default' })
  }, [showNotif, isDebugEnabled])

  return (
    <>
      {
        !devtoolsViProxy.network.socket.__isConnectionIgnoredForUI
        && devtoolsViSnap.network.__reportsLimit > 0
        && (
          <>
            <Alert type='warning'>
              <div className={baseClasses.stack1}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {
                    devtoolsViSnap.network.socket.isConnected ? (
                      <div>Вы можете сообщить нам о нестандартном поведении Web приложения, если заметили что-то подобное</div>
                    ) : (
                      <div>Некоторые функции пока не доступны в Вашей сети</div>
                    )
                  }
                </div>
                <div
                  // style={{
                  //   marginLeft: 'auto',
                  // }}
                  // className={baseClasses.truncate}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <BsEnvelopeExclamation
                      style={{
                        width: '50px',
                        height: '40px',
                        alignSelf: 'flex-start',
                      }}
                    />
                    <ButtonWidthFormInModal
                      // isDebugEnabled
                      controlBtn={{
                        // id: 'toggler-exp',
                        label: devtoolsViSnap.network.socket.isConnected ? 'Сообщить об ошибке' : 'Похоже, не в этот раз',
                        btn: {
                          color: 'black',
                          variant: 'filled',
                        },
                        // EnabledEndIcon?: React.ReactNode;
                        // allowDefaultEnabledEndIconArrowRight?: boolean;
                        // allowDefaultEnabledEndIconCheck?: boolean;
                        // EnabledStartIcon: <TbMailBolt />,
                        isDisabled: !devtoolsViSnap.network.socket.isConnected,
                        DisabledStartIcon: <MdOutlineWifiOff />,
                      }}
                      closeBtn={{
                        label: 'Закрыть',
                        btn: {
                          color: 'primary',
                          variant: 'outlined',
                        },
                      }}
                      submitBtn={{
                        label: devtoolsViSnap.network.socket.isConnected ? 'Отправить' : 'Похоже, не в этот раз',
                        btn: {
                          color: 'primary',
                          variant: 'filled',
                        },
                        isDisabled: !devtoolsViSnap.network.socket.isConnected,
                        DisabledStartIcon: <MdOutlineWifiOff />,
                      }}
                      modal={{
                        header: 'Опишите коротко, что именно пошло не по сценарию',
                        formSchema: {
                          comment: {
                            type: 'text-multiline',
                            label: 'Ваш комментарий',
                            // descr: 'Опишите коротко, что именно пошло не по сценарию',
                            limit: 200,
                            validate: ({ value, cfg }) => {
                              const limit = cfg?.limit
                              const res: TValiateResult = { ok: true }
                              switch (true) {
                                case value.length < 3:
                                  res.ok = false
                                  res.reason = 'Слишком короткое поле'
                                  break
                                case value.length >= (limit || 100):
                                  res.ok = false
                                  res.reason = 'Слишком длинное поле'
                                  break
                                default:
                                  break
                              }
                              return res
                            },
                            isRequired: true,
                            // initValue: vi.contractForm.lastName || undefined,
                          },
                        },
                        onTarget: async ({ state }) => {
                          if (isDebugEnabled) groupLog({ namespace: 'PrintActStep -> onTarget exp', items: [state] })
                          await wws.sendTheFullHistoryReport({ comment: state.comment, network: devtoolsViProxy.network })
                            .then(({ ok, message }) => {
                              if (ok) showSuccess({ message: message || 'Ok' })
                              else showError({ message: message || 'Not Ok' })
                            })
                            .catch((err) => {
                              showError({ message: err.message || 'ERR' })
                            })
                          devtoolsViProxy.network.__reportsLimit -= 1
                          return Promise.resolve({ ok: true })
                        },
                        onError: ({ message }) => {
                          if (isDebugEnabled) groupLog({ namespace: 'PrintActStep -> onError exp', items: [message] })
                        },
                      }}
                    />
                  </div>
                  
                </div>
              </div>
            </Alert>  
          </>
        )
      }
    </>
  )
})
