import Head from "next/head"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Search as SearchIcon, Star, StarOff, User, Wrench, Timer, Zap, Plus, X, ArrowLeft, ShoppingBag, Layers } from "lucide-react"

type BaseCard = {
  type: "plumber" | "tool" | "excuse" | "power-up" | "sandwich"
  name: string
  baseFilename: string
  visualDescription: string
  price: number
  rarity: 1 | 2 | 3 | 4
}

type PlumberCard = BaseCard & { type: "plumber"; hp: number; damage: number }
type ToolCard = BaseCard & { type: "tool"; damage: number }
type ExcuseCard = BaseCard & { type: "excuse"; timeGain: number }
type PowerUpCard =
  | (BaseCard & { type: "power-up"; damageMultiplier: number; healthMultiplier?: never })
  | (BaseCard & { type: "power-up"; healthMultiplier: number; damageMultiplier?: never })
type SandwichCard = BaseCard & { type: "sandwich"; health: number }

type Card = PlumberCard | ToolCard | ExcuseCard | PowerUpCard | SandwichCard

type CollectionEntry = {
  qty: number
  acquiredAt: number
}

type Deck = {
  id: string
  name: string
  cards: string[] // array of baseFilename references
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : initialValue
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])
  return [value, setValue] as const
}

const ALL_CARDS: Card[] = [
  {
    type: "plumber",
    name: "Turbo Tony",
    baseFilename: "plumber_turbo_tony",
    visualDescription: "A burly plumber with a big red wrench and a confident grin. Wears blue coveralls and a tool belt.",
    price: 300,
    rarity: 3,
    hp: 100,
    damage: 25
  },
  {
    type: "plumber",
    name: "Speedy Sal",
    baseFilename: "plumber_speedy_sal",
    visualDescription: "A slim, speedy plumber in green with goggles and rollerblades attached to his boots.",
    price: 250,
    rarity: 2,
    hp: 80,
    damage: 19
  },
  {
    type: "plumber",
    name: "Mighty Mona",
    baseFilename: "plumber_mighty_mona",
    visualDescription: "A tall, muscular woman holding two plungers, ready for battle. Has utility pouches and an iconic yellow cap.",
    price: 320,
    rarity: 4,
    hp: 105,
    damage: 29
  },
  {
    type: "plumber",
    name: "Wrenchin’ Wes",
    baseFilename: "plumber_wrenchin_wes",
    visualDescription: "A young, scrappy plumber with spiky hair and an oversized wrench slung over his shoulder.",
    price: 180,
    rarity: 1,
    hp: 65,
    damage: 17
  },
  {
    type: "plumber",
    name: "Pipe Pro Paula",
    baseFilename: "plumber_pipe_pro_paula",
    visualDescription: "A stylish plumber with fluorescent-pink gloves, glasses, and a digital leak detector.",
    price: 220,
    rarity: 2,
    hp: 75,
    damage: 22
  },
  {
    type: "tool",
    name: "Mega Plunger",
    baseFilename: "tool_mega_plunger",
    visualDescription: "A bright orange, oversized plunger with a metal handle and glowing accents.",
    price: 90,
    rarity: 2,
    damage: 14
  },
  {
    type: "tool",
    name: "Snake-O-Matic",
    baseFilename: "tool_snake_o_matic",
    visualDescription: "A mechanical, coiled drain snake that retracts and extends with buttons.",
    price: 110,
    rarity: 3,
    damage: 20
  },
  {
    type: "tool",
    name: "Leak Detector",
    baseFilename: "tool_leak_detector",
    visualDescription: "A hi-tech gadget with blinking blue lights to find hidden leaks.",
    price: 60,
    rarity: 1,
    damage: 6
  },
  {
    type: "tool",
    name: "Pipe Patch Kit",
    baseFilename: "tool_pipe_patch_kit",
    visualDescription: "A small metal box filled with tape, putty, and quick fixes for cracks.",
    price: 75,
    rarity: 2,
    damage: 10
  },
  {
    type: "tool",
    name: "Turbo Torque Wrench",
    baseFilename: "tool_turbo_torque_wrench",
    visualDescription: "A gleaming chrome wrench with digital torque settings.",
    price: 100,
    rarity: 3,
    damage: 18
  },
  {
    type: "excuse",
    name: "Blame the Dog",
    baseFilename: "excuse_blame_the_dog",
    visualDescription: "A comical card featuring a guilty-looking dog next to a puddle.",
    price: 45,
    rarity: 1,
    timeGain: 5
  },
  {
    type: "excuse",
    name: "Traffic Jam",
    baseFilename: "excuse_traffic_jam",
    visualDescription: "A cartoon traffic jam blocks a city street full of plumbers.",
    price: 60,
    rarity: 2,
    timeGain: 8
  },
  {
    type: "excuse",
    name: "Misplaced Tools",
    baseFilename: "excuse_misplaced_tools",
    visualDescription: "A messy toolbox with open drawers and scattered wrenches.",
    price: 30,
    rarity: 1,
    timeGain: 3
  },
  {
    type: "excuse",
    name: "Parts on Backorder",
    baseFilename: "excuse_parts_on_backorder",
    visualDescription: "A computer with a 'backorder' alert on the screen.",
    price: 80,
    rarity: 3,
    timeGain: 10
  },
  {
    type: "excuse",
    name: "Client Not Home",
    baseFilename: "excuse_client_not_home",
    visualDescription: "A locked door with a 'Sorry, missed you' note.",
    price: 65,
    rarity: 2,
    timeGain: 6
  },
  {
    type: "power-up",
    name: "Caffeinated Surge",
    baseFilename: "powerup_caffeinated_surge",
    visualDescription: "A neon coffee mug overflowing with energy bolts.",
    price: 70,
    rarity: 2,
    damageMultiplier: 1.2
  },
  {
    type: "power-up",
    name: "Unbreakable Gloves",
    baseFilename: "powerup_unbreakable_gloves",
    visualDescription: "Shiny black gloves etched with golden symbols.",
    price: 120,
    rarity: 4,
    healthMultiplier: 1.25
  },
  {
    type: "power-up",
    name: "Safety Goggles",
    baseFilename: "powerup_safety_goggles",
    visualDescription: "Translucent blue goggles radiating a protective aura.",
    price: 55,
    rarity: 1,
    healthMultiplier: 1.1
  },
  {
    type: "power-up",
    name: "Protein Shake",
    baseFilename: "powerup_protein_shake",
    visualDescription: "A sports bottle with liquid strength sloshing inside.",
    price: 85,
    rarity: 2,
    damageMultiplier: 1.15
  },
  {
    type: "power-up",
    name: "Quick Reflexes",
    baseFilename: "powerup_quick_reflexes",
    visualDescription: "A pair of hands juggling pipes, tools, and a wrench all at once.",
    price: 95,
    rarity: 3,
    damageMultiplier: 1.18
  },
  {
    type: "sandwich",
    name: "Classic Sub",
    baseFilename: "sandwich_classic_sub",
    visualDescription: "A traditional submarine sandwich overflowing with deli meats and cheese.",
    price: 35,
    rarity: 1,
    health: 22
  },
  {
    type: "sandwich",
    name: "Mega BLT",
    baseFilename: "sandwich_mega_blt",
    visualDescription: "A huge BLT with crisp lettuce and bacon, radiating tempting aroma.",
    price: 50,
    rarity: 2,
    health: 33
  },
  {
    type: "sandwich",
    name: "Spicy Wrap",
    baseFilename: "sandwich_spicy_wrap",
    visualDescription: "A tightly-rolled wrap with bright peppers peeking out the sides.",
    price: 48,
    rarity: 2,
    health: 29
  },
  {
    type: "sandwich",
    name: "Veggie Hoagie",
    baseFilename: "sandwich_veggie_hoagie",
    visualDescription: "A fresh green hoagie loaded with crisp veggies and creamy dressing.",
    price: 42,
    rarity: 1,
    health: 18
  },
  {
    type: "sandwich",
    name: "Energy Bagel",
    baseFilename: "sandwich_energy_bagel",
    visualDescription: "A plump bagel with sunflower seeds and glowing cream cheese.",
    price: 37,
    rarity: 1,
    health: 20
  },
  {
    type: "tool",
    name: "Copper Pipe Set",
    baseFilename: "tool_copper_pipe_set",
    visualDescription: "A bundle of shiny copper pipes ready for installation.",
    price: 80,
    rarity: 2,
    damage: 12
  },
  {
    type: "tool",
    name: "Waterproof Tape",
    baseFilename: "tool_waterproof_tape",
    visualDescription: "A roll of gray, ultra-sticky tape that magically seals leaks.",
    price: 70,
    rarity: 1,
    damage: 8
  },
  {
    type: "tool",
    name: "Mini Shop Vac",
    baseFilename: "tool_mini_shop_vac",
    visualDescription: "A portable vacuum with wheels and a big blue button.",
    price: 60,
    rarity: 1,
    damage: 5
  },
  {
    type: "plumber",
    name: "Delicate Dani",
    baseFilename: "plumber_delicate_dani",
    visualDescription: "A careful, meticulous plumber with small tools and surgical gloves.",
    price: 190,
    rarity: 1,
    hp: 60,
    damage: 15
  },
  {
    type: "power-up",
    name: "Inspirational Playlist",
    baseFilename: "powerup_inspirational_playlist",
    visualDescription: "A phone with musical notes floating around, headphones plugged in.",
    price: 78,
    rarity: 2,
    damageMultiplier: 1.12
  },
  {
    type: "excuse",
    name: "Epic Rainstorm",
    baseFilename: "excuse_epic_rainstorm",
    visualDescription: "A deluge outside the window with flashing thunderbolts.",
    price: 70,
    rarity: 2,
    timeGain: 7
  },
  {
    type: "plumber",
    name: "Old School Stan",
    baseFilename: "plumber_old_school_stan",
    visualDescription: "A gray-bearded plumber in suspenders, wielding a classic monkey wrench.",
    price: 240,
    rarity: 2,
    hp: 90,
    damage: 21
  },
  {
    type: "tool",
    name: "Liquid Drain Blaster",
    baseFilename: "tool_liquid_drain_blaster",
    visualDescription: "A big blue and red bottle with warning labels, bubbling with potent chemicals.",
    price: 85,
    rarity: 2,
    damage: 13
  },
  {
    type: "plumber",
    name: "Techie Tessa",
    baseFilename: "plumber_techie_tessa",
    visualDescription: "A high-tech plumber adorned with smart glasses and a tablet for diagnostics.",
    price: 250,
    rarity: 3,
    hp: 85,
    damage: 20
  },
  {
    type: "tool",
    name: "Pipe Cutter Deluxe",
    baseFilename: "tool_pipe_cutter_deluxe",
    visualDescription: "A heavy-duty red pipe cutter with a digital readout.",
    price: 95,
    rarity: 2,
    damage: 16
  }
]

// Utility maps
const rarityLabel: Record<Card["rarity"], string> = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Epic"
}

const typeOrder: Record<Card["type"], number> = {
  plumber: 1,
  tool: 2,
  "power-up": 3,
  sandwich: 4,
  excuse: 5
}

function powerScore(card: Card): number {
  switch (card.type) {
    case "plumber":
      return Math.round(card.hp * 0.6 + card.damage * 2) // balanced weighting
    case "tool":
      return card.damage * 3
    case "power-up":
      // scale multipliers into a comparable score
      if ("damageMultiplier" in card && card.damageMultiplier) return Math.round((card.damageMultiplier - 1) * 100)
      if ("healthMultiplier" in card && card.healthMultiplier) return Math.round((card.healthMultiplier - 1) * 100)
      return 0
    case "sandwich":
      return card.health * 2
    case "excuse":
      return card.timeGain * 4
  }
}

function typeIcon(t: Card["type"]) {
  const base = "w-5 h-5 text-emerald-500"
  switch (t) {
    case "plumber":
      return <User className={base} aria-hidden />
    case "tool":
      return <Wrench className={base} aria-hidden />
    case "power-up":
      return <Zap className={base} aria-hidden />
    case "excuse":
      return <Timer className={base} aria-hidden />
    case "sandwich":
      return <span className="text-lg" aria-hidden>🥪</span>
  }
}

function cls(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ")
}

export default function CardListPage() {
  // Persistent stores
  const [collection, setCollection] = useLocalStorage<Record<string, CollectionEntry>>("pp.collection", {})
  const [favorites, setFavorites] = useLocalStorage<string[]>("pp.favorites", [])
  const [decks, setDecks] = useLocalStorage<Deck[]>("pp.decks", [])
  const [activeDeckId, setActiveDeckId] = useLocalStorage<string | null>("pp.activeDeckId", null)

  // UI state
  const [search, setSearch] = useLocalStorage<string>("pp.cards.search", "")
  const [typeFilter, setTypeFilter] = useLocalStorage<Card["type"] | "all">("pp.cards.typeFilter", "all")
  const [sortBy, setSortBy] = useLocalStorage<"name" | "rarity" | "type" | "power" | "recent">("pp.cards.sortBy", "name")
  const [inspect, setInspect] = useState<Card | null>(null)
  const [showDeckPicker, setShowDeckPicker] = useState<null | { mode: "single" | "bulk"; card?: Card }>(null)
  const [deckPickerSelection, setDeckPickerSelection] = useState<string>("")

  // One-time seed for collection (give the player 1 of each card on first visit)
  useEffect(() => {
    if (!collection || Object.keys(collection).length === 0) {
      const now = Date.now()
      const seeded: Record<string, CollectionEntry> = {}
      ALL_CARDS.forEach((c, i) => {
        seeded[c.baseFilename] = { qty: 1, acquiredAt: now - i * 1000 } // staggered times
      })
      setCollection(seeded)
    }
    // seed a default deck if none exists
    if (decks.length === 0) {
      const starter: Deck = { id: `deck_${Date.now()}`, name: "Starter Deck", cards: [] }
      setDecks([starter])
      setActiveDeckId(starter.id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const entries = Object.entries(collection || {})
    const total = entries.reduce((sum, [, v]) => sum + (v?.qty || 0), 0)
    const unique = entries.filter(([, v]) => (v?.qty || 0) > 0).length
    const favCount = favorites.length
    return { total, unique, favCount }
  }, [collection, favorites])

  const filteredAndSorted = useMemo(() => {
    let cards = ALL_CARDS.slice()

    // Filter by type
    if (typeFilter !== "all") {
      cards = cards.filter((c) => c.type === typeFilter)
    }
    // Search by name or description
    if (search.trim()) {
      const q = search.toLowerCase()
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.visualDescription.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      )
    }
    // Sort
    cards.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rarity":
          return b.rarity - a.rarity || a.name.localeCompare(b.name)
        case "type":
          return typeOrder[a.type] - typeOrder[b.type] || a.name.localeCompare(b.name)
        case "power":
          return powerScore(b) - powerScore(a) || a.name.localeCompare(b.name)
        case "recent": {
          const aTime = collection[a.baseFilename]?.acquiredAt ?? 0
          const bTime = collection[b.baseFilename]?.acquiredAt ?? 0
          return bTime - aTime
        }
        default:
          return 0
      }
    })
    return cards
  }, [typeFilter, search, sortBy, collection])

  function isFavorite(basename: string) {
    return favorites.includes(basename)
  }

  function toggleFavorite(basename: string) {
    setFavorites((prev) =>
      prev.includes(basename) ? prev.filter((x) => x !== basename) : [...prev, basename]
    )
  }

  function ensureDeckSelection() {
    if (!deckPickerSelection) {
      const defaultId = activeDeckId || decks[0]?.id
      if (defaultId) setDeckPickerSelection(defaultId)
    }
  }

  function addCardToDeck(targetDeckId: string, baseFilename: string) {
    setDecks((prev) =>
      prev.map((d) =>
        d.id === targetDeckId ? { ...d, cards: [...d.cards, baseFilename] } : d
      )
    )
    if (!activeDeckId) setActiveDeckId(targetDeckId)
  }

  function addBulkToDeck(targetDeckId: string, cardBaseFilenames: string[]) {
    if (cardBaseFilenames.length === 0) return
    setDecks((prev) =>
      prev.map((d) =>
        d.id === targetDeckId ? { ...d, cards: [...d.cards, ...cardBaseFilenames] } : d
      )
    )
    if (!activeDeckId) setActiveDeckId(targetDeckId)
  }

  function rarityTint(r: Card["rarity"]) {
    switch (r) {
      case 1:
        return "text-gray-700"
      case 2:
        return "text-emerald-500"
      case 3:
        return "text-emerald-500"
      case 4:
        return "text-emerald-400"
    }
  }

  function CardPanel({ card }: { card: Card }) {
    const owned = collection[card.baseFilename]?.qty ?? 0
    const fav = isFavorite(card.baseFilename)
    const ps = powerScore(card)

    return (
      <div
        className={cls(
          "bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-4 py-3",
          "relative overflow-hidden transition-transform hover:scale-105 cursor-pointer group"
        )}
        role="button"
        tabIndex={0}
        onClick={() => setInspect(card)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setInspect(card)
        }}
      >
        <div className="absolute top-2 right-2 text-xs uppercase tracking-widest font-bold">
          <span className={cls(rarityTint(card.rarity))}>{rarityLabel[card.rarity]}</span>
        </div>
        <div className="absolute top-2 left-2" aria-hidden>
          {typeIcon(card.type)}
        </div>
        <div className="flex items-start gap-3">
          <img
            src={`/cards/${card.baseFilename}.png`}
            alt={card.name}
            className="w-16 h-16 rounded border border-emerald-500 bg-white object-cover"
            loading="lazy"
          />
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 drop-shadow-[0_1px_0_rgba(34,197,94,0.9)] leading-tight uppercase tracking-wide">
              {card.name}
            </h3>
            <p className="text-gray-700 text-xs md:text-sm mt-1 line-clamp-2">{card.visualDescription}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-emerald-600 font-mono">Power: {ps}</span>
              {"hp" in card && (
                <span className="text-gray-600">HP: {(card as PlumberCard).hp}</span>
              )}
              {"damage" in card && card.type !== "plumber" && (
                <span className="text-gray-600">DMG: {(card as ToolCard).damage}</span>
              )}
              {card.type === "plumber" && (
                <span className="text-gray-600">DMG: {(card as PlumberCard).damage}</span>
              )}
              {"timeGain" in card && (
                <span className="text-gray-600">Time +{(card as ExcuseCard).timeGain}s</span>
              )}
              {"damageMultiplier" in card && (card as any).damageMultiplier && (
                <span className="text-gray-600">
                  DMG x{(card as PowerUpCard).damageMultiplier?.toFixed(2)}
                </span>
              )}
              {"healthMultiplier" in card && (card as any).healthMultiplier && (
                <span className="text-gray-600">
                  HP x{(card as PowerUpCard).healthMultiplier?.toFixed(2)}
                </span>
              )}
              {"health" in card && (
                <span className="text-gray-600">Heal: {(card as SandwichCard).health}</span>
              )}
              <span className="text-gray-400">Qty: {owned}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDeckPicker({ mode: "single", card })
              ensureDeckSelection()
            }}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700"
            aria-label={`Add ${card.name} to deck`}
          >
            Add to Deck
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(card.baseFilename)
            }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={cls(
              "inline-flex items-center gap-1 text-xs font-semibold",
              fav ? "text-emerald-600" : "text-gray-500 group-hover:text-gray-700"
            )}
          >
            {fav ? <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" /> : <StarOff className="w-4 h-4" />}
            <span className="uppercase tracking-wider">{fav ? "Favorited" : "Favorite"}</span>
          </button>
        </div>
      </div>
    )
  }

  function DeckPickerModal() {
    if (!showDeckPicker) return null
    const mode = showDeckPicker.mode
    const selectedDeck = decks.find((d) => d.id === deckPickerSelection) || decks[0]
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowDeckPicker(null)} />
        <div className="relative bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 max-w-md w-[92%] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-emerald-400 text-xl md:text-2xl font-bold uppercase drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
              {mode === "single" ? "Add to Deck" : "Add Filtered to Deck"}
            </h2>
            <button
              onClick={() => setShowDeckPicker(null)}
              className="text-gray-300 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === "single" && showDeckPicker.card && (
            <div className="mb-3 flex items-center gap-3 bg-gray-600/50 rounded-md p-2 border border-gray-500">
              <img
                src={`/cards/${showDeckPicker.card.baseFilename}.png`}
                alt={showDeckPicker.card.name}
                className="w-12 h-12 rounded border border-emerald-500 bg-white object-cover"
              />
              <div>
                <div className="text-gray-100 font-semibold uppercase tracking-wide">
                  {showDeckPicker.card.name}
                </div>
                <div className="text-xs text-gray-300">Power: {powerScore(showDeckPicker.card)}</div>
              </div>
            </div>
          )}

          <label className="block text-sm text-gray-200 mb-1 uppercase tracking-wider">Choose Deck</label>
          <div className="relative mb-3">
            <select
              className="w-full appearance-none bg-gray-800 text-gray-100 border border-gray-500 rounded px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={deckPickerSelection || selectedDeck?.id || ""}
              onChange={(e) => setDeckPickerSelection(e.target.value)}
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <CreateDeckInline
            onCreate={(name) => {
              const newDeck: Deck = { id: `deck_${Date.now()}`, name: name || "New Deck", cards: [] }
              setDecks((prev) => [...prev, newDeck])
              setDeckPickerSelection(newDeck.id)
            }}
          />

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => setShowDeckPicker(null)}
              className="px-3 py-2 text-xs uppercase tracking-wider rounded border border-gray-400 text-gray-200 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const targetId = deckPickerSelection || selectedDeck?.id
                if (!targetId) return
                if (mode === "single" && showDeckPicker.card) {
                  addCardToDeck(targetId, showDeckPicker.card.baseFilename)
                } else if (mode === "bulk") {
                  addBulkToDeck(
                    targetId,
                    filteredAndSorted.map((c) => c.baseFilename)
                  )
                }
                setShowDeckPicker(null)
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    )
  }

  function CreateDeckInline({ onCreate }: { onCreate: (name: string) => void }) {
    const [creating, setCreating] = useState(false)
    const [name, setName] = useState("")
    if (!creating) {
      return (
        <button
          onClick={() => setCreating(true)}
          className="mt-2 text-xs text-emerald-300 hover:text-emerald-200 underline"
        >
          + Create new deck
        </button>
      )
    }
    return (
      <div className="mt-2 flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deck name"
          className="flex-1 bg-gray-800 text-gray-100 border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => {
            onCreate(name.trim())
            setName("")
            setCreating(false)
          }}
          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700"
        >
          Create
        </button>
        <button
          onClick={() => setCreating(false)}
          className="px-3 py-2 text-xs uppercase tracking-wider rounded border border-gray-400 text-gray-200 hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    )
  }

  function InspectModal() {
    if (!inspect) return null
    const owned = collection[inspect.baseFilename]?.qty ?? 0
    const ps = powerScore(inspect)
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => setInspect(null)} />
        <div className="relative bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 max-w-lg w-[94%] mx-auto">
          <div className="flex items-start gap-4">
            <img
              src={`/cards/${inspect.baseFilename}.png`}
              alt={inspect.name}
              className="w-28 h-28 rounded border-2 border-emerald-500 bg-white object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-emerald-400 text-2xl font-bold uppercase drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                  {inspect.name}
                </h3>
                <span className={cls("text-xs uppercase tracking-widest font-bold", rarityTint(inspect.rarity))}>
                  {rarityLabel[inspect.rarity]}
                </span>
              </div>
              <div className="mt-1 text-gray-300 text-sm">{inspect.visualDescription}</div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-gray-200">
                  {typeIcon(inspect.type)}
                  <span className="capitalize">{inspect.type}</span>
                </span>
                <span className="text-emerald-300 font-mono">Power: {ps}</span>
                {"hp" in inspect && <span className="text-gray-300">HP: {(inspect as PlumberCard).hp}</span>}
                {"damage" in inspect && inspect.type !== "plumber" && (
                  <span className="text-gray-300">DMG: {(inspect as ToolCard).damage}</span>
                )}
                {inspect.type === "plumber" && (
                  <span className="text-gray-300">DMG: {(inspect as PlumberCard).damage}</span>
                )}
                {"timeGain" in inspect && <span className="text-gray-300">Time +{(inspect as ExcuseCard).timeGain}s</span>}
                {"damageMultiplier" in inspect && (inspect as any).damageMultiplier && (
                  <span className="text-gray-300">
                    DMG x{(inspect as PowerUpCard).damageMultiplier?.toFixed(2)}
                  </span>
                )}
                {"healthMultiplier" in inspect && (inspect as any).healthMultiplier && (
                  <span className="text-gray-300">
                    HP x{(inspect as PowerUpCard).healthMultiplier?.toFixed(2)}
                  </span>
                )}
                {"health" in inspect && <span className="text-gray-300">Heal: {(inspect as SandwichCard).health}</span>}
                <span className="text-gray-400">Owned: {owned}</span>
                <span className="text-gray-400">Price: {inspect.price}c</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDeckPicker({ mode: "single", card: inspect })
                    ensureDeckSelection()
                  }}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Deck
                </button>
                <button
                  onClick={() => toggleFavorite(inspect.baseFilename)}
                  className={cls(
                    "px-3 py-2 text-white font-bold uppercase text-xs rounded border",
                    isFavorite(inspect.baseFilename)
                      ? "bg-emerald-600 border-emerald-800"
                      : "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  )}
                >
                  {isFavorite(inspect.baseFilename) ? "Favorited" : "Favorite"}
                </button>
                <button
                  onClick={() => setInspect(null)}
                  className="ml-auto px-3 py-2 text-xs uppercase tracking-wider rounded border border-gray-400 text-gray-200 hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Pocket Plumbers • Card List</title>
        <meta name="description" content="Browse and manage your Pocket Plumbers card collection." />
      </Head>

      <main className="w-full min-h-screen bg-gray-900 relative font-mono text-gray-100">
        <div className="absolute inset-0 opacity-20 bg-[url('/pixelgrid.svg')] pointer-events-none" aria-hidden />
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Header */}
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-white text-sm uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </div>
              <h1 className="text-emerald-500 text-2xl md:text-3xl font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                Card List
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  href="/deck"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs uppercase tracking-wider"
                  aria-label="Go to Decks"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Decks
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs uppercase tracking-wider"
                  aria-label="Go to Shop"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Shop
                </Link>
              </div>
            </div>
          </header>

          {/* Stat Bar & Filters */}
          <section className="bg-gray-800 rounded-md border border-gray-200 shadow-md px-4 py-3 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-emerald-400">{stats.total}</div>
                <div className="uppercase text-xs text-gray-300 tracking-wide">Total Cards</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-emerald-400">{stats.unique}</div>
                <div className="uppercase text-xs text-gray-300 tracking-wide">Unique</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-emerald-400">{stats.favCount}</div>
                <div className="uppercase text-xs text-gray-300 tracking-wide">Favorites</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-3">
              {/* Filter */}
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">Filter</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-gray-900 text-gray-100 border border-gray-600 rounded px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    aria-label="Filter by card type"
                  >
                    <option value="all">All</option>
                    <option value="plumber">Plumbers</option>
                    <option value="tool">Tools</option>
                    <option value="power-up">Power-ups</option>
                    <option value="sandwich">Sandwiches</option>
                    <option value="excuse">Excuses</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">Sort By</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-gray-900 text-gray-100 border border-gray-600 rounded px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Sort cards"
                  >
                    <option value="name">Name</option>
                    <option value="rarity">Rarity</option>
                    <option value="type">Type</option>
                    <option value="power">Power Level</option>
                    <option value="recent">Recently Acquired</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find a card…"
                    aria-label="Search cards"
                    className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded px-9 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500"
                  />
                  <SearchIcon className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Grid */}
          {filteredAndSorted.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="mx-auto inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 border-2 border-emerald-500 shadow-lg">
                <User className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold uppercase tracking-wider">No Cards Found</h3>
              <p className="mt-1 text-sm text-gray-400">Try adjusting filters or search terms.</p>
              <div className="mt-4">
                <Link
                  href="/shop"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-xs rounded border border-emerald-700"
                >
                  Visit Shop
                </Link>
              </div>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-28">
              {filteredAndSorted.map((card) => (
                <CardPanel key={card.baseFilename} card={card} />
              ))}
            </section>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setShowDeckPicker({ mode: "bulk" })
            ensureDeckSelection()
          }}
          className="fixed bottom-6 right-6 z-30 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full shadow-2xl border-2 border-emerald-700 px-5 py-3 uppercase tracking-widest inline-flex items-center gap-2"
          aria-label="Add filtered cards to deck"
        >
          <Plus className="w-5 h-5" />
          Add to Deck
        </button>

        {/* Modals */}
        <InspectModal />
        <DeckPickerModal />
      </main>
    </>
  )
}