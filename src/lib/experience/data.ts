// Experience page content, from Brock_Brown_Resume_2026.pdf. Laid out like a
// record: each section is a side, each entry a track (A1, B1, B2, …).

export interface Entry {
  id: string;
  org: string;
  role: string; // shown in italics under the org
  location?: string;
  start?: string; // 'YYYY-MM'; omitted when only `dateLabel` is shown
  end: string | 'present' | null; // null: show `dateLabel` only (e.g. expected graduation)
  dateLabel?: string; // overrides the formatted range
  description: string;
  details?: string[]; // small secondary lines (coursework, honours)
}

export interface Side {
  side: string; // 'A', 'B', …
  title: string;
  entries: Entry[];
}

export const sides: Side[] = [
  {
    side: 'A',
    title: 'Education',
    entries: [
      {
        id: 'northwestern',
        org: 'Northwestern University',
        role: 'B.S. Computer Science · GPA 3.88/4.00',
        end: null,
        dateLabel: 'Exp: Dec 2026',
        description: "6× Dean's List (3× High Honors).",
        details: [
          'Relevant coursework: Machine Learning, Deep Learning, Operating Systems, Data Structures & Algorithms, Computer Networking, Fullstack Engineering, Scalable Software Architectures, Software Quality Engineering',
        ],
      },
    ],
  },
  {
    side: 'B',
    title: 'Work',
    entries: [
      {
        id: 'apple',
        org: 'Apple',
        role: 'Software Engineering Intern · Siri & AI/ML (Speech/Audio)',
        location: 'Cupertino, CA',
        start: '2026-06',
        end: 'present',
        description:
          "Shipped a Swift tool for Siri's on-device LLM planner that cut tool wall-clock from 11.7s to 0.9s by collapsing six cross-process dispatches into one batched request, and built a second planner tool that discovers its targets at runtime: 180+ targets across 39 apps with no per-app code.",
      },
      {
        id: 'barton',
        org: 'Barton Studio',
        role: 'Fullstack Developer Intern',
        location: 'San Diego, CA',
        start: '2025-06',
        end: '2025-09',
        description:
          'Delivered two production client apps with role-based access control and Salesforce CRM integration (55% conversion from 250+ leads), with React/TypeScript frontends that cut API calls by 45% and FastAPI services on Supabase Postgres enforcing multi-tenant row-level security.',
      },
    ],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

/** "June 2026 – Present", "June – Sept 2025", or the entry's dateLabel. */
export function formatRange(e: Entry): string {
  if (e.dateLabel || e.end === null || !e.start) return e.dateLabel ?? '';
  const s = parse(e.start);
  if (e.end === 'present') return `${MONTHS[s.m - 1]} ${s.y} – Present`;
  const t = parse(e.end);
  return s.y === t.y
    ? `${MONTHS[s.m - 1]} – ${MONTHS[t.m - 1]} ${t.y}`
    : `${MONTHS[s.m - 1]} ${s.y} – ${MONTHS[t.m - 1]} ${t.y}`;
}

/** Tenure in whole months, inclusive of both ends ("track length"); null when open-ended. */
export function tenureMonths(e: Entry, now = new Date()): number | null {
  if (e.end === null || !e.start) return null;
  const s = parse(e.start);
  const t = e.end === 'present' ? { y: now.getFullYear(), m: now.getMonth() + 1 } : parse(e.end);
  return Math.max(1, (t.y - s.y) * 12 + (t.m - s.m) + 1);
}
