'use client';

import { useState, useCallback } from 'react';
import { CalendarCheck } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar';

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BookingEnquiry() {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleDatesChange = useCallback((newCheckIn: string | null, newCheckOut: string | null) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  }, []);

  const subject = encodeURIComponent('Booking enquiry — The Family Barn');
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to enquire about availability for:\n\nCheck-in: ${
      formatDate(checkIn) || '(please add)'
    }\nCheck-out: ${formatDate(checkOut) || '(please add)'}\nName: ${name || '(please add)'}\n\nThanks!`
  );
  const mailtoHref = `mailto:booking@kingslandbarn.co.uk?subject=${subject}&body=${body}`;

  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-card sm:p-8">
      <p className="text-sm font-medium text-ink/70">Select your dates</p>
      <div className="mt-2">
        <AvailabilityCalendar onChange={handleDatesChange} />
      </div>

      <label className="mt-6 block min-w-0">
        <span className="text-sm font-medium text-ink/70">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="So we know who's asking"
          className="mt-1 w-full min-w-0 rounded-xl border border-stone/30 bg-white px-4 py-2.5 text-sm text-ink"
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
