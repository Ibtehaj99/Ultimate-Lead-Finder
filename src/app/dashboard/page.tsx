"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
    const { stats, recentActivity, searchHistory } = useApp();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Leads Found"
                    value={formatNumber(stats.totalLeads)}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    description={stats.totalLeads > 0 ? `From ${stats.activeSearches} searches` : "Start searching to find leads"}
                />
                <StatsCard
                    title="Total Searches"
                    value={formatNumber(stats.activeSearches)}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    description={stats.activeSearches > 0 ? `Avg ${Math.round(stats.totalLeads / stats.activeSearches)} leads/search` : "No searches yet"}
                />
                <StatsCard
                    title="Credits Remaining"
                    value={formatNumber(stats.creditsRemaining)}
                    icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    description="1 credit per search"
                />
                <StatsCard
                    title="Potential Revenue"
                    value={formatCurrency(stats.potentialRevenue)}
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    description="Based on $4.30/lead value"
                />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No activity yet. Search for leads to see your history here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.slice(0, 10).map((activity) => (
                                    <div key={activity.id} className="flex items-center">
                                        <div className="ml-4 space-y-1 flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-none text-card-foreground truncate">{activity.details}</p>
                                            <p className="text-sm text-muted-foreground">{activity.value ? `Found ${activity.value} leads • ` : ''}{getTimeAgo(activity.timestamp)}</p>
                                        </div>
                                        {activity.value && (
                                            <div className="ml-auto font-medium text-primary shrink-0">+{activity.value}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Platform Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {searchHistory.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Platform data will appear after your first search.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Google Maps</span>
                                    <span className="text-foreground font-bold">{stats.platformStats.google}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${stats.platformStats.google}%` }}></div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Instagram</span>
                                    <span className="text-foreground font-bold">{stats.platformStats.instagram}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${stats.platformStats.instagram}%` }}></div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Facebook</span>
                                    <span className="text-foreground font-bold">{stats.platformStats.facebook}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${stats.platformStats.facebook}%` }}></div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
    return (
        <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
