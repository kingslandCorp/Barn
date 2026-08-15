'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';
import { siteConfig } from '@/lib/content';

const STORAGE_KEY = 'kingslandGuestEmail';

export default function GuestGate({ children }: { children: ReactNode }) {
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

    // Log this login server-side. Fire-and-forget: logging failing (or being
    // unconfigured) should never stop a guest getting into the information
    // they need.
    fetch('/api/guest-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    }).catch(() => {});

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
              This information is just for registered guests. Enter the email address you used
              for your booking to continue.
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
              <p className="px-1 text-xs text-ink/40">
                We log this email address to confirm you&rsquo;re a registered guest. See our{' '}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
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
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
      {children}
    </div>
  );
}
