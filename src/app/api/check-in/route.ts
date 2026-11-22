import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const MAX_GUESTS = 20;
const MAX_CARS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Guest = { name: string; nationality: string; email: string };

function str(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real guests never see or fill this field.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const arrival = str(body.arrival, 10);
  const departure = str(body.departure, 10);
  if (!DATE_RE.test(arrival) || !DATE_RE.test(departure) || departure <= arrival) {
    return NextResponse.json(
      { ok: false, error: 'Please give valid arrival and departure dates.' },
      { status: 400 }
    );
  }

  const rawGuests = Array.isArray(body.guests) ? body.guests.slice(0, MAX_GUESTS) : [];
  const guests: Guest[] = rawGuests
    .map((g) => {
      const o = (g ?? {}) as Record<string, unknown>;
      return { name: str(o.name), nationality: str(o.nationality, 100), email: str(o.email) };
    })
    .filter((g) => g.name || g.nationality || g.email);

  if (guests.length === 0) {
    return NextResponse.json({ ok: false, error: 'Please add at least one guest.' }, { status: 400 });
  }
  for (const [i, g] of guests.entries()) {
    if (!g.name || !g.nationality) {
      return NextResponse.json(
        { ok: false, error: `Guest ${i + 1} needs a name and nationality.` },
        { status: 400 }
      );
    }
    if (g.email && !EMAIL_RE.test(g.email)) {
      return NextResponse.json(
        { ok: false, error: `Guest ${i + 1} has an invalid email address.` },
        { status: 400 }
      );
    }
  }
  if (!guests[0].email) {
    return NextResponse.json(
      { ok: false, error: 'The lead guest needs an email address.' },
      { status: 400 }
    );
  }

  const cars = (Array.isArray(body.cars) ? body.cars.slice(0, MAX_CARS) : [])
    .map((c) => str(c, 12).toUpperCase().replace(/\s+/g, ' '))
    .filter(Boolean);

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: 'Please confirm the details are correct.' },
      { status: 400 }
    );
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as unknown as { GUEST_LOGS?: KVNamespace }).GUEST_LOGS;
    if (!kv) {
      return NextResponse.json(
        { ok: false, error: 'Check-in is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const submittedAt = new Date().toISOString();
    const record = { arrival, departure, guests, cars, submittedAt };
    // Keyed by arrival date first so listing the `checkin:` prefix reads in stay order.
    const key = `checkin:${arrival}:${submittedAt}:${guests[0].email}`;
    await kv.put(key, JSON.stringify(record));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Something went wrong saving your check-in.' },
      { status: 500 }
    );
  }
}

// Basic type so this compiles without pulling in @cloudflare/workers-types.
type KVNamespace = {
  put: (key: string, value: string) => Promise<void>;
};
