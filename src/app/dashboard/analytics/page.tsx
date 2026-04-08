"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";

export default function AnalyticsPage() {
    const { stats, searchHistory, savedLeads, recentActivity } = useApp();

    // Group searches by day of the week (last 7 days)
    const getDailyActivity = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts: Record<string, number> = {};
        days.forEach(d => dayCounts[d] = 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        searchHistory.forEach(search => {
            const date = new Date(search.timestamp);
            if (date >= sevenDaysAgo) {
                const dayName = days[date.getDay()];
                dayCounts[dayName] += search.leadsFound;
            }
        });

        // Reorder starting from today going back
        const today = new Date().getDay();
        const orderedDays = [];
        for (let i = 6; i >= 0; i--) {
            const idx = (today - i + 7) % 7;
            orderedDays.push({ day: days[idx], value: dayCounts[days[idx]] });
        }
        return orderedDays;
    };

    const dailyActivity = getDailyActivity();
    const maxDailyValue = Math.max(...dailyActivity.map(d => d.value), 1);

    // Conversion funnel from real data
    const totalFound = stats.totalLeads;
    const totalWithEmail = searchHistory.reduce((sum, s) => sum + s.leadsWithEmail, 0);
    const totalWithWebsite = searchHistory.reduce((sum, s) => sum + s.leadsWithWebsite, 0);
    const totalWithPhone = searchHistory.reduce((sum, s) => sum + s.leadsWithPhone, 0);

    // Top searches
    const topSearches = (() => {
        const keywordMap: Record<string, { count: number; totalLeads: number }> = {};
        searchHistory.forEach(s => {
            const key = `${s.keyword} in ${s.location}`;
            if (!keywordMap[key]) keywordMap[key] = { count: 0, totalLeads: 0 };
            keywordMap[key].count++;
            keywordMap[key].totalLeads += s.leadsFound;
        });
        return Object.entries(keywordMap)
            .map(([query, data]) => ({ query, ...data }))
            .sort((a, b) => b.totalLeads - a.totalLeads)
            .slice(0, 5);
    })();

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
                <p className="text-muted-foreground">Insights from your actual lead generation searches.</p>
            </div>

            {searchHistory.length === 0 ? (
                <Card className="border-border bg-card">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <svg className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-lg font-medium">No search data yet</p>
                        <p className="text-sm">Start searching for leads to see your analytics here.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <Card className="border-border bg-card">
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-foreground">{formatNumber(totalFound)}</div>
                                <div className="text-xs text-muted-foreground">Total Leads Found</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-card">
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-foreground">{searchHistory.length}</div>
                                <div className="text-xs text-muted-foreground">Total Searches</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-card">
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-foreground">{formatNumber(totalWithEmail)}</div>
                                <div className="text-xs text-muted-foreground">Leads with Email</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-card">
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-foreground">{totalFound > 0 ? Math.round((totalWithEmail / totalFound) * 100) : 0}%</div>
                                <div className="text-xs text-muted-foreground">Email Discovery Rate</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                        {/* Bar Chart */}
                        <Card className="lg:col-span-2 border-border bg-card">
                            <CardHeader>
                                <CardTitle>Leads Found (Last 7 Days)</CardTitle>
                                <CardDescription>Daily lead generation volume</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-[200px] items-end justify-between gap-2 pt-4">
                                    {dailyActivity.map((item, index) => (
                                        <div key={`${item.day}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                                            <div
                                                className="w-full rounded-t bg-primary/20 transition-all hover:bg-primary/50 relative group"
                                                style={{ height: `${item.value > 0 ? Math.max((item.value / maxDailyValue) * 100, 5) : 2}%` }}
                                            >
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow transition-opacity whitespace-nowrap">
                                                    {item.value} leads
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{item.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Platform Distribution */}
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle>Platform Distribution</CardTitle>
                                <CardDescription>Where your leads come from</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Google Maps</span>
                                        <span className="text-muted-foreground">{stats.platformStats.google}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div
                                            className="h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500"
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
                                            className="h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-500"
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
                                            className="h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
                                            style={{ width: `${stats.platformStats.facebook}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Quality Funnel */}
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Data Quality Breakdown</CardTitle>
                            <CardDescription>Contact information coverage across all your searches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <div className="text-2xl font-bold">{formatNumber(totalFound)}</div>
                                    <div className="text-xs text-muted-foreground">Total Found</div>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <div className="text-2xl font-bold">{formatNumber(totalWithWebsite)}</div>
                                    <div className="text-xs text-muted-foreground">Have Website</div>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <div className="text-2xl font-bold">{formatNumber(totalWithEmail)}</div>
                                    <div className="text-xs text-muted-foreground">Have Email</div>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <div className="text-2xl font-bold">{formatNumber(totalWithPhone)}</div>
                                    <div className="text-xs text-muted-foreground">Have Phone</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Searches */}
                    {topSearches.length > 0 && (
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle>Top Searches</CardTitle>
                                <CardDescription>Your most productive search queries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topSearches.map((search, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                                                <span className="text-sm font-medium text-foreground">{search.query}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{search.count} {search.count === 1 ? 'search' : 'searches'}</span>
                                                <span className="font-semibold text-primary">{search.totalLeads} leads</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
