# AI-CONTEXT: MyUI Project

This document provides a comprehensive, up-to-date overview of the MyUI project for AI agents. It covers the architecture, tech stack, database schema, and development conventions.

## 1. Project Overview
**MyUI** is a premium website inspiration gallery. It allows users to:
- Save website URLs.
- Automatically generate screenshots using Puppeteer.
- Extract site metadata (Title, Description, Favicon).
- Organize inspirations into themed Collections.
- Search and filter saved websites.
- Favorite inspirations for quick access.

## 2. Tech Stack
- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI (Radix UI)
- **Icons**: Lucide React
- **Backend/DB**: Firebase (Auth, Firestore)
- **Image Storage**: Cloudinary (Free Tier)
- **Automation**: Puppeteer (Running in Next.js API route)
- **Notifications**: Sonner

## 3. Core Architecture

### Service Layer (`/src/services`)
Decouples UI from data fetching logic.
- `firestore.ts`: Centralized Firestore operations (CRUD for websites and collections).
- `screenshot.ts`: Encapsulates Puppeteer screenshot logic and Cloudinary upload.

### Custom Hooks (`/src/hooks`)
Encapsulate business logic and data subscription.
- `useWebsites.ts`: Real-time subscription to user's websites, plus search filtering.
- `useCollections.ts`: Real-time subscription to user's collections, and specific collection details.

### Context (`/src/context`)
- `AuthContext.tsx`: Manages Firebase Authentication state (Google login).

### Utilities (`/src/lib`)
- `constants.ts`: Application-wide constants (routes, config, limits).
- `firebase.ts`: Firebase initialization.
- `utils.ts`: Helper functions (`cn()`, `formatDate()`, `extractHostname()`, `truncateText()`).
- `validators.ts`: Input validation functions (URLs, collection names).
- `errors.ts`: Custom error classes and handling utilities.

## 4. Database Schema (Firestore)

### `users` (Collection)
```typescript
{
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp | FieldValue;
}
```

### `collections` (Collection)
```typescript
{
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Timestamp | FieldValue;
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
  thumbnailUrl: string; // URL to Cloudinary image
  faviconUrl: string;
  websiteTitle: string;
  websiteDescription: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Timestamp | FieldValue;
}
```

## 5. API Routes

### `POST /api/screenshot`
- **Input**: `{ url: string }`
- **Process**: Uses ScreenshotService -> Launches Puppeteer -> Crawls URL -> Takes Screenshot -> Uploads to Cloudinary -> Returns metadata.
- **Location**: `src/app/api/screenshot/route.ts`

## 6. Development Conventions
- **Component Structure**: Use `use client` only when necessary.
- **Styling**: Prefer Tailwind utility classes. Use `cn()` (from `lib/utils.ts`) for conditional classes.
- **State Management**: Prefer local state and custom hooks over global state managers unless necessary.
- **Firebase**: Always use `FirestoreService` instead of calling `firebase/firestore` directly in components.
- **Responsive**: Mobile-first design. Use `container mx-auto` for layout wrapping.
- **Type Safety**: Always use TypeScript types from `src/types` (user, collection, website).

## 7. Security
- **Firestore Rules**: Implemented in `firestore.rules`. Users can only access documents where `userId == request.auth.uid`.
- **Environment Variables**: Managed via `.env.local` (see `.env.local.example` for template). Required variables:
  - Firebase Config: `NEXT_PUBLIC_FIREBASE_*`
  - Cloudinary Config: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## 8. Directory Map
- `/src/app`: Next.js App Router pages and API endpoints.
- `/src/components/ui`: Atomic Shadcn components.
- `/src/components/dashboard`: Feature-specific components for the app.
- `/src/components/collections`: Collection management components.
- `/src/components/layout`: Shared layout components (Navbar, Sidebar, ThemeToggle, DashboardLayout).
- `/src/hooks`: Reusable logic hooks.
- `/src/services`: API and Database services.
- `/src/types`: Global TypeScript definitions (separated into individual type files for clarity).
- `/src/lib`: Utilities, constants, validators, and error handlers.
