import clsx from 'clsx'
import classes from './WaitForUploadPhoto.module.scss'
import baseClasses from '~/App.module.scss'

export const WaitForUploadPhoto = () => {
  return (
    <div
      className={clsx(
        baseClasses.stack,
        // classes.redBorder
      )}
    >

      <div className={classes.internalWrapper}>
        <div className={classes.box1}>
          <div className={classes.subboxTop}>

            <div className={classes.flexStartRow}>
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
            <div className={classes.centeredText}>
              <span className={classes.desktopOnly}>
                Введите в браузере своего телефона ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b><br />и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
              </span>
              <span className={classes.mobileOnly}>
                Введите в браузере ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b> и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
              </span>
            </div>

          </div>

          <div className={classes.subboxBottom}>
            <div className={classes.place1}>
              <span className={classes.desktopOnly}>Если вы можете отсканировать QR-код</span>
              <span className={classes.mobileOnly}>Отсканируйте 👉</span>
            </div>
            <button>
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

      <div className={classes.internalWrapper}>
        <div className={classes.box1}>
          <div className={classes.subboxTop}>

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
                Перейдите по прямой ссылке <a href="#" target="_blank">URL</a>
              </span>
              <span className={classes.mobileOnly}>
                Введите в браузере ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b> и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
              </span>
            </div>

          </div>

          <div
            // className={classes.subboxBottom}
          >
            <div className={classes.place1}>
              <span className={classes.desktopOnly}>
                Перейдите по прямой ссылке <a href="#" target="_blank">URL</a>
              </span>
              <span className={classes.mobileOnly}>
                Введите в браузере ссылку <b><code className={baseClasses.inlineCode}>spkx.ru</code></b> и код <b><code className={baseClasses.inlineCode}>tradeinId</code></b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
