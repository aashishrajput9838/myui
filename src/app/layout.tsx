import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

import { APP_CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.NAME} - ${APP_CONFIG.DESCRIPTION}`,
  description: "Build your personal library of beautiful websites, UI patterns, and design inspirations.",
  keywords: ["design", "ui", "ux", "inspiration", "web design", "developer tools"],
  authors: [{ name: "myui Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_CONFIG.URL,
    title: `${APP_CONFIG.NAME} - ${APP_CONFIG.DESCRIPTION}`,
    description: "Build your personal library of beautiful websites, UI patterns, and design inspirations.",
    siteName: APP_CONFIG.NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.NAME} - ${APP_CONFIG.DESCRIPTION}`,
    description: "Build your personal library of beautiful websites, UI patterns, and design inspirations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
