'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export type LightboxPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  caption?: string;
};

type Props = {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;
  const photo = isOpen ? photos[index] : null;

  // eslint-disable-next-line no-console
  console.log('[lightbox debug] Lightbox rendered — index prop:', index, '/ isOpen:', isOpen, '/ photo found:', Boolean(photo));

  const goNext = () => {
    if (index === null) return;
    onIndexChange((index + 1) % photos.length);
  };
  const goPrev = () => {
    if (index === null) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  if (!isOpen || !photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 50) goPrev();
        else if (delta < -50) goNext();
        touchStartX.current = null;
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
      >
        <X size={20} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[85vh] max-w-[92vw] flex-col items-center sm:max-h-[88vh] sm:max-w-[85vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative max-h-[75vh] max-w-full overflow-hidden rounded-2xl sm:max-h-[80vh]"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="92vw"
            className="h-full max-h-[75vh] w-auto object-contain sm:max-h-[80vh]"
            priority
          />
        </div>

        {(photo.label || photo.caption) && (
          <div className="mt-3 text-center">
            {photo.label && <p className="font-display text-base italic text-cream">{photo.label}</p>}
            {photo.caption && <p className="mt-0.5 text-xs text-cream/70">{photo.caption}</p>}
          </div>
        )}

        {photos.length > 1 && (
          <p className="mt-2 text-xs text-cream/50">
            {index + 1} / {photos.length}
          </p>
        )}
      </div>
    </div>
  );
}
