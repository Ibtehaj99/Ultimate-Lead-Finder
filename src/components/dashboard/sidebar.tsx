"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Database, Home, LayoutDashboard, LogOut, Search, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Lead Finder", href: "/dashboard/search" },
    { icon: Database, label: "Saved Leads", href: "/dashboard/saved" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card text-card-foreground">
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                    <span className="h-4 w-4 rounded-full bg-primary" />
                    LeadFinder
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-border p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
