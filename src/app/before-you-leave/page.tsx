import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import DepartureChecklist from '@/components/DepartureChecklist';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Before You Leave',
  description: `A simple departure checklist for guests leaving ${siteConfig.fullName}.`,
};

export default function BeforeYouLeavePage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 pb-24 sm:px-8 sm:py-24 lg:px-12">
      <Reveal>
        <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
          Before You Leave
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          Leaving The Barn
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
          No rush — just a few small things before you head off. Please leave things as you
          found them. Feel free to tick off this checklist as you go.
        </p>
      </Reveal>

      <div className="mt-14">
        <DepartureChecklist />
      </div>

      <Reveal delay={0.1} className="mt-14 rounded-3xl bg-white/80 px-8 py-8 text-center shadow-soft sm:py-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold-deep">
          <Star size={22} />
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">Enjoyed your stay?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">
          A quick Google review helps other guests find us and means a lot to us.
        </p>
        <a
          href="https://g.page/r/CZN0fDCKmSiyEBM/review"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-coast px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-coast-dark"
        >
          Leave us a review
        </a>
      </Reveal>

      <Reveal delay={0.2} className="mt-8 rounded-3xl bg-ink px-8 py-8 text-cream">
        <p className="text-sm sm:text-base">
          Safe travels — and thank you for looking after The Barn. If anything needs flagging on
          your way out, drop us a line at{' '}
          <a href={`mailto:${siteConfig.email}`} className="text-gold underline">
            {siteConfig.email}
          </a>
          .
        </p>
      </Reveal>
    </div>
  );
}
