import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Photo from '@/components/Photo';
import { siteConfig, poolPhotos } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Pool & Wellness',
  description: `The heated outdoor pool at ${siteConfig.fullName}, plus a nearby way to properly unwind.`,
};

export default function PoolWellnessPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">Unwind</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Pool &amp; Wellness
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            A stay here is already a chance to slow down. Between a swim in the pool and a
            treatment just down the road in Cowbridge, it's easy to make it properly restful.
          </p>
        </Reveal>
      </section>

      {/* Wellness — Vale Reflexology */}
      <section className="mx-auto mt-4 max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              01 — Wellness
            </p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Why not book a treatment while you're here?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
              Right here in the Vale of Glamorgan, in nearby Cowbridge, Kim Davis offers holistic
              duopody reflexology — a gentle, whole-body treatment worked through both feet
              together. It's the kind of thing that pairs perfectly with a slow countryside
              weekend: guests use it to ease stress, ease into better sleep, or simply carve out
              an hour that's entirely their own. Appointments run Monday to Friday, and a free
              15-minute discovery call is the easiest way to see if it's for you.
            </p>
            <a
              href="https://www.valereflexology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-coast underline underline-offset-2 hover:text-coast-dark"
            >
              Visit Vale Reflexology
              <ArrowUpRight size={14} />
            </a>
            <div className="mt-7">
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              >
                Check availability for your stay →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src="/images/bathsoap.avif"
              alt="A little luxury waiting in the bathroom at The Barn"
              width={1200}
              height={900}
              className="max-h-[420px]"
            />
          </Reveal>
        </div>
      </section>

      {/* Pool */}
      <section className="bg-white/40">
        <div className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal className="md:order-2">
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">02 — Pool</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                The heated outdoor pool
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
                Warm water waiting for you, whatever the Welsh weather decides to do. It's a
                proper 14' x 28' pool — plenty of room for real laps, not just a paddle — ringed
                by fields with nothing but birdsong for company. Heated and ready whenever you
                are, morning swim or last thing before bed.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="md:order-1">
              <Photo
                src={poolPhotos.main.src}
                alt={poolPhotos.main.alt}
                width={poolPhotos.main.width}
                height={poolPhotos.main.height}
                className="max-h-[340px]"
              />
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-8 grid grid-cols-2 gap-6">
            {poolPhotos.minor.map((photo) => (
              <Photo
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="max-h-[280px]"
              />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
