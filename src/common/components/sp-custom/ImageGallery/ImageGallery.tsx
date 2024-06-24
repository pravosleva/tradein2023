import { useMemo, useState, memo } from 'react'
import Lightbox from 'react-image-lightbox'
import { TGalleryImage } from '~/common/xstate/stepMachine/services/ui-cfg'
import {
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa6'
import { IoMdCloseCircle } from 'react-icons/io'
import classes from './ImageGallery.module.scss'

type TNormalizedItem = {
  src: string;
  original: string;
  title?: string;
  caption?: string;
}
export type TProps = {
  isOpened: boolean;
  items: TGalleryImage[];
  onClose: () => void;
}

export const ImageGallery = memo(({ isOpened, onClose, items } : TProps) => {
  const normalizedItems = useMemo<TNormalizedItem[]>(() => items.map(({ src, title, caption }) => ({
    src,
    original: src,
    title,
    caption,
  })), [items])
  const [index, setIndex] = useState(0);
  const currentImage = normalizedItems[index];
  const nextIndex = (index + 1) % normalizedItems.length;
  const nextImage = normalizedItems[nextIndex] || currentImage;
  const prevIndex = (index + normalizedItems.length - 1) % normalizedItems.length;
  const prevImage = normalizedItems[prevIndex] || currentImage;

  // const handleClick = useCallback((index: number) => setIndex(index), [setIndex]);
  const handleClose = () => {
    setIndex(0)
    onClose()
  }
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  if (normalizedItems.length === 0) return null

  if (!isOpened) return null

  return (
    <div className={classes.wrapper}>
      {!!currentImage && (
        <Lightbox
          mainSrc={currentImage.original}
          imageTitle={currentImage.title}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.original}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.original}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
          imageCaption={currentImage.caption}
          enableZoom={false}
          closeLabel='Закрыть'
          toolbarButtons={[
            <button
              style={{
                border: '2px solid white',
                lineHeight: '24px',
                padding: '4px 8px',
                borderRadius: '10px',
                marginLeft: 'auto',
              }}
              onClick={handleMovePrev}
            >
              <FaArrowLeft />
            </button>,
            <button
              style={{
                border: '2px solid white',
                lineHeight: '24px',
                padding: '4px 8px',
                borderRadius: '10px',
                marginLeft: 'auto',
              }}
              onClick={handleMoveNext}
            >
              <FaArrowRight />
            </button>,
            <button
              style={{
                border: '2px solid #FF0032',
                lineHeight: '24px',
                padding: '4px 8px',
                borderRadius: '10px',
                marginLeft: 'auto',
              }}
              onClick={handleClose}
            >
              <IoMdCloseCircle color='#FF0032' />
            </button>
          ]}
        />
      )}
    </div>
  )
})
