"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  User, 
  Settings,
  Heart
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: ROUTES.DASHBOARD,
      active: pathname === ROUTES.DASHBOARD,
    },
    {
      label: "Collections",
      icon: FolderOpen,
      href: ROUTES.COLLECTIONS,
      active: pathname.startsWith(ROUTES.COLLECTIONS),
    },
    {
      label: "Favorites",
      icon: Heart,
      href: ROUTES.FAVORITES,
      active: pathname === ROUTES.FAVORITES,
    },
    {
      label: "Profile",
      icon: User,
      href: ROUTES.PROFILE,
      active: pathname === ROUTES.PROFILE,
    },
    {
      label: "Settings",
      icon: Settings,
      href: ROUTES.SETTINGS,
      active: pathname === ROUTES.SETTINGS,
    },
  ];

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      <div className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
