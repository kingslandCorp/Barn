import { ImageIcon } from 'lucide-react';
import type { Tone } from '@/lib/content';

const toneGradients: Record<Tone, string> = {
  coast: 'from-coast via-coast-light to-sand-light',
  sage: 'from-sage-dark via-sage to-sand-light',
  gold: 'from-gold-deep via-gold to-sand-light',
  stone: 'from-stone via-stone-light to-cream-dark',
  sand: 'from-sand via-sand-light to-cream-dark',
};

export default function PhotoPlaceholder({
  tone,
  label,
  caption,
  className = '',
  ratio = 'aspect-[4/5]',
}: {
  tone: Tone;
  label?: string;
  caption?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${toneGradients[tone]} ${ratio} ${className}`}
    >
      <div className="absolute inset-0 texture-grain" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/0 to-ink/0" />
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <ImageIcon size={36} strokeWidth={1.25} className="text-cream" />
      </div>
      {(label || caption) && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {label && <p className="font-display text-lg italic text-cream">{label}</p>}
          {caption && <p className="text-xs text-cream/80">{caption}</p>}
        </div>
      )}
    </div>
  );
}
