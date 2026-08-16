import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import DepartureChecklist from '@/components/DepartureChecklist';
import DepartureActions from '@/components/DepartureActions';
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

      <DepartureActions />

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
