"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Trash, ExternalLink, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function SavedLeadsPage() {
    const { savedLeads, removeSavedLead } = useApp();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'default';
            case 'Contacted': return 'secondary';
            case 'Qualified': return 'outline';
            case 'Converted': return 'destructive';
            default: return 'default';
        }
    };

    const exportToCSV = () => {
        if (savedLeads.length === 0) return;
        const headers = ['Business Name', 'Platform', 'Location', 'Email', 'Phone', 'Website', 'Status', 'Added At'];
        const rows = savedLeads.map(lead => [
            lead.businessName,
            lead.platform,
            lead.location,
            lead.email || '',
            lead.phone || '',
            lead.website || '',
            lead.status,
            new Date(lead.addedAt).toLocaleDateString(),
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Saved Leads</h2>
                    <p className="text-muted-foreground">All leads from your searches are automatically saved here.</p>
                </div>
                <Button onClick={exportToCSV} disabled={savedLeads.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV ({savedLeads.length})
                </Button>
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-card-foreground">All Leads ({savedLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {savedLeads.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-lg font-medium">No saved leads yet</p>
                            <p className="text-sm mt-1">Search for leads and they&apos;ll automatically appear here.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table - hidden on mobile */}
                            <div className="hidden md:block">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Business Name</th>
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Platform</th>
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Location</th>
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th>
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Phone</th>
                                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedLeads.map((lead) => (
                                            <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                                <td className="py-3 px-2">
                                                    <span className="font-medium text-foreground">{lead.businessName}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <Badge variant="outline">{lead.platform}</Badge>
                                                </td>
                                                <td className="py-3 px-2 text-muted-foreground">{lead.location}</td>
                                                <td className="py-3 px-2">
                                                    {lead.email ? (
                                                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline text-xs truncate max-w-[150px] block">
                                                            {lead.email}
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {lead.phone ? (
                                                        <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary text-xs">
                                                            {lead.phone}
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <Badge variant={getStatusColor(lead.status) as "default" | "secondary" | "outline" | "destructive"}>
                                                        {lead.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {lead.website && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSavedLead(lead.id)}>
                                                            <Trash className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile card list */}
                            <div className="md:hidden space-y-3">
                                {savedLeads.map((lead) => (
                                    <div key={lead.id} className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-foreground">{lead.businessName}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <MapPin className="h-3 w-3" /> {lead.location}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge variant={getStatusColor(lead.status) as "default" | "secondary" | "outline" | "destructive"} className="text-xs">
                                                    {lead.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSavedLead(lead.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                            <Badge variant="outline" className="text-xs">{lead.platform}</Badge>
                                            {lead.website && (
                                                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                                    <Globe className="h-3 w-3" /> Website
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
                                            {lead.email ? (
                                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {lead.email}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> No email
                                                </span>
                                            )}
                                            {lead.phone && (
                                                <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {lead.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
