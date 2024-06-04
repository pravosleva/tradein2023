/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
// import baseClasses from '~/App.module.scss'
import { PollingComponent } from '~/common/components/sp-custom/PollingComponent'
import { httpClient, NSP } from '~/utils/httpClient'
// import { Spinner } from '~/common/components/tailwind'
import { useCallback, useMemo, memo, useState } from 'react'
import baseClasses from '~/App.module.scss'
import { Loader, WaitForUploadPhoto } from '~/common/components/sp-custom'

type TProps = {
  tradeinId: number;
  header: string;
  subheader?: string | (string | null | undefined | false)[];
  controls: TControlBtn[];
  onDone: ({ value }: { value: NSP.TPhotoStatusResponse }) => void;
  photoLinkResponse: NSP.TPhotoLinkResponse | null;
}

export const UploadPhotoProcessStep = memo(({
  tradeinId,
  header: initHeader,
  subheader: initSubheader,
  controls,
  onDone,
  photoLinkResponse,
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
              <Loader />
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              [ TODO: UI Сотрудник проверяет фото... ]
            </div> */}
          </div>
        )
      default:
        return (
          <div className={baseClasses.stack6}>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader />
            </div> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <WaitForUploadPhoto photoLinkResponse={photoLinkResponse} />
            </div>
          </div>
        )
    }
  }, [state?.started, photoLinkResponse])

  // -- NOTE: !state?.started -> Фото не загружены -> Проверка устройства не начата
  const header = useMemo(() => {
    return !state?.started ? initHeader : 'Подождите...'
  }, [state?.started, initHeader])
  const subheader = useMemo(() => {
    return !state?.started ? initSubheader : 'Сотрудник проверяет фото'
  }, [state?.started, initSubheader])
  // --

  return (
    <ContentWithControls
      header={header}
      subheader={subheader}
      controls={controls}
      isStickyBottomControls
    >
      {UiStatus}
      <PollingComponent
        // isDebugEnabled
        promise={() => httpClient.checkPhotoState({ tradeinId })}
        resValidator={(data: NSP.TPhotoStatusResponse) => {
          let result = false
          if (data?.ok && !!data?.status) {
            const statusesForDonePolling = ['ok', 'bad_quality', 'fake']
            for (const s of statusesForDonePolling) if (data.status === s) result = true
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
})
