import type { Metadata } from 'next';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import Photo from '@/components/Photo';
import BookingEnquiry from '@/components/BookingEnquiry';
import {
  mapEmbedSrc,
  what3words,
  parkingInfo,
  arrivalSteps,
  afterDarkInfo,
  sitePhotos,
  siteConfig,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Directions & Booking',
  description: `Check availability and find your way to ${siteConfig.fullName}.`,
};

export default function DirectionsPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
            Book Your Stay
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Check your dates
          </h1>
          <p className="mt-5 max-w-none text-base leading-relaxed text-ink/70 sm:text-lg">
            Tucked down a quiet private track, The Barn is easy to reach and even easier to
            settle into. Pick your dates below and send us an enquiry — we'll come straight back
            to you with availability.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <BookingEnquiry />
        </Reveal>
      </section>

      {/* Map */}
      <section className="mx-auto mt-16 max-w-content px-5 sm:px-8 lg:px-12">
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

      {/* Finding the barn */}
      <section className="mx-auto mt-16 max-w-content px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Arrival" title="Finding the barn" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrivalSteps.map((step) => (
            <Reveal key={step.step} delay={step.step * 0.06} className="rounded-3xl bg-white/70 p-6 shadow-card">
              <p className="font-display text-3xl text-gold-deep">{String(step.step).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Arriving after dark */}
      <section className="mx-auto mt-16 max-w-content px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              {afterDarkInfo.title}
            </p>
            <p className="text-base leading-relaxed text-ink/70">{afterDarkInfo.description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src={sitePhotos.directionsAfterDark.src}
              alt={sitePhotos.directionsAfterDark.alt}
              width={sitePhotos.directionsAfterDark.width}
              height={sitePhotos.directionsAfterDark.height}
            />
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto mt-16 max-w-content px-5 text-center sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">See you soon.</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            Questions before you arrive? Reach us at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </div>
  );
}
