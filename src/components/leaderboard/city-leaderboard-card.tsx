"use client";

import { useEffect, useMemo, useState } from "react";
import { Medal } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { CityLeaderboardRow, getCityLeaderboard } from "@/lib/supabase/leaderboard";

export function CityLeaderboardCard() {
  const { profile, user } = useAuth();
  const city = profile?.city?.trim() ?? "";
  const [rows, setRows] = useState<CityLeaderboardRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!city) {
      return;
    }

    Promise.resolve().then(() => {
      if (!isMounted) {
        return;
      }

      setStatus("loading");
      setMessage("");
      return getCityLeaderboard(city);
    }).then((result) => {
      if (!isMounted || !result) {
        return;
      }

      if (!result.ok) {
        setRows([]);
        setStatus("error");
        setMessage(result.message);
        return;
      }

      setRows(result.data);
      setStatus("ready");
      setMessage(result.data.length ? "" : `No players in ${city} yet.`);
    });

    return () => {
      isMounted = false;
    };
  }, [city]);

  const title = useMemo(() => (city ? `Leaderboard in ${city}` : "City Leaderboard"), [city]);
  const visibleRows = city ? rows : [];
  const visibleMessage = city
    ? message
    : user
      ? "Save your city to see local rankings."
      : "Sign in and save your city to load rankings.";

  return (
    <Card className="glass-panel border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Live ranking from Supabase.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          {city && status === "loading" ? (
            <p className="rounded-lg border border-glass-border bg-background/55 px-3 py-2 text-muted-foreground">
              Loading city leaderboard...
            </p>
          ) : null}

          {visibleRows.map((row, index) => (
            <div
              key={row.user_id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-glass-border bg-background/55 px-3 py-2 shadow-sm"
            >
              <span className="grid size-7 place-items-center rounded-md bg-primary/12 text-primary">
                {index === 0 ? <Medal className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className="min-w-0 truncate font-medium">
                {row.profile?.display_name || row.profile?.email || "Player"}
              </span>
              <span className="whitespace-nowrap text-muted-foreground">
                {row.rating} pts
              </span>
            </div>
          ))}

          {visibleMessage ? (
            <p className="rounded-lg border border-glass-border bg-background/55 px-3 py-2 text-muted-foreground">
              {visibleMessage}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
