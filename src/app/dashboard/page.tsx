"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { AddWebsiteDialog } from "@/components/dashboard/AddWebsiteDialog";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useAuth } from "@/context/AuthContext";
import { useWebsites, useFilteredWebsites } from "@/hooks/useWebsites";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const { websites, loading: websitesLoading, deleteWebsite, toggleFavorite } = useWebsites();
  const { collections, loading: collectionsLoading } = useCollections();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredWebsites = useFilteredWebsites(websites, searchQuery);
  const isLoading = websitesLoading || collectionsLoading;

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
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! You have {websites.length} saved inspirations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AddWebsiteDialog />
            </div>
          </div>

          {/* Stats */}
          <DashboardStats 
            websites={websites} 
            totalCollections={collections.length} 
          />

          {/* Filters & Search */}
          <DashboardFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold">
                {searchQuery ? "No results found" : "Start your collection"}
              </h2>
              <p className="mb-6 max-w-sm text-muted-foreground">
                {searchQuery 
                  ? `We couldn't find anything matching "${searchQuery}".`
                  : "Save your first website inspiration to see it here on your dashboard."}
              </p>
              {!searchQuery && <AddWebsiteDialog />}
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col gap-4"
            }>
              {filteredWebsites.map((site) => (
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
