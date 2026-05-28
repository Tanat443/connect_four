"use client";

import { FormEvent, useState } from "react";
import { Loader2, LogIn, LogOut, Save, UserRound } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const summaryControlClass =
  "inline-flex h-9 cursor-pointer select-none list-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
            <LogIn className="size-4" aria-hidden="true" />
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

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await onSubmit({ display_name: displayName, city });
    setMessage(result.ok ? "Profile saved." : result.message ?? "Profile save failed.");
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
      <Button type="submit">
        <Save className="size-4" aria-hidden="true" />
        Save
      </Button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </form>
  );
}
