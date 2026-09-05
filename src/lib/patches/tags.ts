import type { Tag } from './types';

// Canonical tag registry: id (slug) -> display label. Filtering keys off the id;
// the label is what the filter rail and rows render. Only tags that appear on at
// least one project belong here.
export const TAG_LABELS: Record<string, string> = {
  // languages
  typescript: 'TYPESCRIPT',
  javascript: 'JAVASCRIPT',
  python: 'PYTHON',
  java: 'JAVA',
  swift: 'SWIFT',
  // frontend
  react: 'REACT',
  nextjs: 'NEXT.JS',
  tailwind: 'TAILWIND',
  bootstrap: 'BOOTSTRAP',
  'styled-components': 'STYLED-COMPONENTS',
  'ag-grid': 'AG GRID',
  // backend / frameworks
  node: 'NODE',
  express: 'EXPRESS',
  flask: 'FLASK',
  'spring-boot': 'SPRING BOOT',
  graphql: 'GRAPHQL',
  // data stores
  supabase: 'SUPABASE',
  postgresql: 'POSTGRES',
  sqlite: 'SQLITE',
  redis: 'REDIS',
  dynamodb: 'DYNAMODB',
  // cloud / infra
  aws: 'AWS',
  // media / audio
  'web-audio': 'WEB AUDIO',
  ffmpeg: 'FFMPEG',
  // realtime
  websockets: 'WEBSOCKETS',
  // ai
  'llm-tooling': 'LLM TOOLING',
  // external services / apis
  stripe: 'STRIPE',
  resend: 'RESEND',
  'spotify-api': 'SPOTIFY API',
};

// Variant spellings seen in raw content -> canonical id. Keys are compared
// case-insensitively after trimming. Correct filtering depends on every tech
// string resolving to exactly one canonical id.
const VARIANTS: Record<string, string> = {
  'react.js': 'react',
  reactjs: 'react',
  'next.js': 'nextjs',
  next: 'nextjs',
  ts: 'typescript',
  js: 'javascript',
  'node.js': 'node',
  nodejs: 'node',
  'styled components': 'styled-components',
  'ag grid': 'ag-grid',
  'spring boot': 'spring-boot',
  springboot: 'spring-boot',
  postgres: 'postgresql',
  'web audio': 'web-audio',
  'spotify web api': 'spotify-api',
  'spotify api': 'spotify-api',
};

/** Resolve a raw tech string to a canonical tag id, or null if unknown. */
export function canonicalizeTag(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (key in TAG_LABELS) return key;
  if (key in VARIANTS) return VARIANTS[key];
  return null;
}

export function getTag(id: string): Tag | undefined {
  const label = TAG_LABELS[id];
  return label ? { id, label } : undefined;
}

/** All registered tags, alphabetized by label. */
export function allTags(): Tag[] {
  return Object.entries(TAG_LABELS)
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
