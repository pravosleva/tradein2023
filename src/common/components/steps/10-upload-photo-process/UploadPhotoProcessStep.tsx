/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
// import baseClasses from '~/App.module.scss'
import { PollingComponent } from '~/common/components/sp-custom/PollingComponent'
import { httpClient, NSP } from '~/utils/httpClient'
import { Spinner } from '~/common/components/tailwind'
import { useCallback, useState, useMemo } from 'react'
import baseClasses from '~/App.module.scss'
// import { WaitForUploadPhoto } from '~/common/components/sp-custom'

type TProps = {
  tradeinId: number;
  header: string;
  subheader?: string | (string | null | undefined | false)[];
  controls: TControlBtn[];
  onDone: ({ value }: { value: NSP.TPhotoStatusResponse }) => void;
}

export const UploadPhotoProcessStep = ({
  tradeinId,
  header,
  subheader,
  controls,
  onDone,
}: TProps) => {
  const [state, setState] = useState<NSP.TPhotoStatusResponse | null>(null)
  const handleEachResponse = useCallback(({ data }: { data: NSP.TPhotoStatusResponse }) => {
    setState(data)
  }, [])
  const UiStatus= useMemo(() => {
    switch (true) {
      case state?.started:
        return (
          <div className={baseClasses.stack6}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              [ TODO: UI Сотрудник проверяет фото... ]
            </div>
          </div>
        )
      default:
        return (
          <div className={baseClasses.stack6}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* <WaitForUploadPhoto /> */}
              [ TODO: UI ожидания загрузки фото ]
            </div>
          </div>
        )
    }
  }, [state?.started])

  return (
    <ContentWithControls
      header={header}
      subheader={subheader}
      controls={controls}
    >
      {UiStatus}

      <PollingComponent
        // isDebugEnabled
        promise={() => httpClient.checkPhotoState({ tradeinId })}
        resValidator={(data: NSP.TPhotoStatusResponse) => {
          let result = false

          if (data?.ok && !!data?.status) {
            const statusesToDonePolling = ['ok', 'bad_quality', 'fake']
            statusesToDonePolling.forEach((s) => {
              if (data.status === s) result = true
            })
          }

          return result;
        }}
        onEachResponse={handleEachResponse}
        onSuccess={({ data }: { data: NSP.TPhotoStatusResponse }) => {
          onDone({ value: data })
        }}
      />
    </ContentWithControls>
  )
}
