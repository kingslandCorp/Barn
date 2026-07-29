import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
