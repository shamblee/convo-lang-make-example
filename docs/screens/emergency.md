# Emergency Screen

The **Emergency** screen is where the heart of Pocket Plumbers gameplay unfolds—a fast-paced, turn-based battle against plumbing chaos! Here, you’ll face unique, themed emergencies, deploying plumber cards, tools, and tactics from your custom deck to outwit leaks, clogs, and mechanical mishaps for maximum rewards.

---

## Layout and Structure

### 1. **Emergency Introduction Header**

- **Location:** Top of the screen, spanning full width.
- **Contains:**
    - **Emergency Name:** Large, uppercase, emerald-highlighted heading (e.g., “BURST PIPE IN BASEMENT”).
    - **Brief Description:** A one- or two-line scenario setup (“Water gushes across the floor—a main pipe has blown! Fix it quick before the timer runs out!”).
    - **Icon/Pixel Art:** Themed, pixel-style emergency icon (e.g., cartoon gushing pipe).
- **Visuals:** 
    - Header background uses `bg-gradient-to-b from-gray-100 via-emerald-100 to-gray-200`.
    - Emergency name uses `text-emerald-500 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] text-xl md:text-2xl font-bold uppercase tracking-wider`.

---

### 2. **Battlefield Area**

- **Location:** Central and most prominent section.
- **Components:**
    - **Opponent Display Panel (Left):**
        - Large sprite or illustration of the plumbing emergency.
        - Emergency stats (HP/Condition bar, e.g., “Water Damage: 34%”) rendered in emerald-green progress bars.
    - **Versus Divider:** Retro “VS” or pixelated burst visual between player and emergency.
    - **Player Deck Zone (Right):**
        - Display of player’s active plumber(s) or played card(s), including tool cards or special tactics in effect.
        - HP/Energy bar for current plumber if relevant (for certain emergencies).
    - **Background:** Blends pixel grid overlay, faint emerald/gray gradient, and scattered plumbing icons (spanners, faucets).

---

### 3. **Turn Log / Announcer Panel**

- **Location:** Just below the battlefield, full width but compact.
- **Functionality & Visuals:**
    - Displays last several turns: plays, effects, actions, and results (“Drip Fixer used Pipe Tape! Leak damage reduced by 40%.”).
    - Uses `bg-gray-800 rounded-md border border-emerald-400 text-gray-100 px-4 py-2 text-sm font-mono`
    - Scrollable if the log is long.
    - Turn counter (e.g., “Turn 3” in emerald highlight).

---

### 4. **Playable Card Hand**

- **Location:** Bottom edge, in a raised, horizontally scrollable container.
- **Details:**
    - Each card shown as a small preview: pixel-art image, title, rarity label.
    - Cards use `bg-white border-2 border-emerald-500 rounded-lg shadow-lg px-2 py-1 transition-transform hover:scale-110 cursor-pointer`.
    - Drag or tap to play; held cards “fan out” slightly for tactile feel.
    - Cards with valid moves glow with `emerald-400` outline.
    - A floating counter shows “Cards Left in Deck: 27.”

---

### 5. **Action Panel / Confirm Row**

- **Location:** Just above or overlaying the card hand.
- **Includes:**
    - **“END TURN”** button (`bg-emerald-500 hover:bg-emerald-600 text-white uppercase font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 tracking-widest`).
    - **Ability/Quick Use Buttons:** (if applicable)—playable one-offs like “Undo Last Move,” “View Board,” or “Call for Help” use slightly lighter emerald/aqua hues and pixel burst icons.

---

### 6. **Rewards, Warnings & Status Banners**

- **Example:**  
    - “CRITICAL FLOOD! – Solve within 2 turns for a bonus” (banner at top or above log).
    - After battle: Modal popover styled as `bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-8 py-6`, displaying coins/rewards and options to retry or return.

---

## Key Functionality

- **Deck Selection:** On entering, player selects which custom deck to use for the emergency (modal selector, with stats and preview).
- **Battle Loop:**
    - Each turn, select card(s) from hand and target emergency/problem spots.
    - Play plumber cards to deploy specialists, tool cards for immediate fixes, and tactic cards for clever combos (e.g., “Quick Patch” or “Lock Valve”).
    - The emergency reacts after player’s turn—damage increases, status effects trigger, or obstacles escalate.
    - The log updates all actions and consequences in sequence for clarity.
- **Urgency/Timer Elements:**  
    - Certain emergencies feature visible urgency meters or timers (animated emerald bar; e.g., “Rising Water: 2 Turns Until Flood”). These are highly visible for challenge and urgency.
- **Victory/Defeat:**
    - On success: Pup-up modal with coins, possible new cards, and performance rating (bonus for speed/clever play).
    - On loss: Option to retry, tips on improving, and a prompt suggesting recommended deck tweaks or cards.

---

## Accessibility & Thematic Notes

- All action and CTA elements (buttons, highlights) use consistent emerald greens for instant recognition.
- All text sits on strong-contrast backgrounds for high readability. Critical info (turn, timer, warnings) uses `uppercase tracking-wider` and drop-shadow for the “game alert” retro vibe.
- Important player moves and rewards are punctuated with pixelated, animated “burst” or “sparkle” SVGs for visual excitement.

---

## Emergency Screen—Example Visual Structure

```html
<div class="w-full min-h-screen bg-gradient-to-b from-gray-100 via-emerald-100 to-gray-200 
            relative font-mono flex flex-col items-center">
    
  <!-- Pixel grid overlay -->
  <div class="absolute inset-0 opacity-20 bg-[url('/pixelgrid.svg')] pointer-events-none"></div>
  
  <!-- Emergency Header -->
  <section class="w-full py-4 bg-white bg-opacity-60 border-b-2 border-emerald-300 
                   flex flex-col items-center z-10">
    <img src="/emergencies/pipeburst.png" class="w-14 h-14 mb-2"/>
    <h1 class="text-emerald-500 text-2xl font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
      Burst Pipe in Basement
    </h1>
    <p class="text-gray-700 text-sm mt-2 max-w-md text-center">
      Water gushes across the floor—a main pipe has blown! Fix it quick before the timer runs out!
    </p>
  </section>
  
  <!-- Battlefield -->
  <main class="flex flex-1 justify-center items-center w-full max-w-4xl gap-6 py-8 z-10">
    <!-- Emergency Sprite & Status -->
    <div class="flex flex-col items-center">
      <img src="/emergencies/sprite-pipe.png" class="w-32 h-32"/>
      <div class="mt-2 w-40 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div class="bg-emerald-400 h-3 rounded-full" style="width: 59%"></div>
      </div>
      <span class="uppercase text-xs text-gray-700 mt-1 tracking-wider">Water Damage: 41%</span>
    </div>
    <!-- Versus Divider -->
    <div class="flex flex-col items-center px-2">
      <svg><!-- pixel burst or VS icon --></svg>
    </div>
    <!-- Player Active Zone -->
    <div class="flex flex-col items-center">
      <div class="bg-white rounded-lg border-2 border-emerald-400 shadow-md px-3 py-2 mb-1">
        <img src="/plumbers/dripfixer.png" class="w-16 h-16"/>
        <div class="font-bold uppercase text-emerald-600 text-xs tracking-wider mt-1">Drip Fixer</div>
        <div class="bg-emerald-100 rounded h-2 mt-1 w-full">
          <div class="bg-emerald-500 h-2 rounded" style="width: 92%"></div>
        </div>
      </div>
      <!-- Played Tool / Ability Cards as stacked tags below -->
      <div class="flex flex-wrap gap-2 mt-2">
        <div class="bg-gray-200 text-xs rounded px-2 py-1 border border-emerald-400">Pipe Tape</div>
        <div class="bg-emerald-100 text-xs rounded px-2 py-1 border border-emerald-600">Quick Patch</div>
      </div>
    </div>
  </main>
  
  <!-- Turn Log / Announcer -->
  <section class="w-full max-w-2xl bg-gray-800 rounded-md border border-emerald-400
                    text-gray-100 px-4 py-2 text-sm font-mono mb-2 z-10">
    <div class="flex items-center justify-between">
      <span class="font-bold text-emerald-400 uppercase tracking-wider">Turn 3</span>
      <span class="text-yellow-300 uppercase tracking-wide">CRITICAL FLOOD—2 turns left!</span>
    </div>
    <ul class="list-none pl-0 mt-1">
      <li><span class="text-emerald-400">Drip Fixer</span> used <span class="font-bold">Pipe Tape</span>! Leak damage down 40%.</li>
      <li>Emergency: Rising water pressure! Next turn will drain 2 plumber energy.</li>
      <li><span class="text-emerald-400">Plunger Pro</span> is ready to deploy.</li>
    </ul>
  </section>
  
  <!-- Player Card Hand -->
  <section class="fixed bottom-0 w-full max-w-4xl z-20 px-4 pb-2 mb-2">
    <div class="flex items-center gap-3 bg-gray-100 rounded-lg border border-emerald-300 shadow-lg p-3 overflow-x-auto">
      <div class="bg-white border-2 border-emerald-500 rounded-lg shadow-lg px-2 py-1 cursor-pointer
                  hover:scale-110 transition-transform relative">
        <img src="/cards/pipewrench.png" class="w-12 h-12"/>
        <div class="absolute bottom-1 right-1 text-emerald-500 text-[10px] uppercase font-bold">Tool</div>
      </div>
      <div class="bg-white border-2 border-emerald-400 rounded-lg shadow-lg px-2 py-1 cursor-pointer
                  hover:scale-110 transition-transform relative">
        <img src="/cards/plungerpro.png" class="w-12 h-12"/>
        <div class="absolute bottom-1 right-1 text-emerald-400 text-[10px] uppercase font-bold">Plumber</div>
      </div>
      <!-- ... More cards ... -->
      <div class="ml-auto text-xs text-gray-700 tracking-wide">Cards Left: <b>27</b></div>
    </div>
    <!-- Action Panel -->
    <div class="flex gap-4 mt-3 items-center justify-end">
      <button class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-6 py-2 uppercase tracking-widest transition">END TURN</button>
      <button class="bg-emerald-400 text-white rounded px-4 py-2 border border-emerald-500 font-bold uppercase tracking-wide shadow hover:bg-emerald-200 transition">Undo Move</button>
    </div>
  </section>
</div>
```

---

## Summary of Emergency Screen Experience

- **Immersive Battles:** Retro visuals and dynamic turn-by-turn flow evoke the thrill of classic monster-battling games—with a plumbing twist.
- **Strategic Choices:** Players must optimize cards and tactics in real time against unpredictable emergencies.
- **Rewarding Play:** Coins, new cards, and leaderboard progress are tied to speed and skill, with repeated play encouraged by randomness and special rewards.
- **Handheld Nostalgia + Modern Flair:** Every pixel, panel, and effect leans into retro style, while modern UI polish ensures a seamless, satisfying experience.

---

This screen is the lively, tactical arena where players prove their plumber prowess, collect rewards, and experience the pixel-powered fun at the core of **Pocket Plumbers**!