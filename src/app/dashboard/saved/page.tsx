"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Trash, ExternalLink, Mail, Phone } from "lucide-react";

export default function SavedLeadsPage() {
    const { leads, deleteLead } = useApp();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'default';
            case 'Contacted': return 'secondary';
            case 'Qualified': return 'outline';
            case 'Converted': return 'destructive'; // Just for variety, maybe green in real app
            default: return 'default';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Saved Leads</h2>
                    <p className="text-muted-foreground">Manage and track your potential clients.</p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-card-foreground">All Leads ({leads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business Name</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No saved leads yet. Start a search to find some!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{lead.businessName}</span>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                                                    {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{lead.platform}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{lead.location}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(lead.status) as any}>{lead.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {lead.website && (
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={lead.website} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
