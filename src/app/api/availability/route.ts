import { NextResponse } from 'next/server';

// Refresh at most once an hour — booking calendars don't need second-by-second freshness,
// and this avoids hammering Airbnb's server on every visitor.
export const revalidate = 3600;

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

export async function GET() {
  const feedUrl = process.env.AIRBNB_ICAL_URL;

  if (!feedUrl) {
    // Fail gracefully — the calendar just shows nothing as booked rather than breaking the form
    return NextResponse.json({ error: 'not configured', ranges: [] });
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'fetch failed', ranges: [] });
    }
    const text = await res.text();
    const ranges = parseIcs(text);
    return NextResponse.json({ ranges });
  } catch {
    return NextResponse.json({ error: 'fetch failed', ranges: [] });
  }
}
