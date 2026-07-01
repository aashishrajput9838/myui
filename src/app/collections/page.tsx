"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import { useCollections } from "@/hooks/useCollections";
import { 
  Card, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsPage() {
  const { collections, loading, deleteCollection } = useCollections();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection? Websites in this collection will not be deleted but will be moved to 'Uncategorized'.")) {
      try {
        await deleteCollection(id);
        toast.success("Collection deleted");
      } catch (error) {
        toast.error("Failed to delete collection");
      }
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
              <p className="text-muted-foreground">
                Organize your inspirations into categories.
              </p>
            </div>
            <CreateCollectionDialog />
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : collections.length === 0 ? (
            <EmptyCollectionsState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((col) => (
                <CollectionCard 
                  key={col.id} 
                  collection={col} 
                  onDelete={() => handleDelete(col.id)} 
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function CollectionCard({ collection, onDelete }: { collection: any, onDelete: () => void }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderOpen className="h-5 w-5" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="mt-4">{collection.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {collection.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href={`/collections/${collection.id}`}>
            View Collection
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyCollectionsState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderOpen className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">No collections yet</h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Create your first collection to start organizing your website inspirations.
      </p>
      <CreateCollectionDialog />
    </div>
  );
}
