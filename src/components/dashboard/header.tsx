"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-lg md:text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
            </div>
        </header>
    );
}
