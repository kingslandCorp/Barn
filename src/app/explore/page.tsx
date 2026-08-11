import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import AreaCard from '@/components/AreaCard';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';
import Image from 'next/image';
import { exploreCategories, dayTrips, siteConfig, type AreaCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Explore The Area',
  description: `A local guide to the Vale of Glamorgan around ${siteConfig.fullName} — coast, food, towns and family days out.`,
};

function CategorySection({
  category,
  index,
  cols = 3,
}: {
  category: AreaCategory;
  index: number;
  cols?: 3 | 4;
}) {
  return (
    <section
      id={category.id}
      className={`mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12 ${
        index % 2 === 1 ? 'bg-white/40 max-w-none' : ''
      }`}
    >
      <div className={index % 2 === 1 ? 'mx-auto max-w-content' : ''}>
        <Reveal>
          <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
            {String(index + 1).padStart(2, '0')} — {category.title}
          </p>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{category.title}</h2>
          <p className="mt-3 max-w-2xl text-base text-ink/65">{category.intro}</p>
        </Reveal>
        <div
          className={`mt-10 grid gap-6 sm:grid-cols-2 ${cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
        >
          {category.places.map((place, pi) => (
            <AreaCard key={place.name} place={place} delay={pi * 0.08} />
          ))}
        </div>
        {category.closingNote && (
          <Reveal delay={0.2}>
            <div className="mt-8 rounded-3xl bg-sand-light/50 px-6 py-5 text-center">
              <p className="font-display text-lg italic text-ink/80">{category.closingNote}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function ExplorePage() {
  const [coast, towns, food] = exploreCategories;

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

      <CategorySection category={coast} index={0} />
      <CategorySection category={towns} index={1} />

      {/* Days Out */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div>
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              03 — Days Out
            </p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Days Out</h2>
            <p className="mt-3 max-w-2xl text-base text-ink/65">
              Just around the corner adventures for everyone in the family
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {dayTrips.map((spot, i) => {
              const cardInner = (
                <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-card transition-transform hover:-translate-y-1">
                  {spot.image ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={spot.image.src}
                        alt={spot.image.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <PhotoPlaceholder tone="sand" ratio="aspect-[4/3]" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg text-ink">{spot.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                      {spot.description}
                    </p>
                    {spot.url && (
                      <p className="mt-3 text-xs font-medium text-coast">Find out more →</p>
                    )}
                  </div>
                </div>
              );

              return (
                <Reveal key={spot.name} delay={i * 0.05} className="h-full">
                  {spot.url ? (
                    <a href={spot.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                      {cardInner}
                    </a>
                  ) : (
                    cardInner
                  )}
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-10 flex justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition-transform hover:-translate-y-0.5"
              >
                Rugby, concerts & castle nights — what's actually on? →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CategorySection category={food} index={3} cols={4} />
    </div>
  );
}
