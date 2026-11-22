import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const MAX_GUESTS = 20;
const MAX_CARS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const NOTIFY_FROM = { email: 'checkin@kingslandbarn.co.uk', name: 'Kingsland Barn Pre-arrival' };
// The inbox booking@kingslandbarn.co.uk forwards to (a verified Email Routing destination).
const NOTIFY_TO = 'daviskingsland@outlook.com';

type Guest = { name: string; nationality: string; email: string; under18: boolean };
type CheckIn = {
  arrival: string;
  departure: string;
  nights: number;
  totalGuests: number;
  under18: number;
  guests: Guest[];
  noVehicles: boolean;
  cars: string[];
  submittedAt: string;
};

function str(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function nightsBetween(arrival: string, departure: string): number {
  return Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function buildEmail(r: CheckIn) {
  const lead = r.guests[0];
  const subject = `Wales.gov pre-arrival information needed: ${lead.name}, ${formatDate(r.arrival)} (${r.totalGuests} guest${
    r.totalGuests === 1 ? '' : 's'
  }, ${r.nights} night${r.nights === 1 ? '' : 's'})`;

  const vehicles = r.noVehicles ? ['No vehicles'] : r.cars;
  const guestLine = (g: Guest, i: number) =>
    `${i + 1}. ${g.name} (${g.nationality}${g.under18 ? ', under 18' : ''})${
      g.email ? ` ${g.email}` : ''
    }`;

  const text = [
    `Wales.gov pre-arrival information needed. Submitted ${new Date(r.submittedAt).toUTCString()}`,
    '',
    `Arrival:   ${formatDate(r.arrival)}`,
    `Departure: ${formatDate(r.departure)}`,
    `Nights:    ${r.nights}`,
    `Guests:    ${r.totalGuests} (${r.under18} under 18)`,
    `Visitor levy person-nights: ${r.totalGuests * r.nights}`,
    '',
    'GUESTS',
    ...r.guests.map(guestLine),
    '',
    'VEHICLES ON SITE',
    ...vehicles.map((v) => `- ${v}`),
    '',
    `Reply to this email to contact the lead guest (${lead.email}).`,
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#6b6457">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(
      value,
    )}</strong></td></tr>`;
  const html = `<div style="font-family:system-ui,sans-serif;color:#2E2A22;font-size:15px;line-height:1.5">
<h2 style="margin:0 0 12px">Wales.gov pre-arrival information needed</h2>
<table style="border-collapse:collapse">
${row('Arrival', formatDate(r.arrival))}
${row('Departure', formatDate(r.departure))}
${row('Nights', String(r.nights))}
${row('Guests', `${r.totalGuests} (${r.under18} under 18)`)}
${row('Visitor levy person-nights', String(r.totalGuests * r.nights))}
</table>
<h3 style="margin:20px 0 8px">Guests</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="text-align:left;color:#6b6457"><th style="padding:4px 12px 4px 0">#</th><th style="padding:4px 12px 4px 0">Name</th><th style="padding:4px 12px 4px 0">Nationality</th><th style="padding:4px 12px 4px 0">Under 18</th><th style="padding:4px 0">Email</th></tr>
${r.guests
  .map(
    (g, i) =>
      `<tr><td style="padding:4px 12px 4px 0">${i + 1}</td><td style="padding:4px 12px 4px 0">${escapeHtml(
        g.name,
      )}</td><td style="padding:4px 12px 4px 0">${escapeHtml(g.nationality)}</td><td style="padding:4px 12px 4px 0">${
        g.under18 ? 'Yes' : ''
      }</td><td style="padding:4px 0">${escapeHtml(g.email)}</td></tr>`,
  )
  .join('\n')}
</table>
<h3 style="margin:20px 0 8px">Vehicles on site</h3>
<ul style="margin:0;padding-left:20px">${vehicles.map((v) => `<li>${escapeHtml(v)}</li>`).join('')}</ul>
<p style="margin-top:20px;color:#6b6457;font-size:13px">Submitted ${escapeHtml(
    new Date(r.submittedAt).toUTCString(),
  )}. Reply to this email to contact the lead guest.</p>
</div>`;

  return { subject, text, html };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request.');
  }

  // Honeypot: real guests never see or fill this field.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const arrival = str(body.arrival, 10);
  const departure = str(body.departure, 10);
  if (!DATE_RE.test(arrival) || !DATE_RE.test(departure) || departure <= arrival) {
    return bad('Please give valid arrival and departure dates.');
  }
  const nights = nightsBetween(arrival, departure);

  const rawGuests = Array.isArray(body.guests) ? body.guests.slice(0, MAX_GUESTS) : [];
  const guests: Guest[] = rawGuests
    .map((g) => {
      const o = (g ?? {}) as Record<string, unknown>;
      return {
        name: str(o.name),
        nationality: str(o.nationality, 100),
        email: str(o.email),
        under18: o.under18 === true,
      };
    })
    .filter((g) => g.name || g.nationality || g.email);

  if (guests.length === 0) return bad('Please add everyone staying.');
  for (const [i, g] of guests.entries()) {
    if (!g.name || !g.nationality) return bad(`Guest ${i + 1} needs a name and nationality.`);
    if (g.email && !EMAIL_RE.test(g.email))
      return bad(`Guest ${i + 1} has an invalid email address.`);
  }
  if (!guests[0].email) return bad('The lead guest needs an email address.');
  if (guests[0].under18) return bad('The lead guest must be 18 or over.');

  const totalGuests = Number(body.totalGuests);
  if (!Number.isInteger(totalGuests) || totalGuests !== guests.length) {
    return bad(
      `You said ${Number.isFinite(totalGuests) ? totalGuests : 'an unknown number of'} people are staying but listed ${guests.length}. Please list everyone.`,
    );
  }

  const noVehicles = body.noVehicles === true;
  const cars = noVehicles
    ? []
    : (Array.isArray(body.cars) ? body.cars.slice(0, MAX_CARS) : [])
        .map((c) => str(c, 12).toUpperCase().replace(/\s+/g, ' '))
        .filter(Boolean);
  if (!noVehicles && cars.length === 0) {
    return bad('Please add every vehicle that will be on site, or tick "No vehicles".');
  }

  if (body.consent !== true) return bad('Please confirm the details are correct.');

  const record: CheckIn = {
    arrival,
    departure,
    nights,
    totalGuests,
    under18: guests.filter((g) => g.under18).length,
    guests,
    noVehicles,
    cars,
    submittedAt: new Date().toISOString(),
  };

  let env: { GUEST_LOGS?: KVNamespace; CHECKIN_EMAIL?: SendEmail };
  try {
    env = (await getCloudflareContext({ async: true })).env as unknown as typeof env;
  } catch {
    return bad('This form is temporarily unavailable.', 503);
  }

  // Save first: the stored record is the source of truth (and the visitor levy record),
  // so a guest is only told they're checked in once it's safely kept.
  if (!env.GUEST_LOGS) return bad('This form is temporarily unavailable.', 503);
  try {
    const departureSecs = Math.floor(Date.parse(`${departure}T23:59:59Z`) / 1000);
    // Full check-in (names, nationalities, emails, vehicles): kept 12 months after the stay,
    // matching the Privacy Policy, then KV deletes it automatically.
    await env.GUEST_LOGS.put(
      `checkin:${arrival}:${record.submittedAt}:${guests[0].email}`,
      JSON.stringify(record),
      { expiration: departureSecs + 366 * 86_400 }
    );
    // Visitor levy record (no names): dates, visitors and nights, which must be kept for
    // 6 years after the levy return. Seven years covers the return being filed later.
    // Keyed by arrival + lead email so a corrected resubmission replaces the earlier one.
    await env.GUEST_LOGS.put(
      `levy:${arrival}:${guests[0].email.toLowerCase()}`,
      JSON.stringify({
        arrival,
        departure,
        nights,
        visitors: totalGuests,
        under18: record.under18,
        personNights: totalGuests * nights,
        submittedAt: record.submittedAt,
      }),
      { expiration: departureSecs + 7 * 366 * 86_400 }
    );
  } catch {
    return bad('Something went wrong saving your details. Please try again.', 500);
  }

  // Then tell Kim. A failed email shouldn't make the guest resubmit; it's logged and the
  // record is still in KV.
  if (env.CHECKIN_EMAIL) {
    try {
      const { subject, text, html } = buildEmail(record);
      await env.CHECKIN_EMAIL.send({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        replyTo: { email: guests[0].email, name: guests[0].name },
        subject,
        text,
        html,
      });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      console.error('check-in email failed', err.code, err.message);
    }
  } else {
    console.error('check-in email failed: CHECKIN_EMAIL binding missing');
  }

  return NextResponse.json({ ok: true });
}

// Basic types so this compiles without pulling in @cloudflare/workers-types.
type KVNamespace = {
  put: (key: string, value: string, options?: { expiration?: number }) => Promise<void>;
};
type EmailAddress = { email: string; name: string };
type SendEmail = {
  send: (message: {
    from: string | EmailAddress;
    to: string | EmailAddress;
    replyTo?: string | EmailAddress;
    subject: string;
    text?: string;
    html?: string;
  }) => Promise<{ messageId: string }>;
};
