import { AppShell } from "@/components/layout/app-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RewardsPage() {
  return (
    <AppShell>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
          <CardDescription>
            Dessert-themed reward cards will land here after match completion.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppShell>
  )
}
