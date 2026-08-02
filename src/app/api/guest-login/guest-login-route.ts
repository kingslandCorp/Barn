import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: NextRequest) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 200 });
  }

  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 200 });
  }

  const trimmedEmail = email.trim();

  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as unknown as { GUEST_LOGS?: KVNamespace }).GUEST_LOGS;

    if (!kv) {
      // KV isn't bound yet (e.g. namespace not created/wired up) — fail quietly
      // so the guest login itself is never blocked by logging being unavailable.
      return NextResponse.json({ ok: false, error: 'Logging not configured' }, { status: 200 });
    }

    const timestamp = new Date().toISOString();
    const key = `login:${timestamp}:${trimmedEmail}`;
    await kv.put(key, JSON.stringify({ email: trimmedEmail, timestamp }));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to log' }, { status: 200 });
  }
}

// Basic type so this compiles without pulling in @cloudflare/workers-types.
type KVNamespace = {
  put: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  list: (options?: { prefix?: string }) => Promise<{ keys: { name: string }[] }>;
};
