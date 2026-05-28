import Link from "next/link"
import { CakeSlice } from "lucide-react"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Play" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/rewards", label: "Rewards" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh text-foreground">
      <header className="glass-nav sticky top-0 z-20 border-b">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 font-semibold"
            aria-label="Tatti Connect 4 home"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25 ring-1 ring-primary-foreground/20">
              <CakeSlice className="size-4" aria-hidden="true" />
            </span>
            <span className="truncate">Tatti Connect 4</span>
          </Link>

          <nav
            className="ml-auto hidden items-center gap-1 sm:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          <ThemeToggle />
          <UserNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 sm:py-8">
        {children}
      </main>

      <nav
        className="glass-nav fixed inset-x-0 bottom-0 z-20 border-t px-3 py-2 sm:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
