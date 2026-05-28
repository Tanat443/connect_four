"use client";

import { FormEvent, useState } from "react";
import { Loader2, LogIn, LogOut, Save, UserRound } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const summaryControlClass =
  "inline-flex h-9 cursor-pointer select-none list-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent px-3 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function UserNav() {
  const {
    user,
    profile,
    isLoading,
    signInGoogle,
    signInEmail,
    signOutUser,
    saveProfile,
  } = useAuth();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled aria-label="Loading user session">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      </Button>
    );
  }

  if (!user) {
    return (
      <details className="relative">
        <summary className={`${summaryControlClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`}>
          <LogIn className="size-4" aria-hidden="true" />
          Sign in
        </summary>
        <div className="glass-popover absolute right-0 mt-2 grid w-72 gap-3 rounded-lg border p-3 text-sm">
          <Button type="button" onClick={signInGoogle}>
            <GoogleIcon />
            Google
          </Button>
          <EmailSignInForm onSubmit={signInEmail} />
        </div>
      </details>
    );
  }

  return (
    <details className="relative">
      <summary className={summaryControlClass}>
        <UserRound className="size-4" aria-hidden="true" />
        {profile?.display_name || user.email || "Profile"}
      </summary>
      <div className="glass-popover absolute right-0 mt-2 grid w-80 gap-3 rounded-lg border p-3 text-sm">
        <ProfileForm
          key={`${profile?.id ?? user.id}:${profile?.updated_at ?? ""}`}
          profile={profile}
          onSubmit={saveProfile}
        />
        <Button type="button" variant="secondary" onClick={signOutUser}>
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </details>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.44Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.23-2.51c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9A6.02 6.02 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.08A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.49l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.95 2.98 14.69 2 12 2a10 10 0 0 0-8.92 5.51l3.33 2.59C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

function EmailSignInForm({ onSubmit }: { onSubmit: (email: string) => Promise<{ ok: boolean; message?: string }> }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await onSubmit(email);
    setMessage(result.ok ? "Check your email to finish sign-in." : result.message ?? "Sign-in failed.");
  }

  return (
    <form className="grid gap-2" onSubmit={handleEmailSignIn}>
      <input
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="email@example.com"
        aria-label="Email address"
        required
      />
      <Button type="submit" variant="secondary">
        Email link
      </Button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </form>
  );
}

function ProfileForm({
  profile,
  onSubmit,
}: {
  profile: { display_name: string; city: string | null } | null;
  onSubmit: (update: { display_name: string; city: string }) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const result = await onSubmit({
        display_name: displayName.trim(),
        city: city.trim(),
      });
      setMessage(result.ok ? "Profile saved." : result.message ?? "Profile save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-2" onSubmit={handleProfileSave}>
      <input
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        placeholder="Display name"
        aria-label="Display name"
      />
      <input
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="City"
        aria-label="City"
      />
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-4" aria-hidden="true" />
        )}
        {isSaving ? "Saving..." : "Save"}
      </Button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </form>
  );
}
