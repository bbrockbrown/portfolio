import type { Project } from './types';

// Authored newest-first; the list renders in this order and numbers each row by
// position (01, 02, …). `sigSeed` is pinned to each project's current name so a
// future rename can't silently change its waveform mark.
export const projects: Project[] = [
  {
    id: 'apple-siri',
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
    id: 'money-personality',
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
    id: 'highline-alts',
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
    id: 'inventory-management',
    name: 'Customized Inventory Management System',
    category: 'TOOL',
    tech: ['react', 'javascript', 'node', 'postgresql', 'supabase', 'styled-components', 'ag-grid', 'figma'],
    year: 2025,
    status: 'archived',
    links: {},
    description:
      'Web-based inventory system built with ITA Chicago (Institute for Therapy through the Arts) to replace their Excel workflow: therapists check items in and out and request materials, while admins approve purchase requests with budget tracking and email notifications and see where every item is. React/JavaScript interfaces designed in Figma, on Supabase Postgres with RESTful APIs and auth.',
    sigSeed: 'Inventory Management System',
  },
  {
    id: 'statsfm',
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
];
