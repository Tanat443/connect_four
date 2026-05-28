---
title: Connect Four Tatti
game_type: puzzle
platforms:
  - web
created: 2026-05-28
updated: 2026-05-28
source_brief: C:/Users/w2/Desktop/connect_four/_bmad-output/game-brief.md
status: draft
---

# Connect Four Tatti - Game Design Document

**Author:** Tanat
**Game Type:** Puzzle / Casual Strategy
**Target Platform(s):** Web

---

## Executive Summary

### Core Concept

Connect Four Tatti is a modern web platform for Connect Four, positioned as a gamified loyalty layer for customers waiting for cake delivery. Players complete short strategic matches, receive coaching feedback, and can earn bonuses, badges, or promo rewards.

### Target Audience

Primary audience: customers of an online cake marketplace, age 16-35, who already placed an order and are waiting for delivery. They expect fast mobile-first experiences, simple rules, and visible value from engagement.

### Unique Selling Points (USPs)

- Connect Four embedded into a real customer journey: delivery waiting time.
- Rewards tied to wins and progress: badges, promo codes, mock bonuses.
- Rule-based AI Coach explains missed threats, winning moves, and tactical mistakes.
- Roadmap supports startup-level features: multiplayer link, city leaderboard, Pro skins, Azure/LLM Coach.

---

## Goals and Context

### Project Goals

- Deliver a working web app that clearly exceeds a basic Connect Four clone.
- Meet at least the "Strong" rubric level and visibly prototype the "Great" level.
- Show product thinking through retention, rewards, Supabase-backed progress, and README storytelling.
- Keep MVP achievable for a solo developer using AI-assisted development.

### Background and Rationale

Most online Connect Four sites are isolated boards without retention, business context, or strategic learning. Connect Four Tatti uses a familiar game to make delivery waiting feel playful, social, and rewarding while giving the marketplace a reason to re-engage the user.

---

## Core Gameplay

### Game Pillars

1. **Rewarded Waiting** - waiting for delivery becomes a short game with real or prototype rewards.
2. **Smart Casual Strategy** - simple rules, meaningful tactics, bot levels, hints, and AI Coach.
3. **Shareable Competition** - local play first, with link multiplayer and city leaderboard as roadmap.
4. **Marketplace Retention** - game outcomes create progress, rewards, and reasons to return.

**Pillar Priority:** Rewarded Waiting -> Smart Casual Strategy -> Marketplace Retention -> Shareable Competition.

### Core Gameplay Loop

1. User starts a match during delivery waiting time.
2. User chooses local two-player or bot mode.
3. Players drop discs into a 7x6 board until win or draw.
4. The app highlights the winning line or draw state.
5. The app shows AI Coach insight and a reward/progress card.
6. The result is stored in match history and/or leaderboard.

### Win/Loss Conditions

- Win: player creates four connected discs horizontally, vertically, or diagonally.
- Loss: opponent creates four connected discs first.
- Draw: board is full and no player has four in a row.
- Invalid move: selecting a full column is rejected.

---

## Game Mechanics

### Primary Mechanics

- **Drop Disc:** Player selects one of seven columns. Disc occupies the lowest available row in that column.
- **Turn Alternation:** Players alternate turns after each valid move.
- **Local Two-Player:** Two users play on the same device.
- **Bot Match:** Player faces AI at easy and medium levels for MVP.
- **Best Move Hint:** Rule-based suggestion for winning move, blocking move, or center-preference move.
- **Winning Line Highlight:** The four winning cells are visually emphasized.
- **AI Coach:** Post-match analysis names at least one missed threat, winning opportunity, or decisive move.
- **Reward Flow:** Victory or milestone triggers a badge, mock promo code, or bonus card.
- **Match History / Leaderboard:** Supabase-backed or prototype-backed progress record.

### Controls and Input

- Mobile: tap column or column header to drop a disc.
- Desktop: click column or use keyboard numbers 1-7 as optional enhancement.
- All controls must be readable and reachable on mobile screens.

---

## Puzzle Game Specific Elements

### Core Puzzle Mechanics

The puzzle challenge is tactical pattern recognition on a fixed 7x6 grid. The player must create threats, block opponent threats, and plan two-move sequences while respecting gravity.

**Puzzle elements:**
- Primary puzzle mechanic: gravity-based disc placement.
- Supporting mechanics: turn order, full-column constraints, win detection.
- Mechanic interactions: every move changes both attack and defense possibilities.
- Constraint systems: 7 columns, 6 rows, no floating discs.

### Puzzle Progression

Difficulty progresses through opponent intelligence and assistance depth rather than authored levels.

**Difficulty progression:**
- Tutorial/introduction: local mode and easy bot.
- Core concept: medium bot recognizes immediate wins and blocks.
- Combined mechanics: hints and AI Coach explain threats, forks, and center control.
- Expert/bonus: hard/minimax bot and multiplayer are roadmap items.

### Level Structure

There are no authored puzzle levels in MVP. Each match is a generated tactical state created by player and bot decisions.

### Player Assistance

- Hint system suggests a strong move without taking the turn automatically.
- AI Coach explains post-match decisions in plain language.
- Restart/new match is always available.
- Invalid moves are blocked with clear feedback.

### Replayability

- Replays come from bot difficulty, match history, leaderboard progress, rewards, and future daily challenges.
- Optional goals: win streaks, fewer missed threats, city leaderboard rank, badge collection.

---

## Progression and Balance

### Player Progression

MVP progression is lightweight: match history, wins/losses, badges, reward cards, and leaderboard placement. Auth can be deferred; guest mode may store temporary progress if needed.

### Difficulty Curve

- Easy bot: random valid move with basic preference for non-full columns.
- Medium bot: takes immediate wins, blocks immediate losses, prefers center columns.
- Hard bot: minimax is stretch goal.

### Economy and Resources

Rewards are prototype-friendly: badges, promo-code style cards, and mock discounts. Real coupon issuance is out of MVP unless marketplace integration exists.

---

## Level Design Framework

### Level Types

- Local two-player match.
- Easy bot match.
- Medium bot match.
- Roadmap: link multiplayer match, city leaderboard challenge, daily challenge.

### Level Progression

The user starts with quick play. Bot difficulty and reward surfaces create progression without forcing a long onboarding.

---

## Art and Audio Direction

### Art Style

Mobile-first dessert-themed UI with restrained Liquid Glass influence: translucent panels, soft blur, layered cards, subtle highlights, and high-contrast game board. The board must stay more readable than decorative.

### Audio and Music

Minimal MVP audio: disc drop, win, reward. Music is optional and should not interfere with quick sessions.

---

## Technical Specifications

### Performance Requirements

- Fast initial load on mobile web.
- Smooth tap response for disc placement.
- Liquid Glass effects must be limited enough to preserve mobile performance.

### Platform-Specific Details

- Next.js App Router + Tailwind CSS + Shadcn UI.
- Supabase for at least one real backend feature: match history, leaderboard, profile, or rewards.
- Vercel deployment.

### Asset Requirements

- Board and disc visual states.
- Dessert-themed reward cards and badges.
- Dark/light theme tokens.
- Minimal sound effects if implemented.

---

## Development Epics

### Epic Structure

See `epics.md` for detailed implementation epics. Summary:

| Epic | Outcome |
| --- | --- |
| E1 Core Game Rules | Complete playable Connect Four engine and local mode |
| E2 Bot, Hint, Coach | AI opponent, best move hint, post-match analysis |
| E3 Product Loop | Rewards, match history, leaderboard, marketplace framing |
| E4 UI/UX Polish | Mobile-first Liquid Glass visual direction and themes |
| E5 Submission Readiness | README, deployment, demo flow, rubric alignment |

---

## Success Metrics

### Technical Metrics

- Public deployed web app works on mobile and desktop.
- No invalid board states: floating discs, wrong turn order, false wins.
- Supabase stores at least one meaningful progress or leaderboard record.

### Gameplay Metrics

- Player can complete local and bot matches.
- Winning line is highlighted correctly.
- AI Coach produces relevant feedback after a match.
- Reward flow appears after a win or milestone.

---

## Out of Scope

- Production Stripe integration.
- Full marketplace coupon redemption backend.
- Full Azure/LLM AI Coach.
- Realtime multiplayer by link, unless time allows.
- Full city leaderboard with verified user location.
- Native mobile apps, PWA, Telegram Mini App.

---

## Assumptions and Dependencies

- [ASSUMPTION: Supabase free tier is enough for MVP history/leaderboard needs.]
- [ASSUMPTION: Rule-based AI Coach is acceptable for MVP if README explains upgrade path.]
- [ASSUMPTION: Multiplayer by link remains roadmap unless core loop is finished early.]
- Depends on Vercel deployment, Supabase project setup, and a GitHub repository for submission.
