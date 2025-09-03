# Deck Screen

## Overview

The **Deck** screen is your strategic command center for creating, editing, and optimizing the card decks used in plumbing emergency battles. Here, you can assemble the perfect combination of plumbers, tools, tactics, and upgrades tailored to your playstyle and the specific emergencies you want to conquer. The interface encourages experimentation and refinement with real-time stats, a clear, visual deck list, and thoughtful, retro-inspired design.

---

## Layout

### 1. Header & Navigation

- **Top Bar:**  
  - Displays the deck's current name in a bold, retro-styled mono font, paired with a discrete edit icon/button for quick renaming (`text-xl font-bold uppercase tracking-wider text-gray-100`).
  - To the left: back navigation button (styled as a pixel arrow or retro button) to return to the Dashboard or previous screen.
  - To the right: contextual actions (e.g., duplicate deck, delete deck), presented as small, icon-style buttons with emerald accents.

---

### 2. Deck Stats Panel

- **Position:** Directly beneath the header, in a horizontal card (`bg-gray-800 rounded-md border border-gray-200 shadow-md px-6 py-3 flex gap-6 items-center mb-4`).
- **Content:**
  - **Average Power:** Displays the mean card power (`text-xl text-emerald-400 font-bold`).
  - **Card Count:** Shows total cards out of deck limit, e.g., "24/30" (`text-emerald-500`).
  - **Type Breakdown:** Mini bar, pie graph, or icon row visualizing card types (Plumber, Tool, Tactic, Upgrade), each in a colored pixel icon + label (`flex gap-2 items-center`).
  - **Quick "Optimize" Button:** Offers a suggestion to auto-balance or optimize the deck, placed to the right, styled with `bg-emerald-500 rounded px-3 py-1 uppercase text-xs`.

---

### 3. Deck List Section

- **Visual Display:**  
  Cards in the current deck are shown as a horizontal scrollable row or tiled grid (`grid grid-cols-2 md:grid-cols-3 gap-3` or `flex overflow-x-auto gap-3`), using the card UI described in the theme section:
  ```html
  <div class="bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-4 py-3 relative overflow-hidden">
    <h3 class="text-lg font-bold text-gray-900 uppercase tracking-wide">Card Name</h3>
    <p class="text-xs text-gray-700">Type: Plumber</p>
  </div>
  ```
- **Card Interactions:**  
  - **Remove from Deck:** Each card has a top-right "remove" button (pixel-style 'X', red on hover).
  - **Card Details:** Tapping/clicking a card opens a quick modal/overlay to show stats and effects.
  - **Order:** Drag-and-drop to reorder cards (on mobile and desktop).

---

### 4. Add Cards Section

- **Function:** Add new cards to your deck from your collection.
- **Access:**  
  - Prominent green "Add Cards" button below the deck list (`bg-emerald-500 text-white rounded shadow px-4 py-2 uppercase tracking-wider`).
- **UI:**  
  - Opens a modal or slides up a panel showing your full card collection, filtered to cards not yet in the deck. Includes:
    - Search bar at the top (pixel-styled input).
    - Filter/sort controls (by type, power, rarity).
    - Tap/click to "Add" (button on each card, grayed out if deck is full).
    - Selected cards update the deck list in real-time.

---

### 5. Deck Actions

- **Row of Buttons (below main deck UI):**
  - **Save Deck:** Prominent emerald-600 button, disables if no changes have been made.
  - **Rename Deck:** Secondary outlined emerald button.
  - **Delete Deck:** Cautiously styled red button for permanent removal.
  - **Duplicate Deck:** Outlined, allows making a copy to try new strategies.

- **Confirmation Dialogs:**
  - All risky actions (delete/rename/duplicate) use modals with retro styling and emerald pixel icons.

---

### 6. Supporting Details

- **Empty Deck State:**  
  If a new deck has no cards, show a friendly illustration and a prompt:  
  > "This deck is empty! Start adding your favorite cards to get ready for battle."
  - "Add Cards" button is highlighted, pulses gently.

- **Deck Limit Warning:**  
  - When at or over the card limit, display a small banner:  
    > "Deck Limit Reached: Remove a card to add another."  
    Styled in `bg-yellow-300 text-gray-900 rounded px-3 py-1 font-mono`.

- **Mobile Responsiveness:**  
  All key actions (add, remove, save) are reachable one-handed; larger tap targets for cards and buttons.

---

## Functionality

- **Deck Editing:**  
  Instantly add/remove cards with visual feedback (cards slide in/out, deck stats update live).
- **Renaming:**  
  Edit the deck name directly in the header or via a modal, type in new name, confirm with an emerald "Save" button.
- **View Stats:**  
  All stats auto-recalculate as you tweak your deck.
- **No Unsaved Changes Warning:**  
  If leaving with unsaved changes, a modal warns you and prompts to save or discard.
- **Accessibility:**  
  All controls use text labels, have focus/hover states, and keyboard support.

---

## Visual Summary

- **Gameboy/Retro Touch:** All panels/cards use pixel shadow, strong borders, ample padding.
- **Emerald Theme:** Core actions (`Save`, `Add`, etc.) gleam in emerald; highlights and progress bars are green gradients.
- **Clarity:** Stats and card types use fun but readable iconography; no visual clutter.
- **Guided:** If unable to add more cards, or deck is unbalanced, contextual tips appear in soft yellow or emerald banners.

---

## Example UI Structure (Hierarchy)

```plaintext
[Header: "<Deck Name>"  (Edit Button) ]
[Stats Bar: Avg Power |  Card Count |  Type Breakdown | Optimize ]
[Deck List: Card Tiles with Remove]
[Add Cards Button]
[Deck Action Buttons: Save  Rename  Delete  Duplicate]
```

---

### Tailwind Classes Highlights

- **Containers:** `bg-gray-900`, `rounded-lg`, `shadow-lg`, `border-emerald-500`
- **Buttons:** `bg-emerald-500 hover:bg-emerald-600 text-white uppercase`
- **Section Titles:** `text-xl font-bold font-mono tracking-wider drop-shadow`
- **Cards:** `bg-gray-100 border-2 border-emerald-500 rounded-lg shadow-lg`
- **Deck Stats:** `text-emerald-400 text-xl font-bold`
- **Interactions:** `transition hover:scale-105 focus:ring-2`

---

## User Workflow Example

1. **Arrive on Deck screen.** See current deck name and stats.
2. **Review deck composition.** Remove a card by tapping 'X'.
3. **Tap "Add Cards".** Browse collection, filter by type, click new cards to add.
4. **Stats update live.** Notice if over the card limit.
5. **Rename deck.** Click name or use Rename button, enter new name.
6. **Save changes.** Click 'Save Deck', confirmation shown.
7. **All set**—deck is optimized and ready for the next emergency!

---

## Thematic Effect

This screen embodies the fun and approachability of the game, encouraging players to express their tactical creativity. The nostalgic palette, chunky pixel-aligned interface, and lively emerald highlights make deck-building as delightful as the battles themselves.