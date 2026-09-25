import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';

// The local tracker (keystroke-counter/sync.py) POSTs a full snapshot of its
// sqlite DB here every few minutes; the site GETs it. Pushing absolute totals
// (not increments) keeps syncs idempotent -- a retried or duplicated POST is harmless.

const SNAPSHOT_KEY = 'keystrokes:snapshot';
// Day keys come from the tracker's naive local timestamps, so "today" must be
// computed in the same zone rather than UTC.
const TIMEZONE = 'America/Chicago';
const RECENT_DAYS = 30;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface KeystrokeSnapshot {
  total: number;
  days: Record<string, number>;
  synced_at: string;
}

export interface KeystrokeStats {
  total_keystrokes: number;
  today_keystrokes: number;
  recent_activity: { date: string; count: number }[];
  last_updated: string;
}

const isCount = (n: unknown): n is number => Number.isSafeInteger(n) && (n as number) >= 0;

export function parseSnapshot(body: unknown, now: Date): KeystrokeSnapshot | null {
  if (!body || typeof body !== 'object') return null;
  const { total, days } = body as Record<string, unknown>;
  if (!isCount(total) || !days || typeof days !== 'object' || Array.isArray(days)) return null;

  const entries = Object.entries(days as Record<string, unknown>);
  if (!entries.every(([date, count]) => DATE_RE.test(date) && isCount(count))) return null;

  return {
    total,
    days: Object.fromEntries(entries) as Record<string, number>,
    synced_at: now.toISOString(),
  };
}

export function localDate(now: Date, timeZone = TIMEZONE): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function shiftDate(date: string, deltaDays: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + deltaDays)).toISOString().slice(0, 10);
}

export function toStats(snapshot: KeystrokeSnapshot, now: Date): KeystrokeStats {
  const today = localDate(now);
  const cutoff = shiftDate(today, -(RECENT_DAYS - 1));

  const recent_activity = Object.entries(snapshot.days)
    .filter(([date]) => date >= cutoff && date <= today)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, count]) => ({ date, count }));

  return {
    total_keystrokes: snapshot.total,
    today_keystrokes: snapshot.days[today] ?? 0,
    recent_activity,
    last_updated: snapshot.synced_at,
  };
}

function getRedis(): Redis {
  // Vercel's Upstash integration injects KV_*; a manually created Upstash DB uses UPSTASH_*.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis is not configured');
  return new Redis({ url, token });
}

function isAuthorized(req: VercelRequest): boolean {
  const expected = process.env.KEYSTROKE_SYNC_TOKEN;
  const header = req.headers.authorization;
  if (!expected || !header?.startsWith('Bearer ')) return false;

  const given = Buffer.from(header.slice('Bearer '.length));
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const snapshot = await getRedis().get<KeystrokeSnapshot>(SNAPSHOT_KEY);
      if (!snapshot) {
        return res.status(404).json({ error: 'No keystroke data has been synced yet' });
      }
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.json(toStats(snapshot, new Date()));
    }

    if (req.method === 'POST') {
      if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const snapshot = parseSnapshot(req.body, new Date());
      if (!snapshot) {
        return res.status(400).json({ error: 'Expected { total: number, days: { "YYYY-MM-DD": number } }' });
      }
      await getRedis().set(SNAPSHOT_KEY, snapshot);
      return res.json({ ok: true, total: snapshot.total });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Keystrokes API error:', error);
    res.status(500).json({
      error: 'Failed to handle keystroke data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
