"use client";

import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  FolderOpen, 
  Heart, 
  Calendar,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Lock,
  CheckCircle2
} from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import { useCollections } from "@/hooks/useCollections";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { websites, loading: websitesLoading } = useWebsites();
  const { collections, loading: collectionsLoading } = useCollections();

  if (!user) return null;

  const totalFavorites = websites.filter(w => w.isFavorite).length;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your activity.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-green-500 border-3 border-background flex items-center justify-center shadow-lg">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <Badge className="h-5 px-1.5 text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user.createdAt)}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure Google Sign-In</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatItem 
                  icon={<Globe className="h-5 w-5 text-blue-500" />} 
                  label="Total Saves" 
                  value={websites.length} 
                  loading={websitesLoading}
                />
                <StatItem 
                  icon={<FolderOpen className="h-5 w-5 text-orange-500" />} 
                  label="Collections" 
                  value={collections.length} 
                  loading={collectionsLoading}
                />
                <StatItem 
                  icon={<Heart className="h-5 w-5 text-red-500" />} 
                  label="Favorites" 
                  value={totalFavorites} 
                  loading={websitesLoading}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your personal details are protected and secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-300">
                    <ShieldCheck className="h-5 w-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Your account is protected with Google Sign-In</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Your data is encrypted and private</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Firebase security rules enforce access control</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function StatItem({ icon, label, value, loading }: { icon: React.ReactNode, label: string, value: number, loading?: boolean }) {
  return (
    <Card className="overflow-hidden border-muted hover:border-primary/20 transition-all">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>
        {loading ? (
          <div className="h-9 w-14 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
