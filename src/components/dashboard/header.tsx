"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-8">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-4">
                <ThemeToggle />
            </div>
        </header>
    );
}
