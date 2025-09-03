# Dashboard

Your mission command center! The Dashboard is the starting point every time you enter Pocket Plumbers, giving you a crisp, all-in-one overview of your progress, collection, and essential management tools.

---

## Layout Overview

The Dashboard is organized to deliver essential info at a glance, while providing easy access to deep-dive features. The classic Gameboy-inspired look infuses every element: emerald accents, chunky shadows, pixel fonts, and softly rounded cards.

**Main Layout:**
- **Top Section:** Game greeting & summary stats
- **Middle Section:** Card highlights & collection info
- **Lower Section:** Deck management and quick links

The layout is responsive—single column on mobile, two-to-three columns and expanded stat panels on tablet or desktop.

---

## Functional Areas

### 1. Welcome and Stats Panel (Header)

A strip at the very top, blending `bg-emerald-500` and `bg-gray-900` via a soft gradient, with pixel text greeting and your current level/badge.

**Elements:**
- Player avatar or pixel plumber icon (left)
- “WELCOME, PLUMBER!” label, your current level badge (center)
- Settings cog/button (right)

Below, a row of chunky stat panels showing:
- **Wins:** Total battles/emergencies cleared
- **Coins:** Current in-game currency balance
- **Emergencies Solved:** Cumulative completed challenges
- **Total Cards:** Total collected card count

**Design Details:**
```html
<div class="flex gap-3 mb-3">
  <div class="bg-gray-800 rounded-md border border-gray-200 shadow-md px-6 py-3 flex items-center">
    <div class="text-xl font-bold text-emerald-400 mr-2">27</div>
    <span class="uppercase text-xs text-gray-300 tracking-wide">Wins</span>
  </div>
  <!-- ...repeat for Coins, Emergencies Solved, Total Cards -->
</div>
```

---

### 2. Card Highlights

A prominent feature card list, showcasing your **top ten cards** (by rarity, power, or recent play). Each card is visually presented in a horizontal scroll container on mobile, or grid on larger screens.

**Card Items:**
- Card art/mini pixel icon (left/top)
- Card name (`text-xl uppercase font-bold`)
- Rarity label & highlight accent (emerald details)
- Key stat(s) for each card, e.g., Power, Rarity, Upgrade level

**Design Details:**
```html
<div class="flex overflow-x-auto gap-4">
  <div class="bg-gray-100 border-2 border-emerald-500 rounded-lg shadow-lg px-4 py-3 min-w-[180px]">
    <div class="text-emerald-500 uppercase tracking-wider text-xs mb-1">Rare</div>
    <div class="font-bold text-gray-900 text-lg uppercase mb-1">Pipe Wrench</div>
    <div class="text-gray-700 text-xs">POWER: <span class="font-bold">42</span></div>
  </div>
  <!-- ...up to 10 cards -->
</div>
```

**Below highlights** is a quick button:
```html
<button class="mt-2 text-emerald-600 hover:underline uppercase font-bold tracking-wider">
  View Full Card List
</button>
```

---

### 3. Decks Overview & Management

The **next section** displays your list of decks with powerful management tools. You see each deck's name, key stats, and fast actions.

**Deck List:**
- Rendered as a stacked list (mobile) or compact grid (desktop)
- Each deck entry includes:
  - Deck name (prominent, uppercase, emerald on hover)
  - Key stats: card count, average power/type icons (inline or tooltip)
  - Action buttons: **Rename**, **Delete**
  - “New Deck” button at the top or fixed at the bottom

**Example Deck Item:**
```html
<div class="flex items-center bg-white border border-emerald-200 rounded-lg px-3 py-2 mb-2 shadow transition hover:border-emerald-400 group">
  <span class="font-bold text-gray-800 group-hover:text-emerald-500 uppercase flex-1">Leak Busters</span>
  <span class="text-xs text-gray-500 mr-2">12 Cards</span>
  <button class="ml-2 px-2 py-1 text-xs rounded bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-700 tracking-wider">Rename</button>
  <button class="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-400 border border-red-700">Delete</button>
</div>
```

**“Create New Deck” Button:**
```html
<button class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest mt-2">
  New Deck
</button>
```

---

### 4. Quick Navigation / Shortcuts

At the bottom or as a sticky panel:
- **View Card List** (opens full collection)
- **Manage Decks**
- **Visit Card Shop**
All styled with emerald action color, pixel buttons, and bold uppercase labels.

---

## Theming & Visual Details

- **Emerald green** used for all CTAs, deck highlights, and active tabs.
- **Rounded corners** and **thick borders** distinguish each major panel.
- **Pixel font (`font-mono`, uppercase, tracking-wider`)** for headings, stats, and buttons.
- **Drop-shadow accents** on stats and cards for chunky retro depth.
- **Subtle hover/active scaling** on cards and buttons for modern feedback.
- **Soft gray backgrounds** and **grid pattern overlays** reinforce the Gameboy vibe while ensuring accessibility.

---

## Functionality Summary

- **All-in-One Progress:** Instantly see and track coins, wins, emergencies solved, and your collection’s growth.
- **Show Off Best Cards:** Glance at your most powerful or rare cards, all visually presented.
- **Deck Control Center:** Rename, delete, and create new decks with minimal taps/clicks.
- **Quick Access:** Jump to cards, decks, or the shop from any device.
- **Persistent, Nostalgic Theme:** The Gameboy-powered style makes every stat panel, card, and button feel part of a cohesive, playful world.

---

## Example Dashboard Structure (Pseudocode)

```html
<div class="dashboard bg-gray-900 min-h-screen font-mono text-gray-100">
  <!-- Header: Greeting and Main Stats -->
  <div class="flex items-center justify-between bg-emerald-500 px-4 py-3 rounded-b-lg shadow-lg">
    <img src="plumber-avatar.png" class="w-10 h-10 rounded-full" />
    <div class="text-xl font-bold uppercase tracking-wider">Welcome, Plumber!</div>
    <button class="p-2" aria-label="Settings"><i class="icon-cog"></i></button>
  </div>
  <div class="flex gap-3 mt-4">
    <!-- Individual stat panels as above -->
  </div>
  <!-- Card Highlights -->
  <section class="mt-5">
    <h2 class="uppercase text-lg font-bold text-emerald-400 mb-2 tracking-wide">Top Cards</h2>
    <div class="flex overflow-x-auto gap-4">
      <!-- Card components -->
    </div>
    <button class="mt-2 text-emerald-600 hover:underline uppercase font-bold tracking-wider">View Full Card List</button>
  </section>
  <!-- Decks Management -->
  <section class="mt-8">
    <h2 class="uppercase text-lg font-bold text-emerald-400 mb-2 tracking-wide">My Decks</h2>
    <div>
      <!-- Deck list items as above -->
    </div>
    <button class="bg-emerald-500 hover:bg-emerald-600 ...">New Deck</button>
  </section>
  <!-- Quick links (bottom/sticky) -->
  <nav class="fixed bottom-4 left-0 right-0 mx-auto max-w-sm flex gap-3 justify-center">
    <button class="...">Cards</button>
    <button class="...">Decks</button>
    <button class="...">Shop</button>
  </nav>
</div>
```

---

## User Flow Highlights

- **First glance:** Find out how you’re progressing and what you’ve unlocked.
- **Deck Operations:** Instantly make, edit, or remove decks based on new cards or strategies—no deep menu digging!
- **Collection Pride:** Quickly show off your shiniest plumbing cards to others or plan your next upgrade.
- **Next Steps:** Whether you’re diving for an emergency or shopping for new packs, Dashboard is your efficient, stylish launchpad.

---

In Pocket Plumbers, the Dashboard isn’t just an info dump—it’s a celebration of your achievements and the command center from which every grand adventure begins!