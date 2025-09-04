// import mp_snapshot from '@/assets/mp_snapshot.png';
// import highline_snapshot from '@/assets/highline_snapshot.png';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'The Money Personality',
    description:
      'Full-stack web application that provides a comprehensive money personality assessment platform that provides users with detailed personality-based financial insights through an interactive quiz system, complete with PDF report generation and advisor/client management capabilities.',
    image: null,
    liveUrl: 'https://www.themoneypersonality.com/',
    technologies: ['react', 'typescript', 'python', 'flask', 'supabase', 'stripe'],
  },
  // Highline - Alternative Investment Platform
  // A full-stack web application enabling accredited investors to discover and express interest in private equity, venture capital, and real estate deals, with comprehensive admin tools for deal management and investor onboarding.
  // Key Achievements:
  // Built a responsive investor portal with real-time deal aggregation (spots filled, committed amounts) and mobile-first design featuring sliding panels and hamburger navigation
  // Implemented secure file upload system with signed URLs for private storage, enabling company logo and deal document management with automatic CORS handling
  // Developed comprehensive admin dashboard with user approval workflows, deal status management (draft/active/closed), and email notification system using Brevo API with React Email templates
  // Tech Stack:
  // Frontend: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router DOM
  // Backend: Node.js, Express.js, TypeScript, Zod validation, Supabase (Auth/Database/Storage)
  // Infrastructure: Vercel (frontend), Heroku (backend), Redis (sessions), Brevo (email)
  // Security: HttpOnly cookies, CSRF protection, Row Level Security (RLS), rate limiting
  {
    id: '2',
    title: 'Highline Alts',
    description:
      'Full-stack web application enabling accredited investors to discover and express interest in private equity, venture capital, and real estate deals, with comprehensive admin tools for deal management and investor onboarding.',
    image: null,
    liveUrl: 'https://highline-frontend.vercel.app/',
    technologies: ['react', 'typescript', 'express', 'node', 'supabase', 'resend', 'tailwind'],
  },
  // Project Overview
  // Full-stack web application that provides a comprehensive inventory management system for the Institute for Therapy through the Arts (ITA), enabling therapists to submit order requests for therapeutic materials and administrators to review, approve, and track these orders with budget management capabilities and automated email notifications.
  // Key Frontend Achievements:
  // Built a responsive role-based dashboard system with separate interfaces for therapists and administrators, featuring real-time order tracking with status updates (pending/approved/denied/arrived/ready), budget visualization across multiple programs, and comprehensive user management with approval workflows
  // Developed an intuitive order management interface using AG Grid with advanced filtering, sorting, and export capabilities (CSV/XLSX), complete with modal-based forms for order creation, status changes, and budget updates, all integrated with Supabase authentication and session management
  // Implemented comprehensive user experience features including Google OAuth integration, password reset functionality, role-based route protection, real-time form validation, and automated email notifications for order status changes using Resend API, with responsive design using styled-components and modern React patterns
  {
    id: '3',
    title: 'Inventory Management System',
    description:
      'Full-stack web application that provides a comprehensive inventory management system for the Institute for Therapy through the Arts (ITA), enabling therapists to submit order requests for therapeutic materials and administrators to review, approve, and track these orders with budget management capabilities and automated email notifications.',
    image: null,
    technologies: ['react', 'javascript', 'node', 'postgresql', 'supabase', 'styled components', 'AG Grid'],
  },
  // Project Overview
  // Full-stack web application that provides a comprehensive Spotify music data visualization platform, allowing users to explore songs, artists, and albums through interactive radar-like graphs and user-friendly interfaces, complete with user authentication, admin dashboard, and bug reporting system.
  // Key Achievements
  // Built a responsive music visualization platform with real-time Spotify API integration, featuring interactive radar charts for song audio features (danceability, energy, valence, etc.) using matplotlib and custom triangulation algorithms with Spotify's brand styling
  // Implemented secure user authentication system with session management, password hashing, and role-based access control (admin/user) with comprehensive user registration and login workflows
  // Developed comprehensive admin dashboard with user management, bug report tracking, and support ticket system, complete with cache-control headers and mobile-responsive Bootstrap UI design
  // Tech Stack
  // Backend:
  // Python 3.x
  // Flask 3.0.3 (Web Framework)
  // Flask-Session 0.8.0 (Session Management)
  // SQLite (Database)
  // Werkzeug (Security & Utilities)
  // Frontend:
  // HTML5/CSS3
  // JavaScript (ES6+)
  // Bootstrap 5 (UI Framework)
  // Spotify Web API (Music data, audio features, artist/album information)
  // Client credentials flow for API authentication
  // Development & Deployment:
  // WSGI (Web Server Gateway Interface)
  // Click (CLI commands)
  // Jinja2 (Template Engine)
  // File-based session storage
  // Instance-based configuration management
  {
    id: '4',
    title: '!stats.fm',
    description:
      'Full-stack web application that provides a comprehensive Spotify music data visualization platform, allowing users to explore songs, artists, and albums through interactive radar-like graphs and user-friendly interfaces, complete with user authentication, admin dashboard, and bug reporting system.',
    image: null,
    liveUrl: 'https://bbrockbrown2.pythonanywhere.com/',
    githubUrl: 'https://github.com/bbrockbrown/spotify_visualization_dataV2',
    technologies: ['javascript', 'bootstrap', 'python', 'flask', 'sqlite', 'spotify web api'],
  },
];
