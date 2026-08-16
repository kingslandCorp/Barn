import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Photo from '@/components/Photo';
import { siteConfig, poolPhotos, reflexologyWhatsAppUrl } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Pool & Wellness',
  description: `The heated outdoor pool at ${siteConfig.fullName}, plus an in-stay reflexology treatment from Kim.`,
};

export default function PoolWellnessPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">Unwind</p>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
            Pool &amp; Wellness
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
            A stay here is already a chance to slow down. Between a swim in the pool and a
            reflexology treatment without ever leaving the property, it's easy to make it
            properly restful.
          </p>
        </Reveal>
      </section>

      {/* Pool */}
      <section className="mx-auto mt-4 max-w-content px-5 py-7 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal className="md:order-2">
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">01 — Pool</p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              The heated outdoor pool
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
              Warm water waiting for you, whatever the Welsh weather decides to do. It's a proper
              14' x 28' pool — plenty of room for real laps, not just a paddle — ringed by fields
              with nothing but birdsong for company. Heated and ready whenever you are, morning
              swim or last thing before bed.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:order-1">
            <Photo
              src={poolPhotos.main.src}
              alt={poolPhotos.main.alt}
              width={poolPhotos.main.width}
              height={poolPhotos.main.height}
              className="max-h-[380px]"
            />
          </Reveal>
        </div>

        {/* Both forced to a shared 4:3 box (not each photo's native ratio) so the pair
            renders at matching height, and stepped down from the 380px hero above. */}
        <Reveal delay={0.15} className="mt-8 grid grid-cols-2 gap-6">
          {poolPhotos.minor.map((photo) => (
            <Photo
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={4}
              height={3}
              className="max-h-[300px]"
            />
          ))}
        </Reveal>
      </section>

      {/* Wellness — reflexology with Kim */}
      <section className="bg-white/40">
        <div className="mx-auto max-w-content px-5 py-7 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                02 — Wellness
              </p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                Why not book a treatment while you're here?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
                Kim, who looks after The Barn, is also a qualified duopody reflexologist —
                treating both feet together in one gentle, whole-body session. Guests staying
                here can arrange a treatment without leaving the property: just message Kim
                directly and she'll find a time that works around your stay. It's the kind of
                thing that pairs perfectly with a slow countryside weekend — easing stress,
                easing into better sleep, or simply carving out an hour that's entirely your own.
              </p>
              <a
                href="https://www.valereflexology.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-coast underline underline-offset-2 hover:text-coast-dark"
              >
                More about Kim's reflexology practice
                <ArrowUpRight size={14} />
              </a>
              <div className="mt-7 flex max-w-xl justify-end">
                <a
                  href={reflexologyWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-medium text-cream transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} />
                  Ask Kim on WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Photo
                src="/images/feet-treatment.jpg"
                alt="A reflexology treatment, both feet worked together"
                width={1400}
                height={933}
                className="max-h-[380px]"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
