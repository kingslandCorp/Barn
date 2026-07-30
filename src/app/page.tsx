import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import IconCard from '@/components/IconCard';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';
import { stayHighlights, galleryItems, viewPhotos, sitePhotos, siteConfig } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* A Warm Welcome */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <SectionHeading
            eyebrow="A Warm Welcome"
            title="Somewhere to properly switch off"
            subtitle="There's a particular kind of quiet that settles over the Vale of Glamorgan in summer — long evenings, warm stone, and a sky that turns gold long before it thinks about getting dark. The Barn was made for exactly that: mornings by the pool, afternoons on the coast, and evenings that ask nothing of you at all."
          />
          <Reveal delay={0.1} className="relative">
            <Photo
              src={sitePhotos.warmWelcome.src}
              alt={sitePhotos.warmWelcome.alt}
              width={sitePhotos.warmWelcome.width}
              height={sitePhotos.warmWelcome.height}
              label={sitePhotos.warmWelcome.label}
              className="max-h-[460px]"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-cream to-transparent md:block" />
          </Reveal>
        </div>
      </section>

      {/* Stay Highlights */}
      <section className="bg-white/50 py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Stay Highlights"
            title="Everything you need, nothing you don't"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stayHighlights.map((item, i) => (
              <IconCard key={item.title} delay={i * 0.06} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <SectionHeading eyebrow="Gallery" title="A closer look inside" />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05} className={item.span ? 'col-span-2' : ''}>
              <Photo
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                label={item.label}
                caption={item.caption}
              />
            </Reveal>
          ))}
        </div>
      </section>

{/* The Views */}
      <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHeading eyebrow="The Views" title="Right outside the door" />
        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {viewPhotos.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05} className={item.span ? 'col-span-2' : ''}>
              <Photo
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                label={item.label}
                caption={item.caption}
              />
            </Reveal>
          ))}
        </div>
      </section>
      
      {/* Discover the Vale */}
      <section className="bg-coast py-20 text-cream sm:py-28">
        <div className="mx-auto grid max-w-content gap-12 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
          <Reveal>
            <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-light">
              Discover the Vale
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Beyond the Barn, a whole coastline is waiting
            </h2>
           <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
              Dramatic cliffs, surf beaches, sleepy market towns, cosy pubs and some of the best
              sunsets in Wales — the Vale of Glamorgan rewards guests who venture just a little
              further than the garden gate.
            </p>
            <Link
              href="/explore"
              className="mt-8 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Explore The Area
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src={sitePhotos.discoverTheVale.src}
              alt={sitePhotos.discoverTheVale.alt}
              width={sitePhotos.discoverTheVale.width}
              height={sitePhotos.discoverTheVale.height}
              label={sitePhotos.discoverTheVale.label}
            />
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-content px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-12">
        <Reveal>
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            Already booked? Find house and pool guidance in the Guests section, or reach us
            directly at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
