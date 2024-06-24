import { useInView } from 'react-intersection-observer'

const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL || ''

type TProps = {
  src: string;
  alt: string;
  onClickHandler: () => void;
}

export const Image = ({ src, alt, onClickHandler }: TProps) => {
  const {
    ref,
    inView,
    // entry,
  } = useInView({
    /* Optional options */
    threshold: 0,
  })

  return (
    <>
      <img
        ref={ref}
        src={inView ? src : `${PUBLIC_URL}/static3/img/loaders/3-dots-scale.svg`}
        alt={alt}
        onClick={onClickHandler}
      />
    </>
  )
}
