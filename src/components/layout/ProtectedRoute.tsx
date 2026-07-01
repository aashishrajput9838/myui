"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Lock } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 animate-pulse">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3 text-center w-full">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
              <div className="grid gap-4 w-full max-w-md">
                <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                <Skeleton className="aspect-[16/10] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Authentication Required</h1>
                <p className="text-muted-foreground">
                  Please sign in to access this page
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
