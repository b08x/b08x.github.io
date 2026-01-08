import React, { useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface ImageLightboxProps {
  src: string;
  thumbnail?: string;
  alt?: string;
  gallery?: string;
}

/**
 * ImageLightbox - Single image with lightbox functionality
 * 
 * Replaces jQuery-based Lightbox2 with modern React implementation.
 * Features:
 * - Smooth zoom animations
 * - Touch gestures (pinch-to-zoom, swipe)
 * - Keyboard navigation (arrows, ESC)
 * - Gallery support for multiple images
 * - Theme-aware styling
 * 
 * Usage:
 * - Auto-enhanced from jekyll_picture_tag with data-lightbox="true"
 * - Can be used standalone as island component
 * 
 * @example
 * ```liquid
 * {% picture react-lightbox image.jpg %}
 * ```
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({ 
  src, 
  thumbnail, 
  alt = '',
  gallery = 'default'
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <PhotoProvider
      maskOpacity={0.9}
      speed={() => 300}
      easing={(type) => 
        type === 2 
          ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' 
          : 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
      maskClassName={theme === 'dark' ? 'photo-view-dark' : 'photo-view-light'}
    >
      <PhotoView src={src}>
        <img 
          src={thumbnail || src} 
          alt={alt}
          className="cursor-zoom-in rounded-lg border border-border hover:border-accent transition-all duration-200"
          data-gallery={gallery}
        />
      </PhotoView>
    </PhotoProvider>
  );
};

export default ImageLightbox;
