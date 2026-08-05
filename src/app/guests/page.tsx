import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import GuestGate from '@/components/GuestGate';
import GuestTabs from '@/components/GuestTabs';
import { siteConfig } from '@/lib/content';
export const metadata: Metadata = {
  title: 'Guests',
  description: `Everything guests need during their stay at ${siteConfig.fullName}.`,
};
export default function GuestsPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
            Guest Area
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Welcome!
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Everything you need for your stay, in one place.
          </p>
        </Reveal>
      </section>
      <section className="mx-auto mt-10 max-w-content px-5 sm:px-8 lg:px-12">
        <GuestGate>
          <GuestTabs />
        </GuestGate>
      </section>
    </div>
  );
}
