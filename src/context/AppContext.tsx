"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
export interface Lead {
    id: string;
    businessName: string;
    platform: 'Google Maps' | 'Instagram' | 'Facebook';
    location: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
    addedAt: string;
}

export interface Activity {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    value?: number;
}

export interface UserProfile {
    name: string;
    email: string;
    company: string;
    role: string;
    plan: 'Starter' | 'Pro' | 'Agency';
    avatarUrl?: string;
}

export interface Settings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    darkMode: boolean; // Managed by next-themes usually, but kept here for completeness
    apiKey: string;
}

interface AppContextType {
    stats: {
        totalLeads: number;
        activeSearches: number;
        creditsRemaining: number;
        potentialRevenue: number;
        platformStats: {
            google: number;
            instagram: number;
            facebook: number;
        };
    };
    leads: Lead[];
    recentActivity: Activity[];
    user: UserProfile;
    settings: Settings;
    // Actions
    addLead: (lead: Omit<Lead, 'id' | 'addedAt'>) => void;
    updateLeadStatus: (id: string, status: Lead['status']) => void;
    deleteLead: (id: string) => void;
    updateUser: (data: Partial<UserProfile>) => void;
    updateSettings: (data: Partial<Settings>) => void;
    spendCredits: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_LEADS: Lead[] = [
    { id: '1', businessName: 'Smile Dental', platform: 'Google Maps', location: 'New York, NY', email: 'contact@smiledental.com', phone: '+1 212-555-0123', website: 'https://smiledental.com', status: 'New', addedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: '2', businessName: 'Urban Coffee', platform: 'Instagram', location: 'Brooklyn, NY', email: 'hello@urbancoffee.nyc', phone: '+1 718-555-0199', website: 'https://urbancoffee.nyc', status: 'Contacted', addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: '3', businessName: 'Elite Fitness', platform: 'Facebook', location: 'Queens, NY', email: null, phone: '+1 347-555-0144', website: 'https://elitefitness.com', status: 'New', addedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
    { id: '4', businessName: 'Tech Solutions Inc', platform: 'Google Maps', location: 'Manhattan, NY', email: 'info@techsolutions.com', phone: '+1 212-555-9988', website: 'https://techsolutions.com', status: 'Qualified', addedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
    { id: '5', businessName: 'Bloom Florist', platform: 'Instagram', location: 'SoHo, NY', email: 'orders@bloomflorist.com', phone: '+1 212-555-7766', website: null, status: 'New', addedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
];

const INITIAL_ACTIVITY: Activity[] = [
    { id: '1', action: 'Search', details: 'Searched "Dentists in New York"', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), value: 120 },
    { id: '2', action: 'Search', details: 'Searched "Coffee Shops in Brooklyn"', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), value: 45 },
    { id: '3', action: 'Search', details: 'Searched "Gyms in Queens"', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), value: 30 },
    { id: '4', action: 'Export', details: 'Exported 50 leads to CSV', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
    { id: '5', action: 'Search', details: 'Searched "Florists in SoHo"', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), value: 15 },
];

const INITIAL_USER: UserProfile = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'Growth Digital Agency',
    role: 'Owner',
    plan: 'Pro',
};

const INITIAL_SETTINGS: Settings = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    darkMode: true,
    apiKey: 'sk_test_123456789',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [recentActivity, setRecentActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [creditsRemaining, setCreditsRemaining] = useState(450);
    const [activeSearches, setActiveSearches] = useState(23);

    // Derived stats
    const totalLeads = leads.length + 12340; // Mocking a larger base number
    const potentialRevenue = totalLeads * 4.3; // Approx $4.3 per lead value

    const platformStats = {
        google: 45,
        instagram: 30,
        facebook: 25,
    };

    const addLead = (leadData: Omit<Lead, 'id' | 'addedAt'>) => {
        const newLead: Lead = {
            ...leadData,
            id: Math.random().toString(36).substr(2, 9),
            addedAt: new Date().toISOString(),
        };
        setLeads((prev) => [newLead, ...prev]);
    };

    const updateLeadStatus = (id: string, status: Lead['status']) => {
        setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status } : lead));
    };

    const deleteLead = (id: string) => {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
    };

    const updateUser = (data: Partial<UserProfile>) => {
        setUser((prev) => ({ ...prev, ...data }));
    };

    const updateSettings = (data: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...data }));
    };

    const spendCredits = (amount: number) => {
        setCreditsRemaining((prev) => Math.max(0, prev - amount));
        // Add activity
        // ...
    };

    return (
        <AppContext.Provider
            value={{
                stats: {
                    totalLeads,
                    activeSearches,
                    creditsRemaining,
                    potentialRevenue,
                    platformStats,
                },
                leads,
                recentActivity,
                user,
                settings,
                addLead,
                updateLeadStatus,
                deleteLead,
                updateUser,
                updateSettings,
                spendCredits,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
