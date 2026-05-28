import { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';
import { AppResult } from '@/types/game';
import { Profile } from '@/types/supabase';

type ProfileUpdate = Pick<Partial<Profile>, 'display_name' | 'city'>;
type SupabaseError = { message: string };
type ProfileTable = {
    upsert: (profile: Profile, options: { onConflict: string }) => {
        select: () => {
            single: () => Promise<{ data: unknown; error: SupabaseError | null }>;
        };
    };
    select: (columns: string) => {
        eq: (column: string, value: string) => {
            single: () => Promise<{ data: unknown; error: SupabaseError | null }>;
        };
    };
    update: (update: ProfileUpdate) => {
        eq: (column: string, value: string) => {
            select: () => {
                single: () => Promise<{ data: unknown; error: SupabaseError | null }>;
            };
        };
    };
};

function authError(message: string): AppResult<never> {
    return {
        ok: false,
        code: 'SUPABASE_AUTH_ERROR',
        message,
    };
}

function profileFromUser(user: User): Profile {
    const metadata = user.user_metadata ?? {};
    const displayName =
        typeof metadata.full_name === 'string'
            ? metadata.full_name
            : typeof metadata.name === 'string'
                ? metadata.name
                : '';

    return {
        id: user.id,
        email: user.email ?? null,
        display_name: displayName,
        city: '',
        avatar_url: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null,
    };
}

export async function signInWithGoogle(redirectTo?: string): Promise<AppResult<void>> {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: redirectTo ? { redirectTo } : undefined,
    });

    return error ? authError(error.message) : { ok: true, data: undefined };
}

export async function signInWithEmail(email: string, redirectTo?: string): Promise<AppResult<void>> {
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });

    return error ? authError(error.message) : { ok: true, data: undefined };
}

export async function signOut(): Promise<AppResult<void>> {
    const { error } = await supabase.auth.signOut();
    return error ? authError(error.message) : { ok: true, data: undefined };
}

export async function getSession(): Promise<AppResult<Session | null>> {
    const { data, error } = await supabase.auth.getSession();
    return error ? authError(error.message) : { ok: true, data: data.session };
}

export async function upsertProfileFromUser(user: User): Promise<AppResult<Profile>> {
    const profile = profileFromUser(user);
    const table = supabase.from('profiles') as unknown as ProfileTable;
    const { data, error } = await table
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();

    return error
        ? authError(error.message)
        : { ok: true, data: data as Profile };
}

export async function getCurrentProfile(userId: string): Promise<AppResult<Profile>> {
    const table = supabase.from('profiles') as unknown as ProfileTable;
    const { data, error } = await table
        .select('*')
        .eq('id', userId)
        .single();

    return error
        ? authError(error.message)
        : { ok: true, data: data as Profile };
}

export async function updateProfile(userId: string, update: ProfileUpdate): Promise<AppResult<Profile>> {
    const table = supabase.from('profiles') as unknown as ProfileTable;
    const { data, error } = await table
        .update(update)
        .eq('id', userId)
        .select()
        .single();

    return error
        ? authError(error.message)
        : { ok: true, data: data as Profile };
}
