# Travel Blog

A modern travel blog application built with React, Vite, and Supabase. Explore destinations through an immersive UI with 3D elements, animations, and real-time weather data.

## Features

- **Featured Destinations** - Interactive carousel showcasing top travel destinations
- **Blog Gallery** - Masonry grid layout for travel blog posts
- **3D Destination Viewer** - Immersive 3D experience using Three.js
- **Weather Widget** - Real-time weather information for destinations
- **Search Functionality** - Find destinations and travel tips
- **Parallax Effects** - Smooth scrolling animations
- **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion, React Parallax, React Three Fiber
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Create production build
npm run build
```

## Project Structure

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── services/        # API and Supabase services
├── lib/             # Utility functions
└── assets/          # Static assets
```

## Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
