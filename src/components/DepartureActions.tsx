import { MessageCircle, Star } from 'lucide-react';
import Reveal from './Reveal';
import { googleReviewUrl, hostWhatsAppUrl } from '@/lib/content';

export default function DepartureActions() {
  return (
    <div className="mt-14 grid gap-6 sm:grid-cols-2">
      <Reveal
        delay={0.1}
        className="flex h-full flex-col items-center rounded-3xl bg-white/80 px-8 py-8 text-center shadow-soft sm:py-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
          <MessageCircle size={22} />
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">Ready to go?</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/65">
          Let Kim know you're checking out — she'll take it from there.
        </p>
        <a
          href={hostWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-sage-dark px-6 py-3 text-sm font-medium text-cream transition-colors hover:opacity-90"
        >
          Message Kim on WhatsApp
        </a>
      </Reveal>

      <Reveal
        delay={0.15}
        className="flex h-full flex-col items-center rounded-3xl bg-white/80 px-8 py-8 text-center shadow-soft sm:py-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold-deep">
          <Star size={22} />
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">Enjoyed your stay?</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/65">
          A quick Google review helps other guests find us and means a lot to us.
        </p>
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-coast px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-coast-dark"
        >
          Leave us a review
        </a>
      </Reveal>
    </div>
  );
}
