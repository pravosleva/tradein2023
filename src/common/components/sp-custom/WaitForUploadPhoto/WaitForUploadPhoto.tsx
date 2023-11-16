import { useState, useCallback } from 'react'
import clsx from 'clsx'
import classes from './WaitForUploadPhoto.module.scss'
import baseClasses from '~/App.module.scss'
import { Dialog } from '~/common/components/tailwind'
import { NSP } from '~/utils/httpClient'

type TProps = {
  photoLinkResponse: NSP.TPhotoLinkResponse | null;
}

export const WaitForUploadPhoto = ({ photoLinkResponse }: TProps) => {
  const [isQrModalOpened, setIsQrModalOpened] = useState<boolean>(false)
  const handleOpenModal = useCallback(() => {
    setIsQrModalOpened(true)
  }, [setIsQrModalOpened])
  const handleCloseModal = useCallback(() => {
    setIsQrModalOpened(false)
  }, [setIsQrModalOpened])

  return (
    <>
      <div
        className={clsx(
          baseClasses.stack,
          // classes.redBorder
        )}
        style={{ width: '100%' }}
      >
        <div className={classes.internalWrapper}>
          <div className={clsx(classes.box1, 'drop-shadow-xl')}>
            <div className={classes.subboxTop}>

              <div
                className={classes.flexStartRow}
                // NOTE: tmp 2/2
                style={{ marginBottom: '0px' }}
              >
                <img
                  src='/static3/img/samples/sample-phone.svg'
                  alt='img'
                  style={{ height: '50px', width: '50px', objectFit: 'contain' }}
                />
                <div className={classes.boxHeader}>
                  <span className={classes.desktopOnly}>Если Вы загружаете фото со своего телефона</span>
                  <span className={classes.mobileOnly}>Если загружаете с телефона</span>
                </div>
              </div>
              {/* NOTE: tmp 1/2 */}
              {/* <div className={classes.centeredText}>
                <span className={classes.desktopOnly}>
                  Введите в браузере своего телефона ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b><br />и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
                </span>
                <span className={classes.mobileOnly}>
                  Введите в браузере ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b> и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
                </span>
              </div> */}

            </div>

            <div className={classes.subboxBottom}>
              <div className={classes.place1}>
                <span className={classes.desktopOnly}>Если вы можете отсканировать QR-код</span>
                <span className={classes.mobileOnly}>Отсканируйте 👉</span>
              </div>
              <button onClick={handleOpenModal}>
                <img
                  src='/static3/img/samples/sample-qr.svg'
                  alt='img'
                />
                <span className={classes.desktopOnly}>Показать QR код</span>
                <span className={classes.mobileOnly}>QR код</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={classes.internalWrapper}
        >
          <div className={clsx(classes.box1, 'drop-shadow-xl')}>
            <div className={clsx(classes.subboxTop, classes.borderRounded)}>

              <div className={classes.flexStartRow}>
                <img
                  src='/static3/img/samples/sample-computer.svg'
                  alt='img'
                  style={{ height: '50px', width: '50px', objectFit: 'contain' }}
                />
                <div className={classes.boxHeader}>
                  <span className={classes.desktopOnly}>Если вы загружаете фото с компьютера</span>
                  <span className={classes.mobileOnly}>Если загружаете с компьютера</span>
                </div>
              </div>
              <div className={classes.centeredText}>
                <span className={classes.desktopOnly}>
                  Перейдите по <a href={photoLinkResponse?.qr_url} className={clsx(baseClasses.link, 'text-spBlueMain')} target="_blank">прямой ссылке</a>
                </span>
                <span className={classes.mobileOnly}>
                  Перейдите по <a href={photoLinkResponse?.qr_url} className={clsx(baseClasses.link, 'text-spBlueMain')} target="_blank">прямой ссылке</a>
                </span>
              </div>

            </div>

            {/* <div
              // className={classes.subboxBottom}
            >
              <div className={classes.place1}>
                <span className={classes.desktopOnly}>
                  Перейдите по прямой ссылке <a href="#" className={baseClasses.link} target="_blank">URL</a>
                </span>
                <span className={classes.mobileOnly}>
                  Введите в браузере ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b> и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
                </span>
              </div>
            </div> */}
          </div>
        </div>

        <Dialog
          title='Отсканируйте QR'
          size='md'
          isOpened={isQrModalOpened}
          onClose={handleCloseModal}
          controls={[
            {
              id: '1',
              label: 'Закрыть',
              btn: {
                color: 'primary',
                variant: 'outlined',
              },
              onClick: () => {
                handleCloseModal()
              },
            },
          ]}
          Body={
            photoLinkResponse?.qr ? (
              <img
                src={`data:image/png;base64,${photoLinkResponse?.qr}`}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  maxWidth: '100%',
                }}
              />
            ) : (
              <div className={baseClasses.stack}>
                <div>Ссылка на qr не получена</div>
                <pre className={baseClasses.preStyled}>{JSON.stringify({ photoLinkResponse }, null, 2)}</pre>
              </div>
            )
          }
        />
      </div>
    </>
  )
}
