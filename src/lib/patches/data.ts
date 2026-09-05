import type { Project } from './types';

// Patch numbers are editorial (curated), assigned once and frozen here. They are
// NOT derived from array order — reordering or deleting must never renumber.
// `sigSeed` is pinned to each project's current name so a future rename can't
// silently change its waveform mark.
export const projects: Project[] = [
  {
    id: 'money-personality',
    patch: 0,
    init: true,
    name: 'The Money Personality',
    category: 'WEB',
    tech: ['react', 'typescript', 'python', 'flask', 'supabase', 'stripe'],
    year: 2025,
    status: 'active',
    links: { demo: 'https://www.themoneypersonality.com/' },
    description:
      'Full-stack web application that provides a comprehensive money personality assessment platform that provides users with detailed personality-based financial insights through an interactive quiz system, complete with PDF report generation and advisor/client management capabilities.',
    sigSeed: 'The Money Personality',
  },
  {
    id: 'apple-siri',
    patch: 1,
    name: 'Apple — Siri Planner',
    category: 'AUDIO',
    tech: ['swift', 'llm-tooling'],
    year: 2026,
    status: 'active',
    links: {},
    description:
      "Shipped Swift tooling for Siri's on-device LLM planner (Speech/AI-ML): collapsed six cross-process dispatches into one batched request to cut tool wall-clock from 11.7s to 0.9s, and built a second planner tool that discovers its targets at runtime from on-device app metadata — 180+ targets across 39 apps with no per-app code.",
    sigSeed: 'Apple — Siri Planner',
  },
  {
    id: 'cloudstem',
    patch: 2,
    name: 'CloudStem',
    category: 'AUDIO',
    tech: ['aws', 'node', 'ffmpeg', 'web-audio', 'dynamodb'],
    year: 2026,
    status: 'active',
    // TODO(brock): add the public repo URL for CloudStem (resume shows [repo]).
    links: {},
    description:
      'Event-driven AWS pipeline (S3/SQS/DynamoDB/EC2) that decouples uploads from CPU-bound FFmpeg transcoding; a Node worker emits a 300-point peak-amplitude envelope so the client renders a seekable canvas waveform and Web Audio FFT visualizer, with AES-256 masters decrypted client-side over an S3 presigned URL.',
    sigSeed: 'CloudStem',
  },
  {
    id: 'bill-splitting',
    patch: 3,
    name: 'Real-Time Bill Splitting',
    category: 'SYSTEMS',
    tech: ['nextjs', 'typescript', 'java', 'spring-boot', 'graphql', 'postgresql', 'redis', 'websockets'],
    year: 2026,
    status: 'active',
    // TODO(brock): add the public repo URL for Bill Splitting (resume shows [repo]).
    links: {},
    description:
      'Real-time bill-splitting app (Next.js/TypeScript, Java/Spring Boot, GraphQL) with an async OCR pipeline: uploads enqueue Protobuf-serialized jobs to Redis for a background Tesseract worker, parsed line items stream to all clients over STOMP WebSockets, and first-come item claiming is enforced atomically via a PostgreSQL row-level trigger with optimistic UI.',
    sigSeed: 'Real-Time Bill Splitting',
  },
  {
    id: 'highline-alts',
    patch: 4,
    name: 'Highline Alts',
    category: 'WEB',
    tech: ['react', 'typescript', 'express', 'node', 'supabase', 'resend', 'tailwind'],
    year: 2025,
    status: 'active',
    links: { demo: 'https://highline-frontend.vercel.app/' },
    description:
      'Full-stack web application enabling accredited investors to discover and express interest in private equity, venture capital, and real estate deals, with comprehensive admin tools for deal management and investor onboarding.',
    sigSeed: 'Highline Alts',
  },
  {
    id: 'statsfm',
    patch: 5,
    name: '!stats.fm',
    category: 'AUDIO',
    tech: ['javascript', 'bootstrap', 'python', 'flask', 'sqlite', 'spotify-api'],
    year: 2024,
    status: 'archived',
    links: {
      demo: 'https://bbrockbrown2.pythonanywhere.com/',
      github: 'https://github.com/bbrockbrown/spotify_visualization_dataV2',
    },
    description:
      'Full-stack web application that provides a comprehensive Spotify music data visualization platform, allowing users to explore songs, artists, and albums through interactive radar-like graphs and user-friendly interfaces, complete with user authentication, admin dashboard, and bug reporting system.',
    sigSeed: '!stats.fm',
  },
  {
    id: 'inventory-management',
    patch: 6,
    name: 'Inventory Management System',
    category: 'TOOL',
    tech: ['react', 'javascript', 'node', 'postgresql', 'supabase', 'styled-components', 'ag-grid'],
    year: 2025,
    status: 'archived',
    links: {},
    description:
      'Full-stack web application that provides a comprehensive inventory management system for the Institute for Therapy through the Arts (ITA), enabling therapists to submit order requests for therapeutic materials and administrators to review, approve, and track these orders with budget management capabilities and automated email notifications.',
    sigSeed: 'Inventory Management System',
  },
];
