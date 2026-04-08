"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

export interface SearchRecord {
    id: string;
    keyword: string;
    location: string;
    platform: string;
    leadsFound: number;
    leadsWithEmail: number;
    leadsWithWebsite: number;
    leadsWithPhone: number;
    timestamp: string;
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
    darkMode: boolean;
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
    savedLeads: Lead[];
    searchHistory: SearchRecord[];
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
    logSearch: (keyword: string, location: string, platform: string, leadsFound: number, leadsWithEmail: number, leadsWithWebsite: number, leadsWithPhone: number) => void;
    saveLead: (lead: Lead) => void;
    removeSavedLead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
    SEARCH_HISTORY: 'ulf_search_history',
    RECENT_ACTIVITY: 'ulf_recent_activity',
    SAVED_LEADS: 'ulf_saved_leads',
    CREDITS: 'ulf_credits_remaining',
};

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

function loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage<T>(key: string, value: T) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage errors
    }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [searchHistory, setSearchHistory] = useState<SearchRecord[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [creditsRemaining, setCreditsRemaining] = useState(500);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setSearchHistory(loadFromStorage<SearchRecord[]>(STORAGE_KEYS.SEARCH_HISTORY, []));
        setRecentActivity(loadFromStorage<Activity[]>(STORAGE_KEYS.RECENT_ACTIVITY, []));
        setSavedLeads(loadFromStorage<Lead[]>(STORAGE_KEYS.SAVED_LEADS, []));
        setCreditsRemaining(loadFromStorage<number>(STORAGE_KEYS.CREDITS, 500));
        setHydrated(true);
    }, []);

    // Persist to localStorage when data changes
    useEffect(() => {
        if (!hydrated) return;
        saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, searchHistory);
    }, [searchHistory, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveToStorage(STORAGE_KEYS.RECENT_ACTIVITY, recentActivity);
    }, [recentActivity, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveToStorage(STORAGE_KEYS.SAVED_LEADS, savedLeads);
    }, [savedLeads, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveToStorage(STORAGE_KEYS.CREDITS, creditsRemaining);
    }, [creditsRemaining, hydrated]);

    // Derived stats — all computed from real search data
    const totalLeads = searchHistory.reduce((sum, s) => sum + s.leadsFound, 0);
    const activeSearches = searchHistory.length;
    const potentialRevenue = totalLeads * 4.3;

    // Platform stats — computed from search history
    const platformStats = (() => {
        const total = searchHistory.length || 1;
        const google = searchHistory.filter(s => s.platform === 'all' || s.platform === 'google').length;
        const instagram = searchHistory.filter(s => s.platform === 'instagram').length;
        const facebook = searchHistory.filter(s => s.platform === 'facebook').length;
        const platformTotal = google + instagram + facebook || 1;
        return {
            google: Math.round((google / platformTotal) * 100),
            instagram: Math.round((instagram / platformTotal) * 100),
            facebook: Math.round((facebook / platformTotal) * 100),
        };
    })();

    const logSearch = useCallback((
        keyword: string,
        location: string,
        platform: string,
        leadsFound: number,
        leadsWithEmail: number,
        leadsWithWebsite: number,
        leadsWithPhone: number
    ) => {
        const searchRecord: SearchRecord = {
            id: Math.random().toString(36).substr(2, 9),
            keyword,
            location,
            platform,
            leadsFound,
            leadsWithEmail,
            leadsWithWebsite,
            leadsWithPhone,
            timestamp: new Date().toISOString(),
        };
        setSearchHistory(prev => [searchRecord, ...prev]);

        const activity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            action: 'Search',
            details: `Searched "${keyword}" in ${location}`,
            timestamp: new Date().toISOString(),
            value: leadsFound,
        };
        setRecentActivity(prev => [activity, ...prev].slice(0, 50));

        // Deduct 1 credit per search
        setCreditsRemaining(prev => Math.max(0, prev - 1));
    }, []);

    const addLead = (leadData: Omit<Lead, 'id' | 'addedAt'>) => {
        const newLead: Lead = {
            ...leadData,
            id: Math.random().toString(36).substr(2, 9),
            addedAt: new Date().toISOString(),
        };
        setLeads((prev) => [newLead, ...prev]);
    };

    const saveLead = (lead: Lead) => {
        setSavedLeads(prev => {
            if (prev.find(l => l.id === lead.id)) return prev;
            return [lead, ...prev];
        });
    };

    const removeSavedLead = (id: string) => {
        setSavedLeads(prev => prev.filter(l => l.id !== id));
    };

    const updateLeadStatus = (id: string, status: Lead['status']) => {
        setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status } : lead));
        setSavedLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status } : lead));
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
                savedLeads,
                searchHistory,
                recentActivity,
                user,
                settings,
                addLead,
                updateLeadStatus,
                deleteLead,
                updateUser,
                updateSettings,
                spendCredits,
                logSearch,
                saveLead,
                removeSavedLead,
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
