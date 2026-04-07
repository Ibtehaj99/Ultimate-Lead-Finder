"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";

export default function AnalyticsPage() {
    const { stats, recentActivity } = useApp();

    const maxLeads = 200; // Mock max for bars

    // Group activity by day (mock)
    const dailyActivity = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 80 },
        { day: 'Wed', value: 120 },
        { day: 'Thu', value: 60 },
        { day: 'Fri', value: 95 },
        { day: 'Sat', value: 15 },
        { day: 'Sun', value: 10 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into your lead generation performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 border-border bg-card">
                    <CardHeader>
                        <CardTitle>Lead Generation Overview</CardTitle>
                        <CardDescription>Leads found over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[200px] items-end justify-between gap-2 pt-4">
                            {dailyActivity.map((item) => (
                                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t bg-primary/20 transition-all hover:bg-primary/50 relative group"
                                        style={{ height: `${(item.value / 150) * 100}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow transition-opacity">
                                            {item.value}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Platform Distribution</CardTitle>
                        <CardDescription>Where your leads are coming from</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Google Maps</span>
                                <span className="text-muted-foreground">{stats.platformStats.google}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                    className="h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${stats.platformStats.google}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Instagram</span>
                                <span className="text-muted-foreground">{stats.platformStats.instagram}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                    className="h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                    style={{ width: `${stats.platformStats.instagram}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Facebook</span>
                                <span className="text-muted-foreground">{stats.platformStats.facebook}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                    className="h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${stats.platformStats.facebook}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>From search to qualified lead</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg border bg-card p-4 text-center">
                            <div className="text-2xl font-bold">12,450</div>
                            <div className="text-xs text-muted-foreground">Total Found</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4 text-center">
                            <div className="text-2xl font-bold">5,230</div>
                            <div className="text-xs text-muted-foreground">Verified</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4 text-center">
                            <div className="text-2xl font-bold">1,120</div>
                            <div className="text-xs text-muted-foreground">Contacted</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4 text-center">
                            <div className="text-2xl font-bold">340</div>
                            <div className="text-xs text-muted-foreground">Qualified</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
