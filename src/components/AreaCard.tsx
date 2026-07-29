import Reveal from './Reveal';
import PhotoPlaceholder from './PhotoPlaceholder';
import type { AreaPlace } from '@/lib/content';

export default function AreaCard({ place, delay = 0 }: { place: AreaPlace; delay?: number }) {
  return (
    <Reveal delay={delay} className="group h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-card">
        <PhotoPlaceholder tone={place.tone} ratio="aspect-[4/3]" />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl text-ink">{place.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{place.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sage-light/50 px-3 py-1 text-xs font-medium text-sage-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
