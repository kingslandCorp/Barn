'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import IconCard from './IconCard';
import Photo from './Photo';
import Reveal from './Reveal';
import { houseRules, poolRules, sitePhotos, siteConfig } from '@/lib/content';

const STORAGE_KEY = 'kingslandGuestEmail';

export default function GuestArea() {
  const [email, setEmail] = useState('');
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setGuestEmail(saved);
    } catch {
      // localStorage unavailable — gate simply won't persist between visits
    } finally {
      setCheckedStorage(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    try {
      window.localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // ignore storage failures — still unlock for this session
    }
    setGuestEmail(trimmed);
  };

  const handleSignOut = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setGuestEmail(null);
    setEmail('');
  };

  // Avoid a flash of the gate before we've checked localStorage on mount
  if (!checkedStorage) {
    return <div className="min-h-[40vh]" />;
  }

  if (!guestEmail) {
    return (
      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="rounded-3xl bg-white/80 p-8 text-center shadow-soft sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coast/10 text-coast">
              <KeyRound size={26} />
            </div>
            <h1 className="mt-5 font-display text-3xl text-ink">Guest access</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              House rules and pool safety information are just for registered guests. Enter the
              email address you used for your booking to continue.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
              <label htmlFor="guest-email" className="sr-only">
                Booking email address
              </label>
              <input
                id="guest-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-ink/15 bg-cream px-5 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-coast"
              />
              {error && <p className="px-1 text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-coast px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-coast-dark"
              >
                Access guest information
              </button>
            </form>
            <p className="mt-5 text-xs text-ink/40">
              Trouble getting in? Email us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-sage-dark" size={22} />
          <p className="text-sm text-ink/60">
            Signed in as <span className="font-medium text-ink">{guestEmail}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      <section>
        <p className="eyebrow mb-2 text-xs font-semibold uppercase text-gold-deep">House Rules</p>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">A few gentle guidelines</h2>
        <p className="mt-3 max-w-2xl text-base text-ink/65">
          Nothing complicated — just what keeps The Barn wonderful for you and for whoever stays
          here next.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {houseRules.map((rule, i) => (
            <IconCard key={rule.title} delay={i * 0.05} {...rule} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">Pool Safety</p>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Enjoy the pool, safely</h2>
        <p className="mt-3 max-w-2xl text-base text-ink/65">
          The pool is one of the best parts of staying at The Barn — please take a moment to read
          this before anyone gets in.
        </p>
        <div className="mt-6 max-w-2xl">
          <Photo
            src={sitePhotos.poolSafety.src}
            alt={sitePhotos.poolSafety.alt}
            width={sitePhotos.poolSafety.width}
            height={sitePhotos.poolSafety.height}
            className="max-h-[320px]"
          />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {poolRules.map((rule, i) => (
            <IconCard key={rule.title} delay={i * 0.05} {...rule} />
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-red-50 p-6 text-sm text-red-900">
          <strong>In a genuine emergency, always call 999 first.</strong> For anything else,
          reach us at{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
          .
        </div>
      </section>
    </div>
  );
}
