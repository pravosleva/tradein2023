import { useMemo, useState, memo, useCallback } from 'react'
import Lightbox from 'react-image-lightbox'
import { TGalleryImage } from '~/common/xstate/stepMachine/services/ui-cfg/checkByEmployee'
import {
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa6'
import { IoMdCloseCircle } from 'react-icons/io'
import classes from './ImageGalleryAsGrid.module.scss'

type TNormalizedItem = {
  src: string;
  original: string;
  title?: string;
  caption?: string;
}
type TProps = {
  items: TGalleryImage[];
}

export const ImageGalleryAsGrid = memo(({ items } : TProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const _handleClose = useCallback(() => {
    setIsOpened(false)
  }, [])
  const _handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [])
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

  const handleClick = useCallback((index: number) => () => {
    setIndex(index)
    _handleOpen()
  }, [setIndex, _handleOpen]);
  const handleClose = () => {
    setIndex(0)
    _handleClose()
  }
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  if (normalizedItems.length === 0) return null

  return (
    <>
      <div className={classes.grid}>
        {
          normalizedItems.map((item, i) => (
            <img
              key={item.src}
              alt={item.title}
              src={item.src}
              onClick={handleClick(i)}
            />
          ))
        }
      </div>
      <div className={classes.wrapper}>
        {isOpened && (
          <Lightbox
            mainSrc={currentImage.original}
            imageTitle={currentImage.title}
            mainSrcThumbnail={currentImage.src}
            nextSrc={nextImage.original}
            nextSrcThumbnail={nextImage.src}
            prevSrc={prevImage.original}
            prevSrcThumbnail={prevImage.src}
            onCloseRequest={_handleClose}
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
    </>
  )
})
