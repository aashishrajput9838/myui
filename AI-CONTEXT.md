# AI-CONTEXT: MyUI Project

This document provides a comprehensive overview of the MyUI project for AI agents. It covers the architecture, tech stack, database schema, and development conventions.

## 1. Project Overview
**MyUI** is a premium website inspiration gallery. It allows users to:
- Save website URLs.
- Automatically generate full-page screenshots using Puppeteer.
- Extract site metadata (Title, Description, Favicon).
- Organize inspirations into themed Collections.
- Search and filter saved websites.
- Favorite inspirations for quick access.

## 2. Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/DB**: Firebase (Auth, Firestore, Storage)
- **Automation**: Puppeteer (Running in Next.js API route)

## 3. Core Architecture

### Service Layer (`/src/services`)
Decouples UI from data fetching logic.
- `firestore.ts`: Centralized Firestore operations (CRUD for websites and collections).

### Custom Hooks (`/src/hooks`)
Encapsulate business logic and data subscription.
- `useWebsites.ts`: Real-time subscription to user's websites.
- `useCollections.ts`: Real-time subscription to user's collections.

### Context (`/src/context`)
- `AuthContext.tsx`: Manages Firebase Authentication state (Google & Email login).

### Utilities (`/src/lib`)
- `puppeteer.ts`: Optimized browser launching and page processing.
- `constants.ts`: Application-wide constants (routes, config).
- `firebase.ts`: Firebase initialization.

## 4. Database Schema (Firestore)

### `users` (Collection)
```typescript
{
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
}
```

### `collections` (Collection)
```typescript
{
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Timestamp;
}
```

### `websites` (Collection)
```typescript
{
  id: string;
  userId: string;
  collectionId: string; // "default" or collection ID
  websiteName: string;
  url: string;
  thumbnailUrl: string; // URL to Firebase Storage image
  faviconUrl: string;
  websiteTitle: string;
  websiteDescription: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Timestamp;
}
```

## 5. API Routes

### `POST /api/screenshot`
- **Input**: `{ url: string }`
- **Process**: Launches Puppeteer -> Crawls URL -> Takes Screenshot -> Uploads to Firebase Storage -> Returns metadata.
- **Location**: `src/app/api/screenshot/route.ts`

## 6. Development Conventions
- **Component Structure**: Use `use client` only when necessary.
- **Styling**: Prefer Tailwind utility classes. Use `cn()` for conditional classes.
- **State Management**: Prefer local state and custom hooks over global state managers unless necessary.
- **Firebase**: Always use the `FirestoreService` instead of calling `firebase/firestore` directly in components.
- **Responsive**: Mobile-first design. Use `container mx-auto` for layout wrapping.

## 7. Security
- **Firestore Rules**: Implemented in `firestore.rules`. Users can only access documents where `userId == request.auth.uid`.
- **Environment Variables**: Managed via `.env.local` (see `README.md`).

## 8. Directory Map
- `/src/app`: Routes and API endpoints.
- `/src/components/ui`: Atomic Shadcn components.
- `/src/components/dashboard`: Feature-specific components for the app.
- `/src/components/layout`: Shared layout components (Navbar, Sidebar).
- `/src/hooks`: Reusable logic.
- `/src/services`: API and Database services.
- `/src/types`: Global TypeScript definitions.
