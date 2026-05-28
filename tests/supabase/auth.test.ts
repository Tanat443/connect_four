import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getCurrentProfile,
    getSession,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
    upsertProfileFromUser,
} from '@/lib/supabase/auth';
import { User } from '@supabase/supabase-js';

const {
    mockSignInWithOAuth,
    mockSignInWithOtp,
    mockSignOut,
    mockGetSession,
    mockFrom,
} = vi.hoisted(() => ({
    mockSignInWithOAuth: vi.fn(),
    mockSignInWithOtp: vi.fn(),
    mockSignOut: vi.fn(),
    mockGetSession: vi.fn(),
    mockFrom: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        auth: {
            signInWithOAuth: mockSignInWithOAuth,
            signInWithOtp: mockSignInWithOtp,
            signOut: mockSignOut,
            getSession: mockGetSession,
        },
        from: mockFrom,
    },
}));

describe('Supabase auth service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('starts Google sign-in with the configured OAuth provider', async () => {
        mockSignInWithOAuth.mockResolvedValue({ data: {}, error: null });

        const result = await signInWithGoogle('https://example.test/auth/callback');

        expect(result.ok).toBe(true);
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
            provider: 'google',
            options: { redirectTo: 'https://example.test/auth/callback' },
        });
    });

    it('starts email sign-in with an OTP redirect', async () => {
        mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });

        const result = await signInWithEmail('player@example.test', 'https://example.test/auth/callback');

        expect(result.ok).toBe(true);
        expect(mockSignInWithOtp).toHaveBeenCalledWith({
            email: 'player@example.test',
            options: { emailRedirectTo: 'https://example.test/auth/callback' },
        });
    });

    it('returns the persisted session', async () => {
        mockGetSession.mockResolvedValue({
            data: { session: { user: { id: 'user-1' } } },
            error: null,
        });

        const result = await getSession();

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data?.user.id).toBe('user-1');
        }
    });

    it('signs out through Supabase auth', async () => {
        mockSignOut.mockResolvedValue({ error: null });

        const result = await signOut();

        expect(result.ok).toBe(true);
        expect(mockSignOut).toHaveBeenCalled();
    });

    it('upserts a profile from auth user metadata', async () => {
        const upsert = vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => Promise.resolve({ data: { id: 'user-1' }, error: null })) })) }));
        mockFrom.mockReturnValue({ upsert });

        const result = await upsertProfileFromUser({
            id: 'user-1',
            email: 'player@example.test',
            user_metadata: { full_name: 'Player One', name: 'Ignored' },
        } as unknown as User);

        expect(result.ok).toBe(true);
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(upsert).toHaveBeenCalledWith(
            {
                id: 'user-1',
                email: 'player@example.test',
                display_name: 'Player One',
                city: '',
                avatar_url: null,
            },
            { onConflict: 'id' },
        );
    });

    it('loads and updates only the signed-in profile row', async () => {
        const eq = vi.fn(() => ({ single: vi.fn(() => Promise.resolve({ data: { id: 'user-1', city: 'Almaty' }, error: null })) }));
        const select = vi.fn(() => ({ eq }));
        const updateEq = vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => Promise.resolve({ data: { id: 'user-1', city: 'Astana' }, error: null })) })) }));
        const update = vi.fn(() => ({ eq: updateEq }));
        mockFrom.mockReturnValue({ select, update });

        const loaded = await getCurrentProfile('user-1');
        const updated = await updateProfile('user-1', { city: 'Astana' });

        expect(loaded.ok).toBe(true);
        expect(updated.ok).toBe(true);
        expect(eq).toHaveBeenCalledWith('id', 'user-1');
        expect(update).toHaveBeenCalledWith({ city: 'Astana' });
        expect(updateEq).toHaveBeenCalledWith('id', 'user-1');
    });
});
