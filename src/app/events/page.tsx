import type { Metadata } from 'next';
import { Trophy, Landmark, Music, PartyPopper, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { cardiffEvents, siteConfig, type CardiffEventCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Events in Cardiff',
  description: `Major rugby, concerts, festivals and events in Cardiff over the coming year — a quick guide from ${siteConfig.fullName}.`,
};

const categoryStyles: Record<
  CardiffEventCategory,
  { icon: typeof Trophy; badge: string; iconColor: string }
> = {
  'Rugby & Internationals': {
    icon: Trophy,
    badge: 'bg-coast/10 text-coast',
    iconColor: 'text-coast',
  },
  'Cardiff Castle': {
    icon: Landmark,
    badge: 'bg-stone/15 text-ink/80',
    iconColor: 'text-ink/70',
  },
  'Big Events & Concerts': {
    icon: Music,
    badge: 'bg-gold/15 text-gold-deep',
    iconColor: 'text-gold-deep',
  },
  Festivals: {
    icon: PartyPopper,
    badge: 'bg-sage/15 text-sage-dark',
    iconColor: 'text-sage-dark',
  },
};

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
                  className="group flex h-full flex-col rounded-3xl bg-white/70 p-6 shadow-card transition-transform hover:-translate-y-1"
                >
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
                  <p className="mt-4 text-xs font-medium text-coast">
                    Tickets & details →
                  </p>
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
