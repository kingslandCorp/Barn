import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import GuestArea from '@/components/GuestArea';

export const metadata: Metadata = {
  title: 'Guest Access',
  description: 'House rules and pool safety information for registered guests of The Barn.',
};

export default function GuestsPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 pb-24 sm:px-8 sm:py-24 lg:px-12">
      <Reveal className="mb-14">
        <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
          For Registered Guests
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          Guest information
        </h1>
      </Reveal>

      <GuestArea />
    </div>
  );
}
