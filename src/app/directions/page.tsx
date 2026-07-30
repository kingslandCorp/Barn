import type { Metadata } from 'next';
import { MapPin, Compass, ParkingCircle, MoonStar } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import Photo from '@/components/Photo';
import {
  arrivalSteps,
  what3words,
  mapEmbedSrc,
  parkingInfo,
  afterDarkInfo,
  sitePhotos,
  siteConfig,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Finding The Barn',
  description: `Arrival instructions, parking and directions for ${siteConfig.fullName}, ${siteConfig.region}.`,
};

export default function DirectionsPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
            Plan Your Stay
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Finding The Barn
          </h1>
          <p className="mt-5 max-w-none text-base leading-relaxed text-ink/70 sm:text-lg">
  Tucked down a quiet private track, The Barn is easy to reach and even easier to
  settle into. Here's everything you need for a smooth arrival.
</p>
        </Reveal>
      </section>

      {/* Map — first */}
      <section className="mx-auto max-w-content px-5 py-10 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Getting Here" title="Find us on the map" />
        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-3xl shadow-card">
          <iframe
            title="Map to The Barn, Vale of Glamorgan"
            src={mapEmbedSrc}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </section>

      {/* What3Words + Parking, side by side */}
      <section className="mx-auto grid max-w-content gap-6 px-5 py-10 sm:px-8 md:grid-cols-2 lg:px-12">
        <Reveal className="rounded-3xl bg-sage/15 p-7 shadow-card">
          <MapPin className="text-sage-dark" size={26} strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-xl text-ink">What3Words</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            The precise entrance to The Barn:
          </p>
          <a
            href={what3words.url}
            className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream"
          >
            {what3words.words}
          </a>
        </Reveal>

        <Reveal delay={0.08} className="rounded-3xl bg-gold/15 p-7 shadow-card">
          <ParkingCircle className="text-gold-deep" size={26} strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-xl text-ink">{parkingInfo.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">{parkingInfo.description}</p>
        </Reveal>
      </section>

      {/* Finding the barn — arrival steps */}
      <section className="mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Arrival" title="Finding the barn" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-6">
            {arrivalSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="flex gap-5 rounded-3xl bg-white/70 p-5 shadow-card sm:p-6">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-coast font-display text-base text-cream">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ink sm:text-xl">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <Photo
              src={sitePhotos.directionsTrack.src}
              alt={sitePhotos.directionsTrack.alt}
              width={sitePhotos.directionsTrack.width}
              height={sitePhotos.directionsTrack.height}
              label="The track in"
            />
          </Reveal>
        </div>
      </section>

      {/* Arriving after dark — text box alongside photo */}
      <section className="mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal className="rounded-3xl bg-coast/10 p-7 shadow-card">
            <MoonStar className="text-coast" size={26} strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-xl text-ink sm:text-2xl">
              {afterDarkInfo.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65 sm:text-base">
              {afterDarkInfo.description}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src={sitePhotos.directionsAfterDark.src}
              alt={sitePhotos.directionsAfterDark.alt}
              width={sitePhotos.directionsAfterDark.width}
              height={sitePhotos.directionsAfterDark.height}
              label="Arriving after dark"
              caption="The outside lights are on the moment you turn onto the track"
              className="max-h-[420px]"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 pt-10 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col items-start gap-4 rounded-3xl bg-ink px-8 py-8 text-cream sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Compass size={22} className="text-gold" />
            <p className="text-sm sm:text-base">
              Still unsure? We're always happy to talk you in.
            </p>
          </div>
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink"
          >
            {siteConfig.email}
          </a>
        </Reveal>
      </section>
    </div>
  );
}
