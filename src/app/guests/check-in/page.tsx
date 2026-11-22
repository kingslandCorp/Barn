import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import GuestGate from '@/components/GuestGate';
import CheckInForm from '@/components/CheckInForm';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Check-in',
  description: `Register your party before arriving at ${siteConfig.fullName}.`,
  robots: { index: false, follow: false },
};

export default function CheckInPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">Check-in</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Who&rsquo;s staying?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Before you arrive, please register everyone staying overnight, including children,
            and every vehicle that will be parked on site.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
            We&rsquo;ll email the lead guest a QuickBooks invoice for the refundable £250 damage
            deposit, which is returned after your stay once the barn has been checked.
          </p>
        </Reveal>
      </section>
      <section className="mx-auto mt-10 max-w-content px-5 sm:px-8 lg:px-12">
        <GuestGate>
          <CheckInForm />
        </GuestGate>
      </section>
    </div>
  );
}
