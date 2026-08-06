'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  onChange: (checkIn: string | null, checkOut: string | null) => void;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Local-date-based ISO formatting (deliberately not toISOString, which converts to UTC
// and can shift the date by one day during British Summer Time)
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromISODate(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}

function fmt(iso: string | null): string | null {
  if (!iso) return null;
  return fromISODate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AvailabilityCalendar({ onChange }: Props) {
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/availability', { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { ranges?: { start: string; end: string }[] }) => {
        const set = new Set<string>();
        for (const r of data.ranges || []) {
          const start = fromISODate(r.start);
          const end = fromISODate(r.end);
          for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            set.add(toISODate(d));
          }
        }
        setBusy(set);
        setLoaded(true);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoaded(true);
      });
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    onChange(checkIn, checkOut);
  }, [checkIn, checkOut, onChange]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const days = useMemo(() => {
    const startWeekday = (viewMonth.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    return cells;
  }, [viewMonth]);

  const isBusy = useCallback((d: Date) => busy.has(toISODate(d)), [busy]);
  const isPast = useCallback((d: Date) => d < today, [today]);
  const isInRange = useCallback(
    (d: Date) => {
      if (!checkIn || !checkOut) return false;
      const iso = toISODate(d);
      return iso > checkIn && iso < checkOut;
    },
    [checkIn, checkOut]
  );

  function handleClick(d: Date) {
    if (isPast(d) || isBusy(d)) return;
    const iso = toISODate(d);
    setError(null);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    if (iso <= checkIn) {
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    const start = fromISODate(checkIn);
    const end = fromISODate(iso);
    for (let d2 = new Date(start); d2 < end; d2.setDate(d2.getDate() + 1)) {
      if (busy.has(toISODate(d2))) {
        setError('That range crosses an already-booked date — please choose a check-out before the next booking.');
        return;
      }
    }
    setCheckOut(iso);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink/70">
          <span>
            <span className="font-medium text-ink">Check-in:</span> {fmt(checkIn) || '—'}
          </span>
          <span>
            <span className="font-medium text-ink">Check-out:</span> {fmt(checkOut) || '—'}
          </span>
        </div>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => {
              setCheckIn(null);
              setCheckOut(null);
              setError(null);
            }}
            className="text-xs text-coast underline"
          >
            Reset
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-gold-deep">{error}</p>}

      <div className="mt-4 rounded-2xl border border-stone/30 bg-white p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className="rounded-full p-1.5 text-ink/60 hover:bg-sand-light"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-display text-base text-ink">
            {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className="rounded-full p-1.5 text-ink/60 hover:bg-sand-light"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-ink/40">
          {DAY_LABELS.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = toISODate(d);
            const busyDay = isBusy(d);
            const pastDay = isPast(d);
            const selected = checkIn === iso || checkOut === iso;
            const inRange = isInRange(d);
            const disabled = busyDay || pastDay;
            return (
              <button
                type="button"
                key={i}
                disabled={disabled}
                onClick={() => handleClick(d)}
                title={busyDay ? 'Already booked' : undefined}
                className={`aspect-square rounded-lg text-xs transition-colors sm:text-sm ${
                  selected
                    ? 'bg-coast font-medium text-cream'
                    : inRange
                      ? 'bg-coast/15 text-ink'
                      : disabled
                        ? 'cursor-not-allowed text-ink/25 line-through'
                        : 'text-ink hover:bg-sand-light'
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {!loaded && <p className="mt-2 text-xs text-ink/40">Checking live availability…</p>}
    </div>
  );
}
