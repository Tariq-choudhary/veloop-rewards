# VELOOP Rewards — Games Module

A React + Vite implementation of the VELOOP Games flow: Play Now → Loading →
Game Home → Guide → Gameplay → Game Over → Revive/No Thanks → centralized
Game Coin balance.

Two games are fully playable: **Merge Master** (2048-style merge puzzle) and
**Wormzy** (snake-style arcade game). The remaining 11 carousel slots are
wired up as data-driven "Coming Soon" cards, ready to become real games later.

---

## 1. Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Requires Node 18+.

> **Note on this delivery:** this environment's sandbox has no outbound network
> access, so `npm install` / `npm run build` could not be executed here to
> produce a live-verified build. Every file has been checked by hand and by
> script for: resolvable import/export pairs (no missing or misspelled
> imports), balanced braces/parens/brackets in every file, and consistent
> prop contracts between pages and components. Please run the three commands
> above after downloading — if anything surfaces, it will most likely be a
> small typo, and the architecture notes below will make it fast to locate.

---

## 2. Project structure

```
src/
├── components/
│   ├── common/            Header, LoginModal
│   └── games/
│       ├── GameCarousel/  13-card horizontal carousel (auto-scroll, dots)
│       └── GameCard/      Individual carousel card
├── pages/
│   ├── Games/              GamesPage.jsx        → /games
│   └── games/
│       ├── GameLoadingPage.jsx   → /games/:gameId/loading
│       ├── GameHomePage.jsx      → /games/:gameId
│       ├── GameGuidePage.jsx     → /games/:gameId/guide
│       ├── GamePlayPage.jsx      → /games/:gameId/play
│       └── GameResultPage.jsx    → /games/:gameId/result
├── games/
│   ├── merge-master/       MergeMaster.jsx + mergeLogic.js (pure logic)
│   └── wormzy/              Wormzy.jsx + wormzyLogic.js (pure logic)
├── data/gamesData.js        Single source of truth for all 13 games
├── context/
│   ├── AuthContext.jsx       Login state
│   ├── TokenContext.jsx      Token wallet (entry cost), double-spend guarded
│   ├── GameCoinContext.jsx   Centralized Game Coin balance, idempotent reward claim
│   └── GameSessionContext.jsx  Session lifecycle (STARTED → PLAYING → GAME_OVER → REVIVED → COMPLETED)
├── hooks/useGameEntry.js     The single Play Now gate: login → tokens → deduct → session → navigate
└── utils/
    ├── rewardEngine.js       calculateReward(score, rewardRules) — pure function
    └── bestScore.js          Per-game best score, persisted in localStorage
```

---

## 3. How the game flow works

1. **Carousel "Play Now"** calls `useGameEntry().attemptPlay(game)`:
   - Not logged in → opens the login modal, remembers the game slug, and
     returns the player to that game's home page after login (the game
     selection is never lost).
   - Logged in but insufficient Tokens → shows an inline "Not enough Tokens"
     message, no deduction happens.
   - Sufficient Tokens → deducts `entryCost` **exactly once** (a spend lock
     guards double-clicks), starts a new game session in
     `GameSessionContext`, and navigates to `/games/:gameId/loading`.
2. **Loading screen** shows the game's own artwork/accent color and a real
   progress bar, then auto-redirects to the game's home page (~1.7s).
3. **Game Home** shows best score, current Game Coin balance, and either
   "Continue" (if Tokens were already paid this trip — no double charge) or
   "Play Now" (if arrived directly, e.g. via a shared link — charges normally).
   "How to Play" leads to the guide.
4. **Guide** is generated per-game from `game.instructions` in `gamesData.js`
   — objective, controls, rules, scoring, reward explanation, game-over
   condition. "Start Game" goes straight to `/play` (Tokens already paid,
   no second charge).
5. **Gameplay** (`GamePlayPage`) refuses to render unless a valid paid
   session already exists for that game — visiting `/play` directly without
   ever paying redirects back to the game's home page. This is the frontend's
   anti-bypass guard; the eventual backend becomes the real source of truth.
6. **Game Over**: when a game detects its own end condition, it calls
   `onGameOver(score, snapshot)`. The snapshot (board/worm state) is cached
   in `sessionStorage` so **Revive** can genuinely resume play rather than
   just restarting. The result page shows Score, Best Score, and the
   calculated Game Coin reward.
   - **Revive** (max 1 by default, configurable per game in `gamesData.js`)
     restores the exact snapshot and continues.
   - **Play Again** starts a brand-new session (a fresh session ID — no
     reward carries over from the old one).
   - **No Thanks** finalizes the session once: `completeSession()` marks it
     complete, and `GameCoinContext.addCoins(reward, sessionId)` grants the
     coins. `addCoins` is keyed by session ID and is a no-op if that session
     ID has already been paid out, so duplicate finalization (double clicks,
     back-button, re-mounts) can never double-grant a reward.
7. Coins land in the centralized `GameCoinContext` balance (localStorage key
   `veloopGameCoins`), visible in the header and on every game's home page.

---

## 4. Adding one of the remaining 11 games

1. In `src/data/gamesData.js`, find the game's entry in the coming-soon
   block (or add a new one) and change:
   ```js
   gameType: 'your-game-type',
   status: GAME_STATUS.PLAYABLE,
   rewardRules: { minimumScore, coinsPerPoint, maxReward, reviveCostCoins, maxRevives },
   instructions: { objective, controls, rules: [...], scoring, rewardExplanation, gameOverCondition },
   ```
2. Create `src/games/<slug>/<Name>.jsx` (+ a `.module.css` and, ideally, a
   pure `<name>Logic.js` file for the actual game rules — this keeps
   gameplay logic testable and out of the UI layer, same as Merge Master and
   Wormzy). It must accept `{ game, sessionId, resumeSnapshot, onGameOver }`
   and call `onGameOver(finalScore, snapshotForRevive)` exactly once when the
   round ends.
3. Register it in `GAME_COMPONENTS` inside `GamePlayPage.jsx`.

Home page, loading screen, guide, and result screen all render automatically
from `gamesData.js` — no other file needs to change.

---

## 5. Anti-duplication / security notes (frontend prototype)

- **Token double-spend**: `TokenContext.spendTokens` uses a short-lived lock
  so a double-click can't fire two deductions.
- **Reward double-claim**: `GameCoinContext.addCoins(amount, sessionId)` is
  idempotent per session ID — a session can only ever pay out once, no
  matter how many times "No Thanks" or its handler fires.
- **Free-play bypass**: `/games/:id/play` requires a session created by a
  paid Play Now (or Play Again / Revive); visiting it cold redirects to the
  paid entry point instead of silently starting a free game.
- **Revive limits**: `revivesRemaining` lives only in `GameSessionContext`
  state for the current session, decremented atomically by `useRevive()`.
- All of this is enforced client-side only, as expected for a frontend
  prototype — see the data shapes below for how it maps onto a real backend.

---

## 6. Backend readiness

Nothing here is hard-wired to `localStorage`. `TokenContext`,
`GameCoinContext`, and `GameSessionContext` are the three seams to swap for
real API calls (`GET/POST /api/wallet/*`, `POST /api/games/:id/start`,
`POST /api/games/:id/complete`, `POST /api/games/:id/revive`) — their public
interfaces (`spendTokens`, `addCoins`, `startSession`, `completeSession`,
etc.) would stay the same; only the internals change from
`localStorage`/React state to `fetch` calls.

---

## 7. Assumptions made (not specified in the brief)

- **Starting balances**: new players start with 100 Tokens and 0 Game Coins
  (`DEFAULT_BALANCE` in `TokenContext.jsx` / `GameCoinContext.jsx`).
- **Reward formula**: `coins = clamp(round(score * coinsPerPoint), 0, maxReward)`,
  with a `minimumScore` floor below which no reward is granted. Per-game
  multipliers are configurable in `gamesData.js`.
- **Revive cost**: `reviveCostCoins` is defined per game in `gamesData.js`
  but not currently charged (the brief said "keep the cost configurable,"
  not that it must be charged in this pass) — wiring it into
  `GameCoinContext.deductCoins` before granting a revive is a one-line change
  in `GameResultPage.handleRevive`.
- **"Play Now" on the game's own home page**: treated as a second, always-
  available entry point (for players who land on a game page directly, e.g.
  via a shared link) — distinct from the carousel's Play Now, but funneled
  through the exact same paid gate so there's only one way to enter a game.
- **Sound toggle**: UI-only (no audio assets were supplied); wiring an
  actual `<audio>` layer is straightforward once assets exist.
- **Login**: a minimal name-only sign-in (no password/backend), since no
  auth system was specified. Swappable for real auth without touching the
  games themselves — everything reads `useAuth().isLoggedIn`.

---

## 8. Testing checklist

Manual pass once `npm run dev` is running:

- [ ] `/games` loads with 13 cards, carousel auto-scrolls, dots reflect position
- [ ] Auto-scroll pauses on touch/drag/wheel and resumes after a few seconds
- [ ] Play Now while logged out → login modal → returns to that game's page
- [ ] Play Now with < 20 Tokens → inline warning, no deduction
- [ ] Play Now with ≥ 20 Tokens → Tokens drop by 20 exactly once, even on rapid double-click
- [ ] Loading screen shows the correct game's name/colors, then redirects automatically
- [ ] Game home page shows best score + Game Coins, "How to Play" opens the guide
- [ ] Guide content is specific to that game (objective/controls/rules/scoring)
- [ ] Merge Master: swipe and arrow keys both merge tiles, score updates, game ends when the board is full and no merges remain
- [ ] Wormzy: keyboard/swipe/d-pad all steer, worm grows on food, speed increases, collision (wall or self) ends the game
- [ ] Game Over screen shows Score, Best Score, and a coin reward that matches `rewardRules`
- [ ] Revive resumes the same board/worm state (not a restart) and is unavailable after one use
- [ ] Play Again starts a clean new session (old session's reward isn't reusable)
- [ ] No Thanks adds coins to the header balance exactly once, even if clicked rapidly
- [ ] Visiting `/games/merge-master/play` directly (no prior Play Now) redirects to the game's home page instead of starting a free round
- [ ] No console errors; `npm run build` completes cleanly
- [ ] Responsive: no horizontal overflow from 375px up through desktop widths
