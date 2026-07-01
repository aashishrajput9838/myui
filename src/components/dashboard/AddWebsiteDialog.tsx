"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useWebsites } from "@/hooks/useWebsites";
import { useCollections } from "@/hooks/useCollections";

export function AddWebsiteDialog() {
  const { user } = useAuth();
  const { addWebsite } = useWebsites();
  const { collections, getCollectionsOnce } = useCollections();
  
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [collectionId, setCollectionId] = useState("default");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "processing">("input");

  // Refresh collections when dialog opens
  useEffect(() => {
    if (open) {
      getCollectionsOnce();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !user) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      toast.error("Please enter a valid URL (including https://)");
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process website");
      }

      const { thumbnailUrl, title, description, faviconUrl } = result.data;

      // Save using hook
      await addWebsite({
        userId: user.uid,
        collectionId,
        websiteName: title || new URL(url).hostname,
        url,
        thumbnailUrl,
        faviconUrl: faviconUrl,
        websiteTitle: title || "",
        websiteDescription: description || "",
        tags: [],
        isFavorite: false,
      });

      toast.success("Website inspiration saved successfully!");
      handleClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
      setStep("input");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
    setCollectionId("default");
    setStep("input");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val ? handleClose() : setOpen(true)}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === "input" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Inspiration</DialogTitle>
              <DialogDescription>
                Paste a website URL to automatically capture its details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    className="pl-10"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collection">Collection</Label>
                <Select value={collectionId} onValueChange={setCollectionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Uncategorized</SelectItem>
                    {collections.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!url || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Capture"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <ProcessingState />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-6">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <Globe className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <h3 className="text-xl font-bold">Processing Website</h3>
      <p className="mt-2 text-muted-foreground">
        We're capturing the screenshot and fetching details. This usually takes a few seconds...
      </p>
    </div>
  );
}
