"use client";

import { Website } from "@/types";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Heart, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Calendar,
  Folder
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onEdit?: (website: Website) => void;
}

export function WebsiteCard({ 
  website, 
  onDelete, 
  onToggleFavorite,
  onEdit 
}: WebsiteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = website.createdAt?.seconds 
    ? format(new Date(website.createdAt.seconds * 1000), "MMM d, yyyy")
    : "Recently saved";

  return (
    <Card 
      className="group overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={website.thumbnailUrl}
          alt={website.websiteName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}>
          <Button size="sm" variant="secondary" asChild>
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit
            </a>
          </Button>
          <Button 
            size="sm" 
            variant={website.isFavorite ? "default" : "secondary"}
            onClick={() => onToggleFavorite?.(website.id, !website.isFavorite)}
          >
            <Heart className={cn("h-4 w-4", website.isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {website.faviconUrl && typeof website.faviconUrl === "string" && (
              <img 
                src={website.faviconUrl} 
                alt="" 
                className="h-4 w-4 rounded-sm"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <h3 className="truncate font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {website.websiteName}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(website)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(website.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {new URL(website.url).hostname}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1">
          <Folder className="h-3 w-3" />
          {website.collectionId === "default" ? "General" : "Collection"}
        </div>
      </CardFooter>
    </Card>
  );
}
