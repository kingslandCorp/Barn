import type { Metadata } from 'next';
import Image from 'next/image';
import { Trophy, Landmark, Music, PartyPopper, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { cardiffEvents, siteConfig, type CardiffEventCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Events in Cardiff',
  description: `Major rugby, concerts, festivals and events in Cardiff over the coming year — a quick guide from ${siteConfig.fullName}.`,
};

const categoryStyles: Record<
  CardiffEventCategory,
  { icon: typeof Trophy; badge: string }
> = {
  'Rugby & Internationals': { icon: Trophy, badge: 'bg-coast/10 text-coast' },
  'Cardiff Castle': { icon: Landmark, badge: 'bg-stone/15 text-ink/80' },
  'Big Events & Concerts': { icon: Music, badge: 'bg-gold/15 text-gold-deep' },
  Festivals: { icon: PartyPopper, badge: 'bg-sage/15 text-sage-dark' },
};

// Original, generic abstract artwork — no real people, teams or branding —
// used only when an event doesn't have one of our own photos attached.
function EventArt({ category }: { category: CardiffEventCategory }) {
  if (category === 'Rugby & Internationals') {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" className="fill-coast" />
        <rect width="400" height="300" className="fill-ink/10" />
        <path d="M0 210 Q200 150 400 210 L400 300 L0 300 Z" className="fill-sage" />
        <path d="M0 215 Q200 158 400 215" className="fill-none stroke-cream/40" strokeWidth="3" />
        {[60, 340].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="70" width="6" height="140" className="fill-ink/30" />
            <circle cx={x} cy="65" r="14" className="fill-gold/70" />
          </g>
        ))}
        <circle cx="200" cy="230" r="10" className="fill-cream/70" />
      </svg>
    );
  }
  if (category === 'Big Events & Concerts') {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" className="fill-ink" />
        <polygon points="30,0 200,230 0,230" className="fill-gold/20" />
        <polygon points="200,0 370,230 170,230" className="fill-gold/25" />
        <polygon points="370,0 400,20 400,230 340,230" className="fill-gold/15" />
        <rect x="60" y="230" width="280" height="30" className="fill-stone/40" />
        {[130, 200, 270].map((x, i) => (
          <circle key={x} cx={x} cy={210 - i * 6} r="4" className="fill-cream/80" />
        ))}
      </svg>
    );
  }
  // Festivals (e.g. Winter Wonderland)
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" className="fill-ink" />
      <circle cx="90" cy="70" r="26" className="fill-cream/90" />
      <circle cx="150" cy="50" r="10" className="fill-cream/60" />
      <circle cx="320" cy="90" r="6" className="fill-cream/70" />
      <circle cx="260" cy="130" r="4" className="fill-cream/50" />
      <g transform="translate(210,175)">
        <circle r="70" className="fill-none stroke-gold/70" strokeWidth="4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={70 * Math.cos(angle)}
              y2={70 * Math.sin(angle)}
              className="stroke-gold/50"
              strokeWidth="2"
            />
          );
        })}
        <circle r="6" className="fill-gold" />
      </g>
      <rect x="0" y="260" width="400" height="40" className="fill-cream/95" />
    </svg>
  );
}

export default function EventsPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
            What's On
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Events in Cardiff
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Rugby internationals, stadium concerts, castle events and city-wide festivals — all
            just a short drive from The Barn. Tap any card to head to the official site for
            tickets and the latest details.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cardiffEvents.map((event, i) => {
            const style = categoryStyles[event.category];
            const Icon = style.icon;
            return (
              <Reveal key={event.name} delay={i * 0.06} className="h-full">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-card transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image.src}
                        alt={event.image.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <EventArt category={event.category} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
                      >
                        <Icon size={14} strokeWidth={1.75} />
                        {event.category}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="text-ink/30 transition-colors group-hover:text-ink/60"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ink">{event.name}</h3>
                    <p className="mt-1 text-sm font-medium text-ink/70">{event.date}</p>
                    <p className="text-xs text-ink/50">{event.venue}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                      {event.description}
                    </p>
                    <p className="mt-4 text-xs font-medium text-coast">Tickets & details →</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-10 text-center text-xs text-ink/45">
            Dates checked at time of writing — recurring annual events in particular can shift, so
            it's worth confirming exact dates on each official site before booking travel around
            them.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
