"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { useWebsites } from "@/hooks/useWebsites";
import { Heart, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AddWebsiteDialog } from "@/components/dashboard/AddWebsiteDialog";

export default function FavoritesPage() {
  const { websites, loading, deleteWebsite, toggleFavorite } = useWebsites();
  
  const favoriteWebsites = websites.filter(site => site.isFavorite);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inspiration?")) {
      try {
        await deleteWebsite(id);
        toast.success("Website deleted");
      } catch (error) {
        toast.error("Failed to delete website");
      }
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(id, isFavorite);
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
            <p className="text-muted-foreground">
              Your most loved website inspirations.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : favoriteWebsites.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold">No favorites yet</h2>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Mark websites as favorite to see them here for quick access.
              </p>
              <AddWebsiteDialog />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteWebsites.map((site) => (
                <WebsiteCard 
                  key={site.id} 
                  website={site} 
                  onDelete={handleDelete} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
