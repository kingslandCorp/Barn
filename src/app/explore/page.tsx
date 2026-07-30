import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import AreaCard from '@/components/AreaCard';
import Image from 'next/image';
import { exploreCategories, dayTrips, siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Explore The Area',
  description: `A local guide to the Vale of Glamorgan around ${siteConfig.fullName} — coast, food, towns and family days out.`,
};

export default function ExplorePage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
            Local Guide
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Explore the Vale
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            The Vale of Glamorgan rewards slow exploring — dramatic coastline, proper village
            pubs, and quiet corners most visitors never find. Here are our favourites, grouped by
            what kind of day you're after.
          </p>
        </Reveal>
      </section>

      {exploreCategories.map((category, ci) => (
        <section
          key={category.id}
          id={category.id}
          className={`mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12 ${
            ci % 2 === 1 ? 'bg-white/40 max-w-none' : ''
          }`}
        >
          <div className={ci % 2 === 1 ? 'mx-auto max-w-content' : ''}>
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                {String(ci + 1).padStart(2, '0')} — {category.title}
              </p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">{category.title}</h2>
              <p className="mt-3 max-w-2xl text-base text-ink/65">{category.intro}</p>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.places.map((place, pi) => (
                <AreaCard key={place.name} place={place} delay={pi * 0.08} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Days Out */}
      <section
        className={`mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12 ${
          exploreCategories.length % 2 === 1 ? 'bg-white/40 max-w-none' : ''
        }`}
      >
        <div className={exploreCategories.length % 2 === 1 ? 'mx-auto max-w-content' : ''}>
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              {String(exploreCategories.length + 1).padStart(2, '0')} — Days Out
            </p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Days Out</h2>
            <p className="mt-3 max-w-2xl text-base text-ink/65">
              Just up the road, Wales' capital is an easy add-on to your stay — here are our
              go-to picks.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {dayTrips.map((spot, i) => (
              <Reveal key={spot.name} delay={i * 0.05} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-card">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={spot.image.src}
                      alt={spot.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg text-ink">{spot.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                      {spot.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
