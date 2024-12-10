import { useState, useCallback, memo } from 'react'
import {
  TBtnUISettings,
} from '~/common/components/sp-custom'
import { Button, ImageGallery } from '~/common/components/sp-custom'
import { TGalleryImage } from '~/common/xstate/stepMachine/services/ui-cfg'

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
