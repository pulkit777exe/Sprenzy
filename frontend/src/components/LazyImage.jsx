import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const LazyImage = ({ src, alt, className, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48L3N2Zz4=');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    };
  }, [src, fallbackSrc]);

  return (
    <img 
      src={error && fallbackSrc ? fallbackSrc : imageSrc} 
      alt={alt} 
      crossOrigin="anonymous"
      className={`${className} ${!isLoaded ? 'animate-pulse bg-gray-200' : ''}`}
    />
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackSrc: PropTypes.string
};

LazyImage.defaultProps = {
  className: '',
  fallbackSrc: 'https://placehold.co/600x400?text=Image+Not+Available'
}; 