import { NextResponse } from 'next/server';

// Refresh at most every 3 minutes — keeps the calendar close to real-time
// without hammering the booking platforms' servers on every visitor.
export const revalidate = 180;

// Every channel the barn is listed on. Airbnb's export leaves out dates it imported
// from the other platforms, so each feed has to be read directly — Airbnb alone
// would miss Booking.com and VRBO bookings.
const FEED_ENV_VARS = ['AIRBNB_ICAL_URL', 'BOOKING_ICAL_URL', 'VRBO_ICAL_URL'] as const;

type BusyRange = { start: string; end: string }; // ISO YYYY-MM-DD, end is exclusive (checkout day)

function unfoldIcs(text: string): string {
  // RFC5545 line folding: a line starting with a space or tab is a continuation of the previous line
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function parseDate(value: string): string | null {
  // Airbnb reservation blocks are all-day events, e.g. "20260815" or "20260815T000000Z"
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  return `${y}-${m}-${d}`;
}

function parseIcs(text: string): BusyRange[] {
  const lines = unfoldIcs(text).split(/\r?\n/);
  const ranges: BusyRange[] = [];
  let inEvent = false;
  let start: string | null = null;
  let end: string | null = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      start = null;
      end = null;
    } else if (line.startsWith('END:VEVENT')) {
      if (inEvent && start && end) ranges.push({ start, end });
      inEvent = false;
    } else if (inEvent && line.startsWith('DTSTART')) {
      const value = line.split(':')[1];
      if (value) start = parseDate(value);
    } else if (inEvent && line.startsWith('DTEND')) {
      const value = line.split(':')[1];
      if (value) end = parseDate(value);
    }
  }

  return ranges;
}

async function fetchFeed(url: string): Promise<BusyRange[] | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 180 } });
    if (!res.ok) return null;
    return parseIcs(await res.text());
  } catch {
    return null;
  }
}

export async function GET() {
  const feedUrls = FEED_ENV_VARS.map((name) => process.env[name]).filter((url): url is string => !!url);

  if (feedUrls.length === 0) {
    // Fail gracefully — the calendar just shows nothing as booked rather than breaking the form
    return NextResponse.json({ error: 'not configured', ranges: [] });
  }

  const results = await Promise.all(feedUrls.map(fetchFeed));
  const ok = results.filter((r): r is BusyRange[] => r !== null);

  if (ok.length === 0) {
    return NextResponse.json({ error: 'fetch failed', ranges: [] });
  }

  // Overlapping ranges from different feeds are fine — the calendar just marks each night busy.
  // A single failed feed still shows the others' dates rather than nothing.
  const ranges = ok.flat();
  return NextResponse.json(ok.length < feedUrls.length ? { error: 'partial', ranges } : { ranges });
}
