import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
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
        <Card className="glass-panel overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Quick Play</CardTitle>
            <CardDescription>
              Local Connect Four will start here. The foundation is ready for
              rules, turns, coaching, and rewards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid aspect-[7/6] w-full grid-cols-7 gap-2 rounded-lg bg-board p-3 shadow-inner">
              {Array.from({ length: 42 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-full border border-board-cell-border bg-board-cell shadow-sm"
                  aria-hidden="true"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="glass-panel">
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
                Practice vs Bot
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                Rewards and leaderboard surfaces are scaffolded for later
                stories.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
