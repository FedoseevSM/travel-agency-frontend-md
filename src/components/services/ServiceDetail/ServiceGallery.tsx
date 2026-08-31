import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  React.useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  return (
    <>
      <div className="relative mt-10 mb-10">
        {/* Main Image */}
        <div 
          className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${title} - фото ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                   hover:bg-black/70 transition-colors"
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                   hover:bg-black/70 transition-colors"
          aria-label="Следующее фото"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden ${
                currentImageIndex === index ? 'ring-2 ring-ocean-deep' : ''
              }`}
            >
              <img
                src={image}
                alt={`${title} - миниатюра ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {currentImageIndex === index && (
                <div className="absolute inset-0 bg-ocean-deep/20" />
              )}
            </button>
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-ocean-light transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-ocean-light transition-colors"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <img
            src={images[currentImageIndex]}
            alt={`${title} - фото ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-ocean-light transition-colors"
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};