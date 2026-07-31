import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { mapEmbedSrc, what3words, parkingInfo, siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Location',
  description: `Find ${siteConfig.fullName} on the map, plus what3words and parking.`,
};

export default function LocationPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">Location</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Find us
          </h1>
        </Reveal>
      </section>

      {/* Map */}
      <section className="mx-auto mt-10 max-w-content px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Getting Here" title="Find us on the map" />
        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-3xl shadow-card">
          <iframe
            src={mapEmbedSrc}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            title="Map to The Family Barn"
          />
        </Reveal>
      </section>

      {/* What3Words + Parking */}
      <section className="mx-auto mt-12 max-w-content px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="rounded-3xl bg-white/70 p-6 shadow-card">
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">what3words</p>
            <p className="font-display text-2xl text-ink">{what3words.words}</p>
            <a
              href={what3words.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-coast underline"
            >
              Open in what3words →
            </a>
          </Reveal>
          <Reveal delay={0.06} className="rounded-3xl bg-white/70 p-6 shadow-card">
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              {parkingInfo.title}
            </p>
            <p className="text-sm leading-relaxed text-ink/70">{parkingInfo.description}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
