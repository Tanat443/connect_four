"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
    getCurrentProfile,
    getSession,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
    upsertProfileFromUser,
} from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { AppResult } from '@/types/game';
import { Profile } from '@/types/supabase';

type AuthContextValue = {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    signInGoogle: () => Promise<AppResult<void>>;
    signInEmail: (email: string) => Promise<AppResult<void>>;
    signOutUser: () => Promise<AppResult<void>>;
    saveProfile: (update: Pick<Partial<Profile>, 'display_name' | 'city'>) => Promise<AppResult<Profile>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getRedirectUrl() {
    return typeof window === 'undefined' ? undefined : window.location.origin;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const syncProfile = useCallback(async (user: User | null) => {
        if (!user) {
            setProfile(null);
            return;
        }

        const upserted = await upsertProfileFromUser(user);
        if (upserted.ok) {
            setProfile(upserted.data);
            return;
        }

        const loaded = await getCurrentProfile(user.id);
        if (loaded.ok) {
            setProfile(loaded.data);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        getSession().then(async result => {
            if (!isMounted) {
                return;
            }

            const nextSession = result.ok ? result.data : null;
            setSession(nextSession);
            await syncProfile(nextSession?.user ?? null);
            setIsLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            syncProfile(nextSession?.user ?? null);
        });

        return () => {
            isMounted = false;
            data.subscription.unsubscribe();
        };
    }, [syncProfile]);

    const signInGoogle = useCallback(() => signInWithGoogle(getRedirectUrl()), []);

    const signInEmail = useCallback((email: string) => signInWithEmail(email, getRedirectUrl()), []);

    const signOutUser = useCallback(async () => {
        const result = await signOut();
        if (result.ok) {
            setSession(null);
            setProfile(null);
        }
        return result;
    }, []);

    const saveProfile = useCallback(async (update: Pick<Partial<Profile>, 'display_name' | 'city'>) => {
        if (!session?.user.id) {
            return {
                ok: false,
                code: 'AUTH_REQUIRED',
                message: 'Sign in before updating your profile.',
            } satisfies AppResult<Profile>;
        }

        const result = await updateProfile(session.user.id, update);
        if (result.ok) {
            setProfile(result.data);
        }
        return result;
    }, [session]);

    const value = useMemo<AuthContextValue>(() => ({
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        signInGoogle,
        signInEmail,
        signOutUser,
        saveProfile,
    }), [isLoading, profile, saveProfile, session, signInEmail, signInGoogle, signOutUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
