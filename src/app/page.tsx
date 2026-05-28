import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Disc } from "@/components/game/disc";
import { AppShell } from "@/components/layout/app-shell";
import { CityLeaderboardCard } from "@/components/leaderboard/city-leaderboard-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <Card className="glass-panel overflow-hidden border">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Quick Play</CardTitle>
            <CardDescription>
              Local Connect Four will start here. The foundation is ready for
              rules, turns, coaching, and rewards.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div
              className="high-contrast-board relative grid aspect-[7/6] w-full max-w-[520px] grid-cols-7 gap-1.5 overflow-hidden rounded-lg bg-board p-2.5 sm:gap-2 sm:p-3"
              data-board-surface="high-contrast"
            >
              {Array.from({ length: 42 }).map((_, index) => (
                <div
                  key={index}
                  className="relative isolate rounded-full"
                  aria-hidden="true"
                >
                  <Disc
                    player={
                      index === 35 || index === 36 || index === 37
                        ? "player1"
                        : index === 38 || index === 39
                          ? "player2"
                          : null
                    }
                  />
                  <span
                    aria-hidden="true"
                    className="board-cell-frame pointer-events-none absolute inset-0 z-10 rounded-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="glass-panel border">
            <CardHeader>
              <CardTitle>Match Setup</CardTitle>
              <CardDescription>
                Guest-first flow with future bot and reward hooks.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="w-full" asChild>
                <Link href="/game">Start Local Match</Link>
              </Button>
              <Button className="w-full" variant="secondary">
                <ArrowUpRight className="size-4" aria-hidden="true" />
                Play online
              </Button>
            </CardContent>
          </Card>

          <CityLeaderboardCard />
        </div>
      </section>
    </AppShell>
  );
}
