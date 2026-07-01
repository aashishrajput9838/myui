"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { useCollection } from "@/hooks/useCollections";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebsites } from "@/hooks/useWebsites";
import { toast } from "sonner";

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { collection, websites, loading } = useCollection(resolvedParams.id);
  const { deleteWebsite, toggleFavorite } = useWebsites();

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
          <div className="flex flex-col gap-4">
            <Link href="/collections" className="flex w-fit items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {collection?.name || "Collection"}
                </h1>
                <p className="text-muted-foreground">
                  {websites.length} saved inspirations in this collection
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-xl" />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
              <h2 className="text-xl font-semibold">This collection is empty</h2>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Add websites to this collection to see them here.
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {websites.map((site) => (
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
