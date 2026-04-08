"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar, Filter, Globe, LayoutGrid, List, Mail, MapPin, MoreHorizontal, Search as SearchIcon, Server, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Lead {
    id: number;
    name: string;
    type: string;
    location: string;
    platform: string;
    website: string | null;
    status: string;
    email: string | null;
    phone: string | null;
}

export default function SearchPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [isSearching, setIsSearching] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearching(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const keyword = formData.get("keyword") as string;
        const location = formData.get("location") as string;
        const platform = formData.get("platform") as string;

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyword, location, platform }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            setLeads(data.leads || []);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to fetch leads. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Lead Finder</h2>
                    <p className="text-muted-foreground">Search for businesses across multiple platforms.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setViewMode("list")} className={cn(viewMode === "list" ? "bg-secondary text-foreground" : "bg-transparent border-border")}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode("grid")} className={cn(viewMode === "grid" ? "bg-secondary text-foreground" : "bg-transparent border-border")}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search Filters */}
            <Card className="border-border bg-card">
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Keyword / Niche</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input name="keyword" placeholder="e.g. Dentist, Gym, Lawyer" className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input name="location" placeholder="City, State or Zip" className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Platform</label>
                            <select name="platform" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="all">All Platforms</option>
                                <option value="google">Google Maps</option>
                                {/* <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option> */}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Website Status</label>
                            <select className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="all">Any Status</option>
                                <option value="no-website">No Website</option>
                                <option value="old-website">Old Website (&lt; 2020)</option>
                                <option value="revamp-needed">Needs Revamp</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold text-primary-foreground" disabled={isSearching}>
                                {isSearching ? "Searching..." : "Find Leads"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20 text-sm">
                    {error}
                </div>
            )}

            {/* Results */}
            <div className="flex-1 overflow-auto rounded-md border border-border bg-card/30 p-1">
                {leads.length === 0 && !isSearching && !error ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                        <SearchIcon className="h-12 w-12 mb-4 opacity-20" />
                        <p>No leads found. Try searching for a different keyword or location.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === "list" ? (
                            <div className="w-full text-left text-sm text-muted-foreground">
                                <div className="sticky top-0 z-10 grid grid-cols-8 gap-4 border-b border-border bg-muted/50 px-4 py-3 font-medium text-foreground">
                                    <div className="col-span-2">Business Name</div>
                                    <div>Platform</div>
                                    <div>Website</div>
                                    <div>Status</div>
                                    <div>Phone</div>
                                    <div>Email</div>
                                    <div className="text-right">Actions</div>
                                </div>
                                {leads.map((lead) => (
                                    <div key={lead.id} className="grid grid-cols-8 gap-4 border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors items-center">
                                        <div className="col-span-2">
                                            <div className="font-medium text-foreground">{lead.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.location}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("inline-block h-2 w-2 rounded-full", lead.platform.includes("Google") ? "bg-blue-500" : "bg-pink-500")}></span>
                                            {lead.platform}
                                        </div>
                                        <div>
                                            {lead.website ? (
                                                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" className="text-primary hover:underline flex items-center gap-1 truncate max-w-[120px]">
                                                    <Globe className="h-3 w-3 shrink-0" /> {lead.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic">No Website</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                                lead.status.includes("No") || lead.status.includes("Old")
                                                    ? "bg-red-400/10 text-red-500 ring-red-400/20"
                                                    : "bg-green-400/10 text-green-500 ring-green-400/20"
                                            )}>
                                                {lead.status.includes("No") || lead.status.includes("Old") ? <ShieldAlert className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                {lead.status}
                                            </span>
                                        </div>
                                        <div>
                                            {lead.phone ? (
                                                <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary transition-colors text-xs">{lead.phone}</a>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </div>
                                        <div>
                                            {lead.email ? (
                                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1 truncate max-w-[150px] text-xs">
                                                    <Mail className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{lead.email}</span>
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Not found</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                {leads.map((lead) => (
                                    <Card key={lead.id} className="border-border bg-card hover:border-primary/50 transition-all">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg text-foreground">{lead.name}</CardTitle>
                                                    <CardDescription className="text-muted-foreground">{lead.type}</CardDescription>
                                                </div>
                                                <span className={cn("inline-block h-2 w-2 rounded-full", lead.platform.includes("Google") ? "bg-blue-500" : "bg-pink-500")}></span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {lead.location}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {lead.website ? (
                                                        <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" className="text-primary flex items-center gap-2 truncate hover:underline"><Globe className="h-4 w-4 shrink-0" /> <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span></a>
                                                    ) : (
                                                        <span className="text-red-500 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> No Website</span>
                                                    )}
                                                </div>
                                                {lead.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary transition-colors">{lead.phone}</a>
                                                    </div>
                                                )}
                                                {lead.email ? (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-primary shrink-0" />
                                                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline truncate text-xs">{lead.email}</a>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60 italic">
                                                        <Mail className="h-4 w-4 shrink-0" /> Email not found
                                                    </div>
                                                )}
                                            </div>
                                            <Button className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-foreground">View Details</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
