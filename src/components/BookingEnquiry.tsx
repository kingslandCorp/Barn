'use client';

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

export default function BookingEnquiry() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [name, setName] = useState('');

  const subject = encodeURIComponent('Booking enquiry — The Family Barn');
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to enquire about availability for:\n\nCheck-in: ${
      checkIn || '(please add)'
    }\nCheck-out: ${checkOut || '(please add)'}\nName: ${name || '(please add)'}\n\nThanks!`
  );
  const mailtoHref = `mailto:booking@kingslandbarn.co.uk?subject=${subject}&body=${body}`;

  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink/70">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone/30 bg-white px-4 py-2.5 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink/70">Check-out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone/30 bg-white px-4 py-2.5 text-sm text-ink"
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-medium text-ink/70">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="So we know who's asking"
          className="mt-1 w-full rounded-xl border border-stone/30 bg-white px-4 py-2.5 text-sm text-ink"
        />
      </label>
      <a
        href={mailtoHref}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
      >
        <CalendarCheck size={16} strokeWidth={1.75} />
        Send Enquiry
      </a>
      <p className="mt-3 text-xs text-ink/45">
        Opens your email app with these dates filled in, addressed to booking@kingslandbarn.co.uk.
      </p>
    </div>
  );
}
