import { useState, useCallback, memo } from 'react'
import {
  TBtnUISettings,
} from '~/common/components/sp-custom'
// import baseClasses from '~/App.module.scss'
// import clsx from 'clsx'
import { Button, ImageGallery } from '~/common/components/sp-custom'
import { TGalleryImage } from '~/common/xstate/stepMachine/services/ui-cfg/checkByEmployee'

type TProps = {
  label: string;
  btnUI: TBtnUISettings;
  items: TGalleryImage[];
  EnabledStartIcon?: React.ReactNode;
}

export const ButtonWithImageGallery = memo(({
  label,
  btnUI,
  EnabledStartIcon,
  items,
} : TProps) => {
  const [activeGalleryImages, setActiveGalleryOpened] = useState<TGalleryImage[] | null>(null)
  const handleOpenGallery = useCallback((items: TGalleryImage[]) => {
    setActiveGalleryOpened(items)
  }, [])
  const handleClose = useCallback(() => setActiveGalleryOpened(null), [])

  return (
    <>
      <ImageGallery
        isOpened={!!activeGalleryImages}
        items={activeGalleryImages || []}
        onClose={handleClose}
      />

      {/* <div>Селекторы с выбором для типа устройства <code className={baseClasses.inlineCode}>{imeiResponse?.phone.type}</code> {imeiResponse?.phone.vendor}</div> */}
      {/* <Alert
        type='info'
        header='WIP'
      >
        <pre className={clsx('text-sm', baseClasses.preStyled)}>{JSON.stringify(targetOptionsPack, null, 2)}</pre>
      </Alert> */}
      
      <Button
        EnabledStartIcon={EnabledStartIcon}
        color={btnUI.color}
        variant={btnUI.variant}
        onClick={() => {
          handleOpenGallery(items)
        }}
      >
        {label}
      </Button>
    </>
  )
})
