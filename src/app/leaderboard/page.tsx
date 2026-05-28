import { AppShell } from "@/components/layout/app-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LeaderboardPage() {
  return (
    <AppShell>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Match history and ranking surfaces are ready for the Supabase story.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppShell>
  )
}
