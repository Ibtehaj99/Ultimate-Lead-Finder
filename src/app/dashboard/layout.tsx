"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AppProvider } from "@/context/AppContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AppProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex flex-1 flex-col min-h-0 min-w-0">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AppProvider>
    );
}
