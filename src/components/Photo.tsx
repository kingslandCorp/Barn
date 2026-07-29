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
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-stone/20 ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
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
