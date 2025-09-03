import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  Edit3,
  Save,
  Copy,
  Trash2,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Info,
} from "lucide-react"

type CardBase = {
  type: "plumber" | "tool" | "excuse" | "power-up" | "sandwich"
  name: string
  baseFilename: string
  visualDescription: string
  price: number
  rarity: 1 | 2 | 3 | 4 | 5
}
type PlumberCard = CardBase & { type: "plumber"; hp: number; damage: number }
type ToolCard = CardBase & { type: "tool"; damage: number }
type ExcuseCard = CardBase & { type: "excuse"; timeGain: number }
type PowerUpCard =
  | (CardBase & { type: "power-up"; damageMultiplier: number; healthMultiplier?: never })
  | (CardBase & { type: "power-up"; healthMultiplier: number; damageMultiplier?: never })
type SandwichCard = CardBase & { type: "sandwich"; health: number }
type Card = PlumberCard | ToolCard | ExcuseCard | PowerUpCard | SandwichCard

const allCards: Card[] = [
  {
    type: "plumber",
    name: "Turbo Tony",
    baseFilename: "plumber_turbo_tony",
    visualDescription:
      "A burly plumber with a big red wrench and a confident grin. Wears blue coveralls and a tool belt.",
    price: 300,
    rarity: 3,
    hp: 100,
    damage: 25,
  },
  {
    type: "plumber",
    name: "Speedy Sal",
    baseFilename: "plumber_speedy_sal",
    visualDescription:
      "A slim, speedy plumber in green with goggles and rollerblades attached to his boots.",
    price: 250,
    rarity: 2,
    hp: 80,
    damage: 19,
  },
  {
    type: "plumber",
    name: "Mighty Mona",
    baseFilename: "plumber_mighty_mona",
    visualDescription:
      "A tall, muscular woman holding two plungers, ready for battle. Has utility pouches and an iconic yellow cap.",
    price: 320,
    rarity: 4,
    hp: 105,
    damage: 29,
  },
  {
    type: "plumber",
    name: "Wrenchin’ Wes",
    baseFilename: "plumber_wrenchin_wes",
    visualDescription:
      "A young, scrappy plumber with spiky hair and an oversized wrench slung over his shoulder.",
    price: 180,
    rarity: 1,
    hp: 65,
    damage: 17,
  },
  {
    type: "plumber",
    name: "Pipe Pro Paula",
    baseFilename: "plumber_pipe_pro_paula",
    visualDescription:
      "A stylish plumber with fluorescent-pink gloves, glasses, and a digital leak detector.",
    price: 220,
    rarity: 2,
    hp: 75,
    damage: 22,
  },
  {
    type: "tool",
    name: "Mega Plunger",
    baseFilename: "tool_mega_plunger",
    visualDescription:
      "A bright orange, oversized plunger with a metal handle and glowing accents.",
    price: 90,
    rarity: 2,
    damage: 14,
  },
  {
    type: "tool",
    name: "Snake-O-Matic",
    baseFilename: "tool_snake_o_matic",
    visualDescription:
      "A mechanical, coiled drain snake that retracts and extends with buttons.",
    price: 110,
    rarity: 3,
    damage: 20,
  },
  {
    type: "tool",
    name: "Leak Detector",
    baseFilename: "tool_leak_detector",
    visualDescription:
      "A hi-tech gadget with blinking blue lights to find hidden leaks.",
    price: 60,
    rarity: 1,
    damage: 6,
  },
  {
    type: "tool",
    name: "Pipe Patch Kit",
    baseFilename: "tool_pipe_patch_kit",
    visualDescription:
      "A small metal box filled with tape, putty, and quick fixes for cracks.",
    price: 75,
    rarity: 2,
    damage: 10,
  },
  {
    type: "tool",
    name: "Turbo Torque Wrench",
    baseFilename: "tool_turbo_torque_wrench",
    visualDescription:
      "A gleaming chrome wrench with digital torque settings.",
    price: 100,
    rarity: 3,
    damage: 18,
  },
  {
    type: "excuse",
    name: "Blame the Dog",
    baseFilename: "excuse_blame_the_dog",
    visualDescription:
      "A comical card featuring a guilty-looking dog next to a puddle.",
    price: 45,
    rarity: 1,
    timeGain: 5,
  },
  {
    type: "excuse",
    name: "Traffic Jam",
    baseFilename: "excuse_traffic_jam",
    visualDescription:
      "A cartoon traffic jam blocks a city street full of plumbers.",
    price: 60,
    rarity: 2,
    timeGain: 8,
  },
  {
    type: "excuse",
    name: "Misplaced Tools",
    baseFilename: "excuse_misplaced_tools",
    visualDescription:
      "A messy toolbox with open drawers and scattered wrenches.",
    price: 30,
    rarity: 1,
    timeGain: 3,
  },
  {
    type: "excuse",
    name: "Parts on Backorder",
    baseFilename: "excuse_parts_on_backorder",
    visualDescription: "A computer with a 'backorder' alert on the screen.",
    price: 80,
    rarity: 3,
    timeGain: 10,
  },
  {
    type: "excuse",
    name: "Client Not Home",
    baseFilename: "excuse_client_not_home",
    visualDescription: "A locked door with a 'Sorry, missed you' note.",
    price: 65,
    rarity: 2,
    timeGain: 6,
  },
  {
    type: "power-up",
    name: "Caffeinated Surge",
    baseFilename: "powerup_caffeinated_surge",
    visualDescription:
      "A neon coffee mug overflowing with energy bolts.",
    price: 70,
    rarity: 2,
    damageMultiplier: 1.2,
  },
  {
    type: "power-up",
    name: "Unbreakable Gloves",
    baseFilename: "powerup_unbreakable_gloves",
    visualDescription:
      "Shiny black gloves etched with golden symbols.",
    price: 120,
    rarity: 4,
    healthMultiplier: 1.25,
  },
  {
    type: "power-up",
    name: "Safety Goggles",
    baseFilename: "powerup_safety_goggles",
    visualDescription:
      "Translucent blue goggles radiating a protective aura.",
    price: 55,
    rarity: 1,
    healthMultiplier: 1.1,
  },
  {
    type: "power-up",
    name: "Protein Shake",
    baseFilename: "powerup_protein_shake",
    visualDescription:
      "A sports bottle with liquid strength sloshing inside.",
    price: 85,
    rarity: 2,
    damageMultiplier: 1.15,
  },
  {
    type: "power-up",
    name: "Quick Reflexes",
    baseFilename: "powerup_quick_reflexes",
    visualDescription:
      "A pair of hands juggling pipes, tools, and a wrench all at once.",
    price: 95,
    rarity: 3,
    damageMultiplier: 1.18,
  },
  {
    type: "sandwich",
    name: "Classic Sub",
    baseFilename: "sandwich_classic_sub",
    visualDescription:
      "A traditional submarine sandwich overflowing with deli meats and cheese.",
    price: 35,
    rarity: 1,
    health: 22,
  },
  {
    type: "sandwich",
    name: "Mega BLT",
    baseFilename: "sandwich_mega_blt",
    visualDescription:
      "A huge BLT with crisp lettuce and bacon, radiating tempting aroma.",
    price: 50,
    rarity: 2,
    health: 33,
  },
  {
    type: "sandwich",
    name: "Spicy Wrap",
    baseFilename: "sandwich_spicy_wrap",
    visualDescription:
      "A tightly-rolled wrap with bright peppers peeking out the sides.",
    price: 48,
    rarity: 2,
    health: 29,
  },
  {
    type: "sandwich",
    name: "Veggie Hoagie",
    baseFilename: "sandwich_veggie_hoagie",
    visualDescription:
      "A fresh green hoagie loaded with crisp veggies and creamy dressing.",
    price: 42,
    rarity: 1,
    health: 18,
  },
  {
    type: "sandwich",
    name: "Energy Bagel",
    baseFilename: "sandwich_energy_bagel",
    visualDescription:
      "A plump bagel with sunflower seeds and glowing cream cheese.",
    price: 37,
    rarity: 1,
    health: 20,
  },
  {
    type: "tool",
    name: "Copper Pipe Set",
    baseFilename: "tool_copper_pipe_set",
    visualDescription:
      "A bundle of shiny copper pipes ready for installation.",
    price: 80,
    rarity: 2,
    damage: 12,
  },
  {
    type: "tool",
    name: "Waterproof Tape",
    baseFilename: "tool_waterproof_tape",
    visualDescription:
      "A roll of gray, ultra-sticky tape that magically seals leaks.",
    price: 70,
    rarity: 1,
    damage: 8,
  },
  {
    type: "tool",
    name: "Mini Shop Vac",
    baseFilename: "tool_mini_shop_vac",
    visualDescription:
      "A portable vacuum with wheels and a big blue button.",
    price: 60,
    rarity: 1,
    damage: 5,
  },
  {
    type: "plumber",
    name: "Delicate Dani",
    baseFilename: "plumber_delicate_dani",
    visualDescription:
      "A careful, meticulous plumber with small tools and surgical gloves.",
    price: 190,
    rarity: 1,
    hp: 60,
    damage: 15,
  },
  {
    type: "power-up",
    name: "Inspirational Playlist",
    baseFilename: "powerup_inspirational_playlist",
    visualDescription:
      "A phone with musical notes floating around, headphones plugged in.",
    price: 78,
    rarity: 2,
    damageMultiplier: 1.12,
  },
  {
    type: "excuse",
    name: "Epic Rainstorm",
    baseFilename: "excuse_epic_rainstorm",
    visualDescription:
      "A deluge outside the window with flashing thunderbolts.",
    price: 70,
    rarity: 2,
    timeGain: 7,
  },
  {
    type: "plumber",
    name: "Old School Stan",
    baseFilename: "plumber_old_school_stan",
    visualDescription:
      "A gray-bearded plumber in suspenders, wielding a classic monkey wrench.",
    price: 240,
    rarity: 2,
    hp: 90,
    damage: 21,
  },
  {
    type: "tool",
    name: "Liquid Drain Blaster",
    baseFilename: "tool_liquid_drain_blaster",
    visualDescription:
      "A big blue and red bottle with warning labels, bubbling with potent chemicals.",
    price: 85,
    rarity: 2,
    damage: 13,
  },
  {
    type: "plumber",
    name: "Techie Tessa",
    baseFilename: "plumber_techie_tessa",
    visualDescription:
      "A high-tech plumber adorned with smart glasses and a tablet for diagnostics.",
    price: 250,
    rarity: 3,
    hp: 85,
    damage: 20,
  },
  {
    type: "tool",
    name: "Pipe Cutter Deluxe",
    baseFilename: "tool_pipe_cutter_deluxe",
    visualDescription:
      "A heavy-duty red pipe cutter with a digital readout.",
    price: 95,
    rarity: 2,
    damage: 16,
  },
]

const CARD_INDEX: Record<string, Card> = Object.fromEntries(
  allCards.map((c) => [c.baseFilename, c])
)

type Deck = {
  id: string
  name: string
  cards: string[] // array of baseFilenames
  updatedAt: number
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const stored = localStorage.getItem(key)
      if (stored == null) return initialValue
      const parsed = JSON.parse(stored)
      return (parsed ?? initialValue) as T
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {}
    }
  }, [key, value])
  return [value, setValue] as const
}

const DECK_LIMIT = 30
const DEFAULT_DECK_ID = "default"

function computeCardPower(card: Card): number {
  switch (card.type) {
    case "plumber": {
      const c = card as PlumberCard
      return Math.round(c.damage + c.hp / 3)
    }
    case "tool": {
      const c = card as ToolCard
      return c.damage
    }
    case "power-up": {
      const c = card as PowerUpCard
      const dmg = "damageMultiplier" in c && c.damageMultiplier ? (c.damageMultiplier - 1) * 80 : 0
      const hp = "healthMultiplier" in c && c.healthMultiplier ? (c.healthMultiplier - 1) * 80 : 0
      return Math.round(dmg + hp)
    }
    case "excuse": {
      const c = card as ExcuseCard
      return Math.round(c.timeGain * 1.5)
    }
    case "sandwich": {
      const c = card as SandwichCard
      return Math.round(c.health * 0.5)
    }
    default:
      return 0
  }
}

function typeLabel(t: Card["type"]) {
  switch (t) {
    case "plumber":
      return "Plumber"
    case "tool":
      return "Tool"
    case "excuse":
      return "Excuse"
    case "power-up":
      return "Power-Up"
    case "sandwich":
      return "Sandwich"
  }
}

function rarityBadge(rarity: Card["rarity"]) {
  const map: Record<number, string> = {
    1: "Common",
    2: "Uncommon",
    3: "Rare",
    4: "Epic",
    5: "Legendary",
  }
  return map[rarity] || `R${rarity}`
}

// Helper to coerce possibly-bad localStorage data back to array
function asArray<T>(v: any, fallback: T[] = []): T[] {
  return Array.isArray(v) ? v : fallback
}

export default function DeckPage() {
  const router = useRouter()
  const { id } = router.query as { id?: string }

  const [decks, setDecks] = useLocalStorage<Deck[]>("pp_decks", [])
  const [collection, setCollection] = useLocalStorage<string[]>("pp_collection", [])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<null | { action: "delete"; title: string }>(null)
  const [detailCard, setDetailCard] = useState<Card | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"" | Card["type"]>("")
  const [sortKey, setSortKey] = useState<"power" | "rarity" | "name">("power")
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [unsaved, setUnsaved] = useState(false)

  // Initialize collection and at least one deck
  useEffect(() => {
    const col = asArray(collection)
    if (col.length === 0) {
      setCollection(allCards.map((c) => c.baseFilename)) // default: own 1 of each
    }
  }, [])

  // Ensure a deck exists
  useEffect(() => {
    const list = asArray(decks)
    if (list.length === 0) {
      const starter: Deck = {
        id: DEFAULT_DECK_ID,
        name: "Starter Deck",
        cards: [],
        updatedAt: Date.now(),
      }
      setDecks([starter])
    }
  }, [decks, setDecks])

  const currentDeck = useMemo(() => {
    const deckId = id || DEFAULT_DECK_ID
    const list = asArray(decks)
    return list.find((d) => d.id === deckId) || list[0]
  }, [decks, id])

  const [workingName, setWorkingName] = useState<string>("")
  const [workingCards, setWorkingCards] = useState<string[]>([])

  // Sync working state with deck
  useEffect(() => {
    if (currentDeck) {
      setWorkingName(currentDeck.name || "Untitled Deck")
      setWorkingCards(asArray(currentDeck.cards))
      setUnsaved(false)
    }
  }, [currentDeck?.id])

  // Unsaved changes detection
  useEffect(() => {
    if (!currentDeck) return
    const changed =
      workingName.trim() !== (currentDeck.name || "").trim() ||
      JSON.stringify(workingCards) !== JSON.stringify(asArray(currentDeck.cards))
    setUnsaved(changed)
  }, [workingName, workingCards, currentDeck])

  // Warn on unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!unsaved) return
      e.preventDefault()
      e.returnValue = ""
    }
    const routeChangeStart = () => {
      if (!unsaved) return
      const ok = confirm("You have unsaved changes. Leave without saving?")
      if (!ok) {
        // Block by throwing; Next.js will catch and stay on page
        throw "Route change aborted by user"
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    router.events.on("routeChangeStart", routeChangeStart)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      router.events.off("routeChangeStart", routeChangeStart)
    }
  }, [unsaved, router.events])

  const deckCards = useMemo(
    () => asArray(workingCards).map((k) => CARD_INDEX[k]).filter(Boolean) as Card[],
    [workingCards]
  )

  const stats = useMemo(() => {
    const count = deckCards.length
    const avg =
      count === 0 ? 0 : Math.round((deckCards.reduce((a, c) => a + computeCardPower(c), 0) / count) * 10) / 10
    const breakdown = deckCards.reduce<Record<Card["type"], number>>(
      (acc, c) => {
        acc[c.type]++
        return acc
      },
      { plumber: 0, tool: 0, excuse: 0, "power-up": 0, sandwich: 0 }
    )
    return { count, avg, breakdown }
  }, [deckCards])

  const eligibleToAdd = useMemo(() => {
    const owned = new Set(asArray(collection))
    const inDeck = new Set(asArray(workingCards))
    return allCards.filter((c) => owned.has(c.baseFilename) && !inDeck.has(c.baseFilename))
  }, [collection, workingCards])

  const filteredCollection = useMemo(() => {
    let list = eligibleToAdd
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.visualDescription.toLowerCase().includes(q) ||
          typeLabel(c.type).toLowerCase().includes(q)
      )
    }
    if (filterType) {
      list = list.filter((c) => c.type === filterType)
    }
    const byPower = (a: Card, b: Card) => computeCardPower(b) - computeCardPower(a)
    const byRarity = (a: Card, b: Card) => b.rarity - a.rarity
    const byName = (a: Card, b: Card) => a.name.localeCompare(b.name)
    const sorter = sortKey === "power" ? byPower : sortKey === "rarity" ? byRarity : byName
    return [...list].sort(sorter)
  }, [eligibleToAdd, search, filterType, sortKey])

  function saveDeck() {
    if (!currentDeck) return
    const updated: Deck = {
      ...currentDeck,
      name: (workingName || "Untitled Deck").trim(),
      cards: asArray(workingCards).slice(0, DECK_LIMIT),
      updatedAt: Date.now(),
    }
    const list = asArray(decks)
    const next = list.map((d) => (d.id === currentDeck.id ? updated : d))
    setDecks(next)
    setUnsaved(false)
  }

  function deleteDeck() {
    if (!currentDeck) return
    const remaining = asArray(decks).filter((d) => d.id !== currentDeck.id)
    setDecks(remaining.length ? remaining : [{ id: DEFAULT_DECK_ID, name: "Starter Deck", cards: [], updatedAt: Date.now() }])
    setShowConfirm(null)
    router.push("/dashboard")
  }

  function duplicateDeck() {
    if (!currentDeck) return
    const newId = `${currentDeck.id}-${Math.random().toString(36).slice(2, 8)}`
    const copy: Deck = {
      id: newId,
      name: `${currentDeck.name} Copy`,
      cards: [...asArray(workingCards)],
      updatedAt: Date.now(),
    }
    setDecks([...asArray(decks), copy])
    router.push(`/deck?id=${encodeURIComponent(newId)}`)
  }

  function optimizeDeck() {
    const ownedCards = allCards.filter((c) => asArray(collection).includes(c.baseFilename))
    const sorted = [...ownedCards].sort((a, b) => computeCardPower(b) - computeCardPower(a))
    const next: string[] = []
    for (const c of sorted) {
      if (next.length >= DECK_LIMIT) break
      if (next.includes(c.baseFilename)) continue
      next.push(c.baseFilename)
    }
    if (!next.some((k) => CARD_INDEX[k]?.type === "plumber")) {
      const bestPlumber = sorted.find((c) => c.type === "plumber")
      if (bestPlumber) {
        if (next.length >= DECK_LIMIT) {
          next.pop()
        }
        next.unshift(bestPlumber.baseFilename)
      }
    }
    setWorkingCards(next)
  }

  function onDragStart(index: number) {
    setDragIndex(index)
  }
  function onDrop(overIndex: number) {
    if (dragIndex === null || dragIndex === overIndex) return
    setWorkingCards((prev) => {
      const copy = [...asArray(prev)]
      const [moved] = copy.splice(dragIndex, 1)
      copy.splice(overIndex, 0, moved)
      return copy
    })
    setDragIndex(null)
  }

  const headerRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Head>
        <title>Pocket Plumbers — Deck</title>
        <meta name="description" content="Build, edit, and optimize your Pocket Plumbers deck." />
      </Head>

      <main className="w-full min-h-screen bg-gray-900 text-gray-100 font-mono">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded border-2 border-emerald-500 bg-gray-800 px-3 py-1 text-sm uppercase tracking-wider text-emerald-400 hover:bg-gray-700 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-center">
              {!isRenaming ? (
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] text-gray-100 flex items-center gap-2">
                  {workingName || "Untitled Deck"}
                  <button
                    aria-label="Rename deck"
                    onClick={() => {
                      setIsRenaming(true)
                      setTimeout(() => headerRef.current?.focus(), 0)
                    }}
                    className="ml-1 rounded border border-emerald-500 text-emerald-400 hover:text-white hover:bg-emerald-500 transition p-1"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </h1>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    ref={headerRef}
                    value={workingName}
                    onChange={(e) => setWorkingName(e.target.value)}
                    className="bg-gray-800 text-gray-100 rounded border-2 border-emerald-500 px-3 py-1 text-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Deck Name"
                  />
                  <button
                    onClick={() => setIsRenaming(false)}
                    className="rounded border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 uppercase text-xs tracking-widest"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={duplicateDeck}
                className="rounded border-2 border-emerald-500 text-emerald-400 hover:text-white hover:bg-emerald-500 transition px-2 py-1"
                title="Duplicate deck"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowConfirm({ action: "delete", title: "Delete this deck?" })}
                className="rounded border-2 border-red-600 text-red-400 hover:text-white hover:bg-red-600 transition px-2 py-1"
                title="Delete deck"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-md border border-gray-200 shadow-md px-6 py-3 flex flex-wrap gap-6 items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-emerald-400">{stats.avg}</div>
              <div className="uppercase text-xs text-gray-300 tracking-wide">Average Power</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-emerald-400">
                {stats.count}/{DECK_LIMIT}
              </div>
              <div className="uppercase text-xs text-gray-300 tracking-wide">Cards</div>
            </div>
            <div className="flex items-center gap-4">
              <TypePill label="Plumber" count={stats.breakdown["plumber"]} color="emerald" />
              <TypePill label="Tool" count={stats.breakdown["tool"]} color="yellow" />
              <TypePill label="Excuse" count={stats.breakdown["excuse"]} color="sky" />
              <TypePill label="Power-Up" count={stats.breakdown["power-up"]} color="pink" />
              <TypePill label="Sandwich" count={stats.breakdown["sandwich"]} color="lime" />
            </div>
            <div className="ml-auto">
              <button
                onClick={optimizeDeck}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-3 py-1 uppercase tracking-widest transition-colors duration-150 text-xs"
              >
                <Sparkles className="h-4 w-4" />
                Optimize
              </button>
            </div>
          </div>

          {stats.count >= DECK_LIMIT && (
            <div className="mb-3 inline-flex items-center gap-2 bg-yellow-300 text-gray-900 rounded px-3 py-1 font-mono text-sm">
              <Info className="h-4 w-4" />
              Deck Limit Reached: Remove a card to add another.
            </div>
          )}

          <section className="mb-4">
            {deckCards.length === 0 ? (
              <div className="bg-gray-800 border border-gray-200 rounded-lg p-6 text-center shadow relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" />
                <p className="text-gray-200 mb-2">This deck is empty!</p>
                <p className="text-gray-400 text-sm mb-4">
                  Start adding your favorite cards to get ready for battle.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="animate-pulse bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest"
                >
                  <Plus className="inline mr-1 h-4 w-4" />
                  Add Cards
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {deckCards.map((card, idx) => (
                    <div
                      key={`${card.baseFilename}-${idx}`}
                      className="bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-3 py-2 relative overflow-hidden group cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => onDrop(idx)}
                    >
                      <button
                        onClick={() =>
                          setWorkingCards((prev) => asArray(prev).filter((_, i) => i !== idx))
                        }
                        title="Remove from deck"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded border border-red-700 p-1 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      <div
                        onClick={() => setDetailCard(card)}
                        className="cursor-pointer select-none"
                        role="button"
                        tabIndex={0}
                      >
                        <div className="w-full mb-2 rounded overflow-hidden border border-emerald-300">
                          <Image
                            src={`/cards/${card.baseFilename}.png`}
                            alt={card.name}
                            width={400}
                            height={280}
                            className="w-full h-28 object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide leading-tight">
                          {card.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-700">Type: {typeLabel(card.type)}</p>
                          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
                            {rarityBadge(card.rarity)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-700">Power</span>
                          <span className="text-sm font-bold text-emerald-600">
                            {computeCardPower(card)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-wider transition"
                    disabled={stats.count >= DECK_LIMIT}
                  >
                    <Plus className="inline mr-1 h-4 w-4" />
                    Add Cards
                  </button>
                </div>
              </>
            )}
          </section>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={saveDeck}
              disabled={!unsaved}
              className={`inline-flex items-center gap-2 rounded border-2 px-4 py-2 uppercase tracking-widest font-bold transition ${
                unsaved
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                  : "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
              }`}
            >
              <Save className="h-4 w-4" />
              Save Deck
            </button>
            <button
              onClick={() => setIsRenaming(true)}
              className="rounded border-2 border-emerald-500 text-emerald-400 hover:text-white hover:bg-emerald-500 transition px-4 py-2 uppercase tracking-widest"
            >
              Rename
            </button>
            <button
              onClick={() => setShowConfirm({ action: "delete", title: "Delete this deck?" })}
              className="rounded border-2 border-red-600 text-red-400 hover:text-white hover:bg-red-600 transition px-4 py-2 uppercase tracking-widest"
            >
              Delete
            </button>
            <button
              onClick={duplicateDeck}
              className="rounded border-2 border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-700 transition px-4 py-2 uppercase tracking-widest"
            >
              Duplicate
            </button>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-4 md:px-6 py-5 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-emerald-400 text-2xl font-bold uppercase drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Add Cards
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded border-2 border-gray-500 text-gray-200 hover:bg-gray-600 px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center mb-3">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, type, or description"
                  className="w-full bg-gray-800 text-gray-100 rounded pl-8 pr-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-600 rounded px-2 py-1">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType((e.target.value || "") as any)}
                    className="bg-transparent text-gray-200 focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="plumber">Plumber</option>
                    <option value="tool">Tool</option>
                    <option value="excuse">Excuse</option>
                    <option value="power-up">Power-Up</option>
                    <option value="sandwich">Sandwich</option>
                  </select>
                </div>
                <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-600 rounded px-2 py-1">
                  <span className="text-xs text-gray-300 uppercase">Sort</span>
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as any)}
                    className="bg-transparent text-gray-200 focus:outline-none"
                  >
                    <option value="power">Power</option>
                    <option value="rarity">Rarity</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-auto pr-1">
              {filteredCollection.length === 0 ? (
                <p className="p-4 text-gray-300">No cards match your filters.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredCollection.map((card) => (
                    <div
                      key={card.baseFilename}
                      className="bg-gray-100 rounded-lg border-2 border-emerald-500 shadow-lg px-3 py-2 relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2 text-emerald-500 text-[10px] uppercase tracking-widest font-bold">
                        {rarityBadge(card.rarity)}
                      </div>
                      <div className="w-full mb-2 rounded overflow-hidden border border-emerald-300">
                        <Image
                          src={`/cards/${card.baseFilename}.png`}
                          alt={card.name}
                          width={400}
                          height={280}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 drop-shadow-[0_1px_0_rgba(34,197,94,0.9)] leading-tight uppercase tracking-wide">
                        {card.name}
                      </h3>
                      <p className="text-[11px] text-gray-700">Type: {typeLabel(card.type)}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-gray-700">Power</span>
                        <span className="text-sm font-bold text-emerald-600">
                          {computeCardPower(card)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (asArray(workingCards).length >= DECK_LIMIT) return
                          setWorkingCards((prev) => [...asArray(prev), card.baseFilename])
                        }}
                        disabled={asArray(workingCards).length >= DECK_LIMIT}
                        className={`mt-2 w-full rounded border-2 px-2 py-1 uppercase text-xs tracking-widest font-bold transition ${
                          asArray(workingCards).length >= DECK_LIMIT
                            ? "border-gray-400 text-gray-400 bg-gray-200 cursor-not-allowed"
                            : "border-emerald-700 bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-300">
                {asArray(workingCards).length}/{DECK_LIMIT} selected
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 uppercase tracking-widest"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {detailCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailCard(null)} />
          <div className="relative z-10 bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 max-w-md w-full">
            <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
              {detailCard.name}
            </h2>
            <div className="w-full mb-3 rounded overflow-hidden border border-emerald-300">
              <Image
                src={`/cards/${detailCard.baseFilename}.png`}
                alt={detailCard.name}
                width={640}
                height={400}
                className="w-full h-40 object-cover"
              />
            </div>
            <div className="space-y-1 text-gray-100">
              <div className="text-sm">
                <span className="text-gray-300 uppercase text-xs">Type: </span>
                {typeLabel(detailCard.type)}
              </div>
              <div className="text-sm">
                <span className="text-gray-300 uppercase text-xs">Rarity: </span>
                {rarityBadge(detailCard.rarity)}
              </div>
              <div className="text-sm">
                <span className="text-gray-300 uppercase text-xs">Power: </span>
                {computeCardPower(detailCard)}
              </div>
              <p className="text-sm text-gray-200 mt-2">{detailCard.visualDescription}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {detailCard.type === "plumber" && (
                  <>
                    <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                      <div className="text-emerald-400 font-bold">{(detailCard as PlumberCard).hp}</div>
                      <div className="text-gray-300 uppercase tracking-wide">HP</div>
                    </div>
                    <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                      <div className="text-emerald-400 font-bold">{(detailCard as PlumberCard).damage}</div>
                      <div className="text-gray-300 uppercase tracking-wide">Damage</div>
                    </div>
                  </>
                )}
                {detailCard.type === "tool" && (
                  <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                    <div className="text-emerald-400 font-bold">{(detailCard as ToolCard).damage}</div>
                    <div className="text-gray-300 uppercase tracking-wide">Damage</div>
                  </div>
                )}
                {detailCard.type === "excuse" && (
                  <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                    <div className="text-emerald-400 font-bold">{(detailCard as ExcuseCard).timeGain}</div>
                    <div className="text-gray-300 uppercase tracking-wide">Time Gain</div>
                  </div>
                )}
                {detailCard.type === "power-up" && (
                  <>
                    {"damageMultiplier" in detailCard && (detailCard as any).damageMultiplier && (
                      <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                        <div className="text-emerald-400 font-bold">×{(detailCard as any).damageMultiplier}</div>
                        <div className="text-gray-300 uppercase tracking-wide">Damage Mult</div>
                      </div>
                    )}
                    {"healthMultiplier" in detailCard && (detailCard as any).healthMultiplier && (
                      <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                        <div className="text-emerald-400 font-bold">×{(detailCard as any).healthMultiplier}</div>
                        <div className="text-gray-300 uppercase tracking-wide">Health Mult</div>
                      </div>
                    )}
                  </>
                )}
                {detailCard.type === "sandwich" && (
                  <div className="bg-gray-800 rounded-md border border-gray-600 px-3 py-2">
                    <div className="text-emerald-400 font-bold">{(detailCard as SandwichCard).health}</div>
                    <div className="text-gray-300 uppercase tracking-wide">Health</div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setDetailCard(null)}
                className="rounded border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(null)} />
          <div className="relative z-10 bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-8 py-6 max-w-md w-full">
            <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
              {showConfirm.title}
            </h2>
            <p className="text-gray-200 mb-4">This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirm(null)}
                className="rounded border-2 border-gray-500 text-gray-200 hover:bg-gray-600 px-4 py-2 uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={deleteDeck}
                className="rounded border-2 border-red-700 bg-red-600 hover:bg-red-700 text-white px-4 py-2 uppercase tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function TypePill({ label, count, color }: { label: string; count: number; color: "emerald" | "yellow" | "sky" | "pink" | "lime" }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500",
    yellow: "text-yellow-300 border-yellow-400",
    sky: "text-sky-300 border-sky-400",
    pink: "text-pink-300 border-pink-400",
    lime: "text-lime-300 border-lime-400",
  }
  return (
    <div className={`flex items-center gap-2 rounded-md border ${colorMap[color]} px-3 py-1 bg-gray-900`}>
      <span className="text-xs uppercase tracking-wide">{label}</span>
      <span className="text-sm font-bold">{count}</span>
    </div>
  )
}