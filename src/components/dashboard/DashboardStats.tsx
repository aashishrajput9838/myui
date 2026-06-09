import { 
  Plus, 
  Heart,
  FolderOpen,
  Globe
} from "lucide-react";
import { Website } from "@/types";

interface DashboardStatsProps {
  websites: Website[];
  totalCollections: number;
}

export function DashboardStats({ websites, totalCollections }: DashboardStatsProps) {
  const totalFavorites = websites.filter(w => w.isFavorite).length;
  
  const recentlyAddedCount = websites.filter(w => {
    if (!w.createdAt?.toDate) return false;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return w.createdAt.toDate() > weekAgo;
  }).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Inspirations" 
        value={websites.length} 
        icon={<Globe className="h-4 w-4" />} 
      />
      <StatCard 
        title="Collections" 
        value={totalCollections} 
        icon={<FolderOpen className="h-4 w-4" />} 
      />
      <StatCard 
        title="Favorites" 
        value={totalFavorites} 
        icon={<Heart className="h-4 w-4 text-red-500" />} 
      />
      <StatCard 
        title="Recently Added" 
        value={recentlyAddedCount} 
        icon={<Plus className="h-4 w-4 text-green-500" />} 
      />
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
    </div>
  );
}
