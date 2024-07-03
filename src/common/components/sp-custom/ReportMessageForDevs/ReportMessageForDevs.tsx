import { memo } from 'react'
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

type TProps = {
  isDebugEnabled?: boolean;
}

export const ReportMessageForDevs = memo(({ isDebugEnabled }: TProps) => {
  const devtoolsViSnap = useSnapshot(vi.common.devtools)
  const devtoolsViProxy = useProxy(vi.common.devtools)

  // NOTE:
  // (лимит {devtoolsViProxy.network.__reportsByUserLimit})

  return (
    <>
      {
        !devtoolsViSnap.network.isReportsByUserDisabled
        && !devtoolsViSnap.network.socket.__isConnectionIgnoredForUI
        && devtoolsViSnap.network.socket.__wasThereAFirstConnection
        && devtoolsViSnap.network.__reportsByUserLimit > 0
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
                      <div>Некоторые функции пока не доступны в рамках Вашей сети</div>
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
                        header: 'Опишите, что именно пошло не по сценарию',
                        formSchema: {
                          comment: {
                            type: 'text-multiline',
                            // label: 'Ваш комментарий',
                            descr: 'Пример: На шаге Проверьте устройство кнопка Продолжить не реагирует на действия пользователя',
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
                            nativeRules: {
                              placeholder: 'Ваш комментарий',
                            },
                            isRequired: true,
                            // initValue: vi.contractForm.lastName || undefined,
                          },
                        },
                        onTarget: ({ state }) => {
                          if (isDebugEnabled) groupLog({ namespace: 'PrintActStep -> onTarget exp', items: [state] })
                          wws.sendTheFullHistoryReport({ comment: state.comment, network: devtoolsViProxy.network })
                          devtoolsViProxy.network.__reportsByUserLimit -= 1
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
