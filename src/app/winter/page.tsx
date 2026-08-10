import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Photo from '@/components/Photo';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'The Barn at Winter',
  description: `Fire lit, curtains drawn, the whole family in one room — a cosy winter stay at ${siteConfig.fullName}.`,
};

export default function WinterPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">Seasonal</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            The Barn at Winter
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Somewhere else, winter means shorter days and staying in. Here, it means the wood
            burner lit by four o'clock, the whole family under one roof, and nowhere else anyone
            needs to be.
          </p>
        </Reveal>
      </section>

      {/* Snuggled in */}
      <section className="mx-auto mt-4 max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">01 — Cosy</p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Snuggled in for the night</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
              Long, dark evenings are what the wood burner and the deep sofas were built for.
              Board games out on the table, a film on, someone always putting another log on the
              fire — it's the kind of night that doesn't need planning, just time.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src="/images/fireplace.jpg"
              alt="The wood burner, lit, with a basket of logs beside it"
              width={1071}
              height={1428}
              className="max-h-[420px]"
            />
          </Reveal>
        </div>
      </section>

      {/* Christmas, together */}
      <section className="bg-white/40">
        <div className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal className="md:order-2">
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                02 — Family
              </p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                Christmas, all together
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
                The kitchen and living space open right up, so nobody's stuck cooking alone while
                everyone else disappears. Room for the whole family — kids underfoot, something in
                the oven, everyone in the same space without getting in each other's way.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="md:order-1">
              <Photo
                src="/images/downstairs.jpg"
                alt="The open-plan kitchen and living space"
                width={1428}
                height={1071}
                className="max-h-[340px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* New Year */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
              03 — New Year
            </p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">See it in with a view</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
              As midnight gets close, wrap up and step outside — the Vale spreads out dark and
              quiet below, with fireworks catching along the coast from the towns and villages
              around. Then straight back in to the warm for the first toast of the new year.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src="/images/nightview.jpg"
              alt="The Barn lit up after dark, with the kitchen visible through the open door"
              width={1428}
              height={1071}
              className="max-h-[340px]"
            />
          </Reveal>
        </div>
      </section>

      <Reveal delay={0.15}>
        <div className="mx-auto max-w-content px-5 text-center sm:px-8 lg:px-12">
          <Link
            href="/#book"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Check winter dates →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
