# Card List Screen

**Path:** `/cards`  
**Short Description:** Browse a comprehensive inventory of all your collected cards, including plumbers, tools, tactics, and upgrades. Use filters and sorting to find specific cards quickly.

---

## Layout Overview

The Card List screen is your central hub for viewing and managing your entire collection. Drawing on pixel-inspired Gameboy visuals with modern UX, the card list is inviting, functional, and intuitive. The layout emphasizes clarity—cards are easy to scan, filter, and inspect in detail.

```
+-----------------------------------------------------------+
| [HEADER]            "Card List"                           |
|-----------------------------------------------------------|
| [ STAT BAR ]   Filter: ▾   Sort By: ▾    Search: [🔍____]  |
|-----------------------------------------------------------|
| [ SCROLLABLE CARD GRID / LIST ]                           |
|                                                           |
|   [Card]   [Card]   [Card]   [Card]   [Card]   [Card]     |
|      ...      ...      ...      ...      ...      ...      |
|                                                           |
|-----------------------------------------------------------|
| [ FLOAT ACTION BUTTON ] [+ Add to Deck]                   |
+-----------------------------------------------------------+
```

---

## Key Functional Areas

### 1. Header

- **Appearance:** 
  - Top of the screen, large bold heading "CARD LIST" in uppercase, pixel-shadowed emerald text (`text-emerald-500`, `drop-shadow`).
  - Simple background (`bg-gray-900`) with subtle pixel grid overlay for retro flavor.

- **Content:**
  - Left: Back navigation (icon & label, e.g., `← BACK`)
  - Center: `"CARD LIST"`
  - Right: Quick links to decks or shop (small icon buttons).

---

### 2. Stat Bar & Filters

- **Appearance:** 
  - Flex row with slight padding and emphasized with a `bg-gray-800 rounded-md border border-gray-200 shadow-md px-4 py-2`.
  - Readable, mono font.
  - Emerald and muted gray colors highlight active/selectable items.

- **Functionality:**
  - **Filter Dropdown:**  
    - Drop-down to select card type: All, Plumbers, Tools, Tactics, Upgrades.
    - Emerald accent shows active filter (`bg-emerald-500` for selected).
  - **Sort Dropdown:**  
    - Sort by: Name, Rarity, Type, Power Level, Recently Acquired.
    - Current sort highlighted.
  - **Search Box:**  
    - Input field with pixel-style border.
    - Typing filters cards in real-time.
    - Emerald icon accent and focus ring.

---

### 3. Card Grid / List

- **Appearance:**  
  - Main content area.  
  - Responsive **grid** on large screens, collapses to **single column / list** on mobile.
  - Each card rendered as a distinct panel:
    - `bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-4 py-3 mb-4 transition-transform hover:scale-105`
    - Emerald or accent border to indicate rarity/type.
    - Overlay at corner for rarity label or unique tags (`Rare`, `Ultra`, `New`).
    - Card name in uppercase, bold, emerald-shadowed text.
    - Mini icon for card type (plumber/tool/etc.) in the upper left.
    - Sub-info:  
      - Power/level/unique abilities (small, gray text).
      - Flavored description line, if present.
    - Quick action: "Add to Deck", "Inspect", or context menu (three dots).

- **Functionality:**  
  - Cards are clickable—clicking brings up a **modal with detailed card info** (art, expanded stats, lore, add/trade actions).
  - If an emergency fix is ongoing, action button might be “Use Now” or “Queue for Emergency.”
  - Cards show inventory count (if you have multiples).
  - Star/favorite function to easily mark favorites.

- **Empty State:**  
  - If collection is empty, show a friendly pixel-art plumber with a message.
  - Suggest actions: “Visit the Shop” or “Play Emergencies to earn more cards!”

---

### 4. Floating Action Button

- **Appearance:**  
  - Lower right, prominent “+ Add to Deck” button.
  - Emerald gradient, pronounced shadow, rounded full, uppercase label.
  - On hover/tap: glows and slightly lifts.

- **Functionality:**  
  - Tapping opens deck selection to quickly add currently filtered cards.
  - On mobile, may transform into a persistent banner at bottom.

---

### 5. Mobile Optimization

- Grid collapses to 1-2 columns.
- Filters and sort become collapsible at top.
- Search and Add-to-Deck remain sticky for quick access.

---

## Additional Features

- **Accessibility:**  
  - All filter/sort/Search actions are keyboard navigable and announce changes.
  - Contrast is high for readability.
- **Live Feedback:**  
  - Filter/sort/search animate with pixel blip sounds (optional).
  - Card hover pops card up with shadow and highlights border.

---

## Sample Card Component

```html
<div class="bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-4 py-3 
            relative overflow-hidden mb-4 transition-transform hover:scale-105 cursor-pointer">
  <div class="absolute top-2 right-2 text-emerald-500 text-xs uppercase tracking-widest font-bold">
    Rare
  </div>
  <div class="absolute top-2 left-2">
    <img src="/icons/plumber.svg" alt="Plumber" class="w-6 h-6"/>
  </div>
  <h3 class="text-xl font-bold text-gray-900 drop-shadow-[0_1px_0_rgba(34,197,94,0.9)] leading-tight uppercase tracking-wide">
    Mega Plumbatron
  </h3>
  <p class="text-gray-700 text-sm mt-1">
    Wields the giant wrench for catastrophic leaks.
  </p>
  <div class="flex items-center mt-3">
    <span class="text-emerald-600 text-xs font-mono mr-2">Power: 85</span>
    <span class="text-gray-400 text-xs">Qty: 2</span>
  </div>
  <button class="mt-3 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700">
    Add to Deck
  </button>
</div>
```

---

## Summary

The **Card List** screen lets players efficiently explore, filter, and manage all collected cards within a cheerful, tactile Gameboy-inspired interface. Filtering and sorting mechanisms support large card collections, while a responsive card grid prioritizes easy browsing. Each card is visually distinct and interactive, supporting deeper engagement via detailed modals and quick actions—ensuring both collectors and strategic deck-builders feel right at home.