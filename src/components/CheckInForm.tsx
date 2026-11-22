'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Car, CheckCircle2, Minus, Plus, Trash2, UserRound } from 'lucide-react';
import Reveal from './Reveal';
import { siteConfig } from '@/lib/content';

type Guest = { name: string; nationality: string; email: string; under18: boolean };

const emptyGuest = (): Guest => ({ name: '', nationality: '', email: '', under18: false });
const MAX_GUESTS = 20;

const inputClass =
  'w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-coast';
const labelClass = 'mb-1.5 block text-xs font-medium text-ink/70';

export default function CheckInForm() {
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [guests, setGuests] = useState<Guest[]>([emptyGuest()]);
  const [cars, setCars] = useState<string[]>(['']);
  const [noVehicles, setNoVehicles] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  // Pre-fill the lead guest's email from the Guests-area sign-in.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('kingslandGuestEmail');
      if (saved) setGuests((g) => (g[0].email ? g : [{ ...g[0], email: saved }, ...g.slice(1)]));
    } catch {
      // ignore
    }
  }, []);

  const updateGuest = (i: number, field: keyof Guest, value: string | boolean) =>
    setGuests((g) => g.map((guest, j) => (j === i ? { ...guest, [field]: value } : guest)));

  // The headcount drives the number of guest rows, so nobody staying can be left off.
  const setGuestCount = (n: number) => {
    const count = Math.min(MAX_GUESTS, Math.max(1, Math.floor(n) || 1));
    setGuests((g) =>
      g.length >= count
        ? g.slice(0, count)
        : [...g, ...Array.from({ length: count - g.length }, emptyGuest)],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/check-in/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arrival,
          departure,
          totalGuests: guests.length,
          guests,
          noVehicles,
          cars: noVehicles ? [] : cars,
          consent,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <Reveal className="mx-auto max-w-xl rounded-3xl bg-white/80 p-8 text-center shadow-soft sm:p-10">
        <CheckCircle2 className="mx-auto text-sage-dark" size={40} strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-3xl text-ink">You&rsquo;re checked in</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Thank you &mdash; we&rsquo;ve got everyone&rsquo;s details and passed them to Kim. If
          anything changes, just submit the form again or email us at{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
          .
        </p>
        <Link
          href="/guests"
          className="mt-6 inline-block rounded-full bg-coast px-6 py-3 text-sm font-medium text-cream hover:bg-coast-dark"
        >
          Back to the Guest Area
        </Link>
      </Reveal>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {/* Dates */}
      <Reveal className="rounded-3xl bg-white/70 p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl text-ink">Your stay</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="arrival" className={labelClass}>
              Arrival date
            </label>
            <input
              id="arrival"
              type="date"
              required
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="departure" className={labelClass}>
              Departure date
            </label>
            <input
              id="departure"
              type="date"
              required
              min={arrival || undefined}
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </Reveal>

      {/* Guests */}
      <Reveal delay={0.05} className="rounded-3xl bg-white/70 p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl text-ink">Everyone staying</h2>
        <p className="mt-1 text-sm text-ink/60">
          Every person sleeping at the barn must be listed, including children and babies.
          We&rsquo;re required to keep a record of all overnight visitors. An email is needed for
          the lead guest and is optional for everyone else.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span id="guest-count-label" className="text-sm font-medium text-ink">
            How many people are staying in total?
          </span>
          <div className="flex items-center gap-2" role="group" aria-labelledby="guest-count-label">
            <button
              type="button"
              aria-label="One fewer guest"
              onClick={() => setGuestCount(guests.length - 1)}
              disabled={guests.length <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-coast/10 text-coast hover:bg-coast/15 disabled:opacity-40"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_GUESTS}
              aria-labelledby="guest-count-label"
              value={guests.length}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-16 rounded-2xl border border-ink/15 bg-cream px-2 py-2.5 text-center text-base font-medium text-ink focus:border-coast"
            />
            <button
              type="button"
              aria-label="One more guest"
              onClick={() => setGuestCount(guests.length + 1)}
              disabled={guests.length >= MAX_GUESTS}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-coast/10 text-coast hover:bg-coast/15 disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="mt-5 space-y-5">
          {guests.map((guest, i) => (
            <fieldset key={i} className="rounded-2xl border border-ink/10 p-4 sm:p-5">
              <legend className="flex items-center gap-2 px-1 text-sm font-medium text-ink">
                <UserRound size={15} strokeWidth={1.75} className="text-coast" />
                {i === 0 ? 'Lead guest' : `Guest ${i + 1}`}
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor={`name-${i}`} className={labelClass}>
                    Full name
                  </label>
                  <input
                    id={`name-${i}`}
                    required
                    autoComplete={i === 0 ? 'name' : 'off'}
                    value={guest.name}
                    onChange={(e) => updateGuest(i, 'name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`nationality-${i}`} className={labelClass}>
                    Nationality
                  </label>
                  <input
                    id={`nationality-${i}`}
                    required
                    placeholder="e.g. British"
                    value={guest.nationality}
                    onChange={(e) => updateGuest(i, 'nationality', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`email-${i}`} className={labelClass}>
                    Email{i > 0 && ' (optional)'}
                  </label>
                  <input
                    id={`email-${i}`}
                    type="email"
                    required={i === 0}
                    autoComplete={i === 0 ? 'email' : 'off'}
                    value={guest.email}
                    onChange={(e) => updateGuest(i, 'email', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              {i === 0 ? (
                <p className="mt-3 text-xs text-ink/50">The lead guest must be 18 or over.</p>
              ) : (
                <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
                  <input
                    type="checkbox"
                    checked={guest.under18}
                    onChange={(e) => updateGuest(i, 'under18', e.target.checked)}
                    className="h-4 w-4 accent-coast"
                  />
                  Under 18
                </label>
              )}
            </fieldset>
          ))}
        </div>
      </Reveal>

      {/* Cars */}
      <Reveal delay={0.1} className="rounded-3xl bg-white/70 p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl text-ink">Vehicles</h2>
        <p className="mt-1 text-sm text-ink/60">
          The registration of every vehicle that will be parked on site during your stay, including
          any arriving separately.
        </p>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={noVehicles}
            onChange={(e) => setNoVehicles(e.target.checked)}
            className="h-4 w-4 accent-coast"
          />
          No vehicles &mdash; nobody in our party is bringing one
        </label>
        {!noVehicles && (
          <>
            <div className="mt-5 space-y-3">
              {cars.map((reg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Car size={18} strokeWidth={1.75} className="shrink-0 text-coast" />
                  <label htmlFor={`car-${i}`} className="sr-only">
                    Car {i + 1} registration
                  </label>
                  <input
                    id={`car-${i}`}
                    required={i === 0}
                    value={reg}
                    maxLength={12}
                    placeholder="e.g. AB12 CDE"
                    onChange={(e) =>
                      setCars((c) => c.map((r, j) => (j === i ? e.target.value.toUpperCase() : r)))
                    }
                    className={`${inputClass} uppercase placeholder:normal-case`}
                  />
                  {cars.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove car ${i + 1}`}
                      onClick={() => setCars((c) => c.filter((_, j) => j !== i))}
                      className="shrink-0 p-2 text-ink/40 hover:text-ink"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {cars.length < 10 && (
              <button
                type="button"
                onClick={() => setCars((c) => [...c, ''])}
                className="mt-5 flex items-center gap-2 rounded-full bg-coast/10 px-5 py-2.5 text-sm font-medium text-coast hover:bg-coast/15"
              >
                <Plus size={15} /> Add another vehicle
              </button>
            )}
          </>
        )}
      </Reveal>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Reveal delay={0.15} className="space-y-4">
        <label className="flex items-start gap-3 text-sm text-ink/70">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-coast"
          />
          <span>
            I confirm everyone staying overnight and every vehicle that will be on site is listed,
            the details are correct, and I have permission to share them for everyone listed. See
            our{' '}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-coast px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-coast-dark disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {status === 'sending' ? 'Sending…' : 'Complete check-in'}
        </button>
      </Reveal>
    </form>
  );
}
