# Card Shop

The **Card Shop** is the bustling heart of collection-building in Pocket Plumbers. Here, players use their hard-earned coins to buy fresh card packs, snipe rare single cards, and barter with others through a vibrant marketplace—all with a distinctly retro, Gameboy-inspired interface.

---

## Layout & Structure

### Overall View

The shop fills the screen with a lively, well-organized grid featuring themed shop sections, engaging pixel flourishes, and clear coin balances. It uses a soft, high-contrast palette: a light-to-emerald vertical gradient background with a pixel grid overlay, providing playful energy and focus to shopping activities. The shop’s main content is contained within a rounded, bordered, and subtly shadowed panel centered on the screen, recalling classic game menu boxes.

### Sections

#### 1. Shop Header

- **Placement:** Centered at the top of the main panel.
- **Style:**  
  - Large, uppercase `SHOP` title in emerald, pixel-shadowed (`text-emerald-400 text-2xl font-bold uppercase drop-shadow`).
  - Animated coin or pixel-burst icon next to the title for atmosphere.
  - Player **Coin Balance** displayed prominently; mono font, bold, emerald-highlighted.

#### 2. Shop Tabs

- **Functionality:** Players can quickly switch between three core shop modes:
  - **Card Packs** (default): Buy randomized packs of cards.
  - **Single Cards**: Pick individual cards from rotating daily offers.
  - **Trades**: See open trades or post cards to swap with other players.

- **Style:**  
  - Horizontal tab bar, each tab a pill-shaped emerald-outlined button (`rounded-full border-emerald-400 uppercase`).
  - Active tab uses solid emerald fill (`bg-emerald-500 text-white`); inactive tabs are outline-only.
  - Smooth hover transitions as you mouse over tabs.

#### 3. Card Packs Section

- **Layout:**  
  - Grid layout: Featured card packs are arranged as oversized cards or tiles.
  - Each pack tile shows artwork, pack name, number of cards, theme, and price in coins.
  - **Purchase button:** Emerald, large, with coin icon.
  - **Pack details** (rarity odds, included card types) appear on tile hover/tap.

- **Specials:**  
  - Daily or weekly rotating "Special Pack" highlighted with a glowing emerald border or pixel-burst effect.
  - Limited-time offers use badge overlays (e.g., `LIMITED!` in yellow/lime).

#### 4. Single Card Offers

- **Layout:**  
  - Vertical or grid list of individual cards available for direct purchase.
  - Each card mini-panel:
    - Pixel-art illustration.
    - Card name and rarity.
    - Coin price; purchase button.
    - Timer bar for limited-time availability beneath each card.

- **Rarity Highlight:**  
  - Rare cards use brighter or animated emerald/yellow borders.
  - Uncommon/common cards have softer outlines.

#### 5. Player Trades

- **Layout:**  
  - Listing of trade requests from other players, sortable by newest, rarest, or match to your collection.
  - Each trade features:
    - Offered card(s): Mini-card previews.
    - Requested card(s) or coin price.
    - Player name/avatar (pixel-style).
    - "Trade" button (emerald), or "Post Trade" for your own requests.

- **Empty State:**  
  - If few trades exist, display a friendly, pixel-plumber mascot with encouragement to post a trade.

#### 6. Bonus/Promo Bar

- **Placement:** Between shop header and tabs or floating at the top.
- **Contents:**  
  - Flashes current daily deal, flash discounts, or event packs (e.g., "Leak Week Special!").
  - Subtle pulsing background, animated sparkle/burst for limited-time urgency.

#### 7. Shop Modal

- **Triggered by:** Card or pack purchases, or viewing a trade.
- **Appearance:**  
  - Central floating, emerald-outlined modal with bold title.
  - Shows animated reveal of purchased cards, or confirmation of trade.
  - "Close" and "Buy More" (emerald, bold) actions at bottom.
  - Subtle celebration graphics—pixel confetti, emerald rays—on successful purchase.

---

## Functionality

- **Coin Spending:** Players use their in-game coins; if insufficient, the purchase button is grayed and shows a tooltip.
- **Transaction Feedback:** On every purchase, cards animate into the collection, with rare pulls highlighted.
- **Inventory Updating:** Collection and coin counts in the header update in real-time with purchases or trades.
- **Daily Reset:** Specials and card listings refresh on a daily schedule, with a visible timer before reset.
- **Trading System:** Players can propose trades, browse open requests, and accept or counter-offer. All trades are safely escrowed by the shop.
- **Accessibility:** All buttons and interactive elements are high-contrast, large touch targets, and keyboard navigable.

---

## Thematic UI Highlights

- **Emerald action color:** Drives every purchase, highlight, and “Buy” action.
- **Pixel shadows, burst SVGs:** Used for badges, limited-time deals, or highlighting rare finds.
- **Rounded containers and borders:** Every card, button, and shop panel feels inviting and game-like.
- **Rewards/Notifications:** Success feedback uses emerald gradients and retro flourishes (sparkles, coin chimes).
- **Mono font and uppercase:** Shop labels and headings echo classic game menus.
- **Card Reveal Animation:** Buying a pack triggers a quick, flipping animation as new cards are “unpacked.”

---

## Example UI Outline

```html
<div class="max-w-lg mx-auto mt-12 mb-8 bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl p-8
            relative">
  <!-- Shop Header -->
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-emerald-400 text-2xl font-bold uppercase drop-shadow">SHOP</h2>
    <div class="flex items-center gap-2 font-mono font-bold text-emerald-300 bg-gray-800 rounded px-4 py-2">
      <img src="/icons/coin.svg" class="w-5 h-5" /> 5,200
    </div>
  </div>

  <!-- Bonus/Promo Banner -->
  <div class="bg-gradient-to-r from-emerald-400/60 to-yellow-300/60 rounded-md text-center font-mono
              text-sm py-2 px-3 mb-3 uppercase tracking-wider shadow drop-shadow">
    Leak Week Special: 50% off Plumber Pack!
  </div>

  <!-- Shop Tabs -->
  <div class="flex gap-2 mb-6">
    <button class="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold uppercase tracking-wider shadow">Card Packs</button>
    <button class="border-2 border-emerald-400 text-emerald-500 px-4 py-1 rounded-full font-bold uppercase tracking-wider">Single Cards</button>
    <button class="border-2 border-emerald-400 text-emerald-500 px-4 py-1 rounded-full font-bold uppercase tracking-wider">Trades</button>
  </div>

  <!-- Packs/cards/trades section updates below here -->
</div>
```

---

## Summary

The Card Shop is a lively, accessible space where players can expand their collections and strategize. Every interaction—buying, browsing, trading—feels rewarding, thanks to the tactile retro visuals, pixelated highlights, and punchy emerald-driven action buttons. Frequent daily specials, prominent coin feedback, and satisfying card reveal animations encourage continual engagement and reward collectors both casual and hardcore.