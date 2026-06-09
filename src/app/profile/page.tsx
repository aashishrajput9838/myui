"use client";

import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  FolderOpen, 
  Heart, 
  Calendar,
  Mail,
  User as UserIcon
} from "lucide-react";
import { format } from "date-fns";
import { useWebsites } from "@/hooks/useWebsites";
import { useCollections } from "@/hooks/useCollections";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { websites, loading: websitesLoading } = useWebsites();
  const { collections, loading: collectionsLoading } = useCollections();

  if (!user) return null;

  const totalFavorites = websites.filter(w => w.isFavorite).length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {user.createdAt?.seconds ? format(new Date(user.createdAt.seconds * 1000), "MMMM yyyy") : "Recently"}
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
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details and account settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatItem({ icon, label, value, loading }: { icon: React.ReactNode, label: string, value: number, loading?: boolean }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        {loading ? (
          <div className="h-8 w-12 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
      </CardContent>
    </Card>
  );
}
