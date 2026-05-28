# Connect Four Tatti - Decision Log

## 2026-05-28

- Created GDD workspace manually because `gds-gdd` activation expects `_bmad/scripts/resolve_customization.py`, which is missing from this BMad installation.
- Source input: `C:/Users/w2/Desktop/connect_four/_bmad-output/game-brief.md`.
- Chosen primary game type: `puzzle`, with casual strategy emphasis.
- Confirmed target platform: web app only for MVP.
- Confirmed stack direction: Next.js App Router, Tailwind CSS, Shadcn UI, Supabase, Vercel.
- Confirmed MVP must explicitly cover rubric requirements: local two-player, bot mode, winning line, best move hint, AI Coach MVP, rewards, history/leaderboard, dark/light theme, mobile-first UI, README.
- Deferred full realtime multiplayer, city leaderboard, Pro/Stripe, full auth profiles, and Azure/LLM Coach to roadmap unless core MVP finishes early.
