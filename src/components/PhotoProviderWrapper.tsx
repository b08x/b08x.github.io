import React, { useEffect, useState } from 'react';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface PhotoProviderWrapperProps {
  children: React.ReactNode;
}

export const PhotoProviderWrapper: React.FC<PhotoProviderWrapperProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

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
      {children}
    </PhotoProvider>
  );
};

export default PhotoProviderWrapper;
