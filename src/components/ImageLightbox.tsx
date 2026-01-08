import { PhotoView } from 'react-photo-view';
import { createPortal } from 'react-dom';

interface ImageLightboxProps {
  src: string;
  thumbnail?: string;
  alt?: string;
  gallery?: string;
  container?: HTMLElement;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  src,
  thumbnail,
  alt = '',
  container
}) => {
  const content = (
    <PhotoView src={src}>
      <img
        src={thumbnail || src}
        alt={alt}
        className="cursor-zoom-in rounded-lg border border-border hover:border-accent transition-all duration-200"
      />
    </PhotoView>
  );

  if (container) {
    return createPortal(content, container);
  }

  return content;
};

export default ImageLightbox;
