# <p align="center">✨ MyUI - Premium Website Inspiration Gallery</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Firebase-v12-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Puppeteer-Latest-green?style=for-the-badge&logo=puppeteer" alt="Puppeteer" />
</p>

---

**MyUI** is a sophisticated platform designed for designers and developers to capture, organize, and curate website inspirations effortlessly. Built with a focus on speed, performance, and a premium user experience.

> [!TIP]
> Just paste a URL, and let MyUI handle the rest—from high-resolution full-page screenshots to metadata extraction.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 📸 **Auto-Capture** | Automatically generate high-quality full-page screenshots using Puppeteer. |
| 🏷️ **Metadata Extraction** | Intelligent fetching of page titles, descriptions, and favicons. |
| 📂 **Smart Collections** | Organize your inspirations into custom themed folders for easy access. |
| ❤️ **Favorites** | One-click favoriting to keep your top-tier inspirations front and center. |
| 🔍 **Real-time Search** | Instant global search across website names, URLs, and descriptions. |
| 🌗 **Dark Mode** | A beautiful, premium interface with support for both Light and Dark themes. |
| 📱 **Responsive** | A mobile-first approach ensuring a seamless experience across all devices. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks & Context API

### Backend & Infrastructure
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google & Email)
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)
- **Storage**: [Firebase Storage](https://firebase.google.com/products/storage)
- **Screenshot Engine**: [Puppeteer](https://pptr.dev/) (Headless Chrome)

---

## 🏗️ Architecture

MyUI follows a professional service-oriented architecture to ensure maintainability:

- **Service Layer**: Decoupled Firestore logic in `src/services/`.
- **Custom Hooks**: Reusable business logic and data subscriptions in `src/hooks/`.
- **API Routes**: Serverless functions for heavy operations like Puppeteer in `src/app/api/`.
- **Atomic Components**: Reusable UI elements built on top of Radix UI primitives.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- A Firebase project with Auth, Firestore, and Storage enabled

### 1. Installation
```bash
git clone https://github.com/your-username/myui.com.git
cd myui.com
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security Rules

Ensure your Firestore rules are deployed for data isolation:
```javascript
match /websites/{websiteId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
}
```
*(Full rules available in `firestore.rules`)*

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the MyUI Team
</p>
