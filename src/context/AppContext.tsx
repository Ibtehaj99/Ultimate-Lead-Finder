"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    writeBatch,
    where,
    updateDoc,
} from 'firebase/firestore';

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
    isLoading: boolean;
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
    saveSearchLeads: (searchLeads: Array<{ name: string; type: string; location: string; platform: string; website: string | null; status: string; email: string | null; phone: string | null }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Firestore collection names
const COLLECTIONS = {
    SAVED_LEADS: 'savedLeads',
    SEARCH_HISTORY: 'searchHistory',
    RECENT_ACTIVITY: 'recentActivity',
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

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [searchHistory, setSearchHistory] = useState<SearchRecord[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [creditsRemaining, setCreditsRemaining] = useState(500);
    const [isLoading, setIsLoading] = useState(true);

    // Real-time listeners for Firestore
    useEffect(() => {
        // Listen to saved leads
        const leadsQuery = query(
            collection(db, COLLECTIONS.SAVED_LEADS),
            orderBy('addedAt', 'desc')
        );
        const unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Lead[];
            setSavedLeads(leadsData);
        });

        // Listen to search history
        const searchQuery = query(
            collection(db, COLLECTIONS.SEARCH_HISTORY),
            orderBy('timestamp', 'desc')
        );
        const unsubSearch = onSnapshot(searchQuery, (snapshot) => {
            const searchData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as SearchRecord[];
            setSearchHistory(searchData);
        });

        // Listen to recent activity
        const activityQuery = query(
            collection(db, COLLECTIONS.RECENT_ACTIVITY),
            orderBy('timestamp', 'desc')
        );
        const unsubActivity = onSnapshot(activityQuery, (snapshot) => {
            const activityData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Activity[];
            setRecentActivity(activityData);
            setIsLoading(false);
        });

        return () => {
            unsubLeads();
            unsubSearch();
            unsubActivity();
        };
    }, []);

    // Derived stats — all computed from real search data
    const totalLeads = searchHistory.reduce((sum, s) => sum + s.leadsFound, 0);
    const activeSearches = searchHistory.length;
    const potentialRevenue = totalLeads * 4.3;

    // Platform stats
    const platformStats = (() => {
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

    const logSearch = useCallback(async (
        keyword: string,
        location: string,
        platform: string,
        leadsFound: number,
        leadsWithEmail: number,
        leadsWithWebsite: number,
        leadsWithPhone: number
    ) => {
        try {
            // Add search record to Firestore
            await addDoc(collection(db, COLLECTIONS.SEARCH_HISTORY), {
                keyword,
                location,
                platform,
                leadsFound,
                leadsWithEmail,
                leadsWithWebsite,
                leadsWithPhone,
                timestamp: new Date().toISOString(),
            });

            // Add activity record
            await addDoc(collection(db, COLLECTIONS.RECENT_ACTIVITY), {
                action: 'Search',
                details: `Searched "${keyword}" in ${location}`,
                timestamp: new Date().toISOString(),
                value: leadsFound,
            });
        } catch (error) {
            console.error('Error logging search to Firebase:', error);
        }
    }, []);

    const saveSearchLeads = useCallback(async (searchLeads: Array<{ name: string; type: string; location: string; platform: string; website: string | null; status: string; email: string | null; phone: string | null }>) => {
        try {
            // Get existing leads to check for duplicates
            const existingKeys = new Set(savedLeads.map(l => `${l.businessName}|${l.location}`));

            const newLeads = searchLeads.filter(l => !existingKeys.has(`${l.name}|${l.location}`));

            if (newLeads.length === 0) return;

            // Batch write for performance
            const batch = writeBatch(db);
            newLeads.forEach(l => {
                const docRef = doc(collection(db, COLLECTIONS.SAVED_LEADS));
                batch.set(docRef, {
                    businessName: l.name,
                    platform: l.platform || 'Google Maps',
                    location: l.location || '',
                    email: l.email || null,
                    phone: l.phone || null,
                    website: l.website || null,
                    status: 'New',
                    addedAt: new Date().toISOString(),
                });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error saving leads to Firebase:', error);
        }
    }, [savedLeads]);

    const addLead = async (leadData: Omit<Lead, 'id' | 'addedAt'>) => {
        try {
            await addDoc(collection(db, COLLECTIONS.SAVED_LEADS), {
                ...leadData,
                addedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error adding lead:', error);
        }
    };

    const saveLead = async (lead: Lead) => {
        try {
            const existing = savedLeads.find(l => l.id === lead.id);
            if (existing) return;
            await addDoc(collection(db, COLLECTIONS.SAVED_LEADS), {
                businessName: lead.businessName,
                platform: lead.platform,
                location: lead.location,
                email: lead.email,
                phone: lead.phone,
                website: lead.website,
                status: lead.status,
                addedAt: lead.addedAt,
            });
        } catch (error) {
            console.error('Error saving lead:', error);
        }
    };

    const removeSavedLead = async (id: string) => {
        try {
            await deleteDoc(doc(db, COLLECTIONS.SAVED_LEADS, id));
        } catch (error) {
            console.error('Error removing lead:', error);
        }
    };

    const updateLeadStatus = async (id: string, status: Lead['status']) => {
        try {
            await updateDoc(doc(db, COLLECTIONS.SAVED_LEADS, id), { status });
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };

    const deleteLead = async (id: string) => {
        try {
            await deleteDoc(doc(db, COLLECTIONS.SAVED_LEADS, id));
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
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
                isLoading,
                addLead,
                updateLeadStatus,
                deleteLead,
                updateUser,
                updateSettings,
                spendCredits,
                logSearch,
                saveLead,
                removeSavedLead,
                saveSearchLeads,
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
