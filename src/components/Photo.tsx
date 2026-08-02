import Image from 'next/image';

export default function Photo({
  src,
  alt,
  width,
  height,
  label,
  caption,
  className = '',
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  onClick,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
}) {
  const clickable = Boolean(onClick);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-stone/20 ${
        clickable ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `View ${label || alt} full size` : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${
          clickable ? 'transition-transform duration-500 group-hover:scale-105' : ''
        }`}
      />
      {(label || caption) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {label && <p className="font-display text-lg italic text-cream">{label}</p>}
            {caption && <p className="text-xs text-cream/80">{caption}</p>}
          </div>
        </>
      )}
    </div>
  );
}
