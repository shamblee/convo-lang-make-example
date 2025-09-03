import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Cog, Coins as CoinsIcon, Trophy, ShieldCheck, Layers, Pencil, Trash2, PlusCircle, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/router"

type CardType = "plumber" | "tool" | "excuse" | "power-up" | "sandwich"

type BaseCard = {
  type: CardType
  name: string
  baseFilename: string
  visualDescription: string
  price: number
  rarity: number
  // optional fields across categories
  hp?: number
  damage?: number
  timeGain?: number
  damageMultiplier?: number
  healthMultiplier?: number
  health?: number
}

type Profile = {
  wins: number
  coins: number
  emergenciesSolved: number
  level: number
}

type Deck = {
  id: string
  name: string
  cards: string[] // baseFilenames
}

type Collection = Record<string, number> // baseFilename -> quantity

// Local storage hook (from guide pattern)
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue] as const
}

// Static cards database (build-time known)
const ALL_CARDS: BaseCard[] = [
  { type: "plumber", name: "Turbo Tony", baseFilename: "plumber_turbo_tony", visualDescription: "A burly plumber with a big red wrench and a confident grin. Wears blue coveralls and a tool belt.", price: 300, rarity: 3, hp: 100, damage: 25 },
  { type: "plumber", name: "Speedy Sal", baseFilename: "plumber_speedy_sal", visualDescription: "A slim, speedy plumber in green with goggles and rollerblades attached to his boots.", price: 250, rarity: 2, hp: 80, damage: 19 },
  { type: "plumber", name: "Mighty Mona", baseFilename: "plumber_mighty_mona", visualDescription: "A tall, muscular woman holding two plungers, ready for battle. Has utility pouches and an iconic yellow cap.", price: 320, rarity: 4, hp: 105, damage: 29 },
  { type: "plumber", name: "Wrenchin’ Wes", baseFilename: "plumber_wrenchin_wes", visualDescription: "A young, scrappy plumber with spiky hair and an oversized wrench slung over his shoulder.", price: 180, rarity: 1, hp: 65, damage: 17 },
  { type: "plumber", name: "Pipe Pro Paula", baseFilename: "plumber_pipe_pro_paula", visualDescription: "A stylish plumber with fluorescent-pink gloves, glasses, and a digital leak detector.", price: 220, rarity: 2, hp: 75, damage: 22 },
  { type: "tool", name: "Mega Plunger", baseFilename: "tool_mega_plunger", visualDescription: "A bright orange, oversized plunger with a metal handle and glowing accents.", price: 90, rarity: 2, damage: 14 },
  { type: "tool", name: "Snake-O-Matic", baseFilename: "tool_snake_o_matic", visualDescription: "A mechanical, coiled drain snake that retracts and extends with buttons.", price: 110, rarity: 3, damage: 20 },
  { type: "tool", name: "Leak Detector", baseFilename: "tool_leak_detector", visualDescription: "A hi-tech gadget with blinking blue lights to find hidden leaks.", price: 60, rarity: 1, damage: 6 },
  { type: "tool", name: "Pipe Patch Kit", baseFilename: "tool_pipe_patch_kit", visualDescription: "A small metal box filled with tape, putty, and quick fixes for cracks.", price: 75, rarity: 2, damage: 10 },
  { type: "tool", name: "Turbo Torque Wrench", baseFilename: "tool_turbo_torque_wrench", visualDescription: "A gleaming chrome wrench with digital torque settings.", price: 100, rarity: 3, damage: 18 },
  { type: "excuse", name: "Blame the Dog", baseFilename: "excuse_blame_the_dog", visualDescription: "A comical card featuring a guilty-looking dog next to a puddle.", price: 45, rarity: 1, timeGain: 5 },
  { type: "excuse", name: "Traffic Jam", baseFilename: "excuse_traffic_jam", visualDescription: "A cartoon traffic jam blocks a city street full of plumbers.", price: 60, rarity: 2, timeGain: 8 },
  { type: "excuse", name: "Misplaced Tools", baseFilename: "excuse_misplaced_tools", visualDescription: "A messy toolbox with open drawers and scattered wrenches.", price: 30, rarity: 1, timeGain: 3 },
  { type: "excuse", name: "Parts on Backorder", baseFilename: "excuse_parts_on_backorder", visualDescription: "A computer with a 'backorder' alert on the screen.", price: 80, rarity: 3, timeGain: 10 },
  { type: "excuse", name: "Client Not Home", baseFilename: "excuse_client_not_home", visualDescription: "A locked door with a 'Sorry, missed you' note.", price: 65, rarity: 2, timeGain: 6 },
  { type: "power-up", name: "Caffeinated Surge", baseFilename: "powerup_caffeinated_surge", visualDescription: "A neon coffee mug overflowing with energy bolts.", price: 70, rarity: 2, damageMultiplier: 1.2 },
  { type: "power-up", name: "Unbreakable Gloves", baseFilename: "powerup_unbreakable_gloves", visualDescription: "Shiny black gloves etched with golden symbols.", price: 120, rarity: 4, healthMultiplier: 1.25 },
  { type: "power-up", name: "Safety Goggles", baseFilename: "powerup_safety_goggles", visualDescription: "Translucent blue goggles radiating a protective aura.", price: 55, rarity: 1, healthMultiplier: 1.1 },
  { type: "power-up", name: "Protein Shake", baseFilename: "powerup_protein_shake", visualDescription: "A sports bottle with liquid strength sloshing inside.", price: 85, rarity: 2, damageMultiplier: 1.15 },
  { type: "power-up", name: "Quick Reflexes", baseFilename: "powerup_quick_reflexes", visualDescription: "A pair of hands juggling pipes, tools, and a wrench all at once.", price: 95, rarity: 3, damageMultiplier: 1.18 },
  { type: "sandwich", name: "Classic Sub", baseFilename: "sandwich_classic_sub", visualDescription: "A traditional submarine sandwich overflowing with deli meats and cheese.", price: 35, rarity: 1, health: 22 },
  { type: "sandwich", name: "Mega BLT", baseFilename: "sandwich_mega_blt", visualDescription: "A huge BLT with crisp lettuce and bacon, radiating tempting aroma.", price: 50, rarity: 2, health: 33 },
  { type: "sandwich", name: "Spicy Wrap", baseFilename: "sandwich_spicy_wrap", visualDescription: "A tightly-rolled wrap with bright peppers peeking out the sides.", price: 48, rarity: 2, health: 29 },
  { type: "sandwich", name: "Veggie Hoagie", baseFilename: "sandwich_veggie_hoagie", visualDescription: "A fresh green hoagie loaded with crisp veggies and creamy dressing.", price: 42, rarity: 1, health: 18 },
  { type: "sandwich", name: "Energy Bagel", baseFilename: "sandwich_energy_bagel", visualDescription: "A plump bagel with sunflower seeds and glowing cream cheese.", price: 37, rarity: 1, health: 20 },
  { type: "tool", name: "Copper Pipe Set", baseFilename: "tool_copper_pipe_set", visualDescription: "A bundle of shiny copper pipes ready for installation.", price: 80, rarity: 2, damage: 12 },
  { type: "tool", name: "Waterproof Tape", baseFilename: "tool_waterproof_tape", visualDescription: "A roll of gray, ultra-sticky tape that magically seals leaks.", price: 70, rarity: 1, damage: 8 },
  { type: "tool", name: "Mini Shop Vac", baseFilename: "tool_mini_shop_vac", visualDescription: "A portable vacuum with wheels and a big blue button.", price: 60, rarity: 1, damage: 5 },
  { type: "plumber", name: "Delicate Dani", baseFilename: "plumber_delicate_dani", visualDescription: "A careful, meticulous plumber with small tools and surgical gloves.", price: 190, rarity: 1, hp: 60, damage: 15 },
  { type: "power-up", name: "Inspirational Playlist", baseFilename: "powerup_inspirational_playlist", visualDescription: "A phone with musical notes floating around, headphones plugged in.", price: 78, rarity: 2, damageMultiplier: 1.12 },
  { type: "excuse", name: "Epic Rainstorm", baseFilename: "excuse_epic_rainstorm", visualDescription: "A deluge outside the window with flashing thunderbolts.", price: 70, rarity: 2, timeGain: 7 },
  { type: "plumber", name: "Old School Stan", baseFilename: "plumber_old_school_stan", visualDescription: "A gray-bearded plumber in suspenders, wielding a classic monkey wrench.", price: 240, rarity: 2, hp: 90, damage: 21 },
  { type: "tool", name: "Liquid Drain Blaster", baseFilename: "tool_liquid_drain_blaster", visualDescription: "A big blue and red bottle with warning labels, bubbling with potent chemicals.", price: 85, rarity: 2, damage: 13 },
  { type: "plumber", name: "Techie Tessa", baseFilename: "plumber_techie_tessa", visualDescription: "A high-tech plumber adorned with smart glasses and a tablet for diagnostics.", price: 250, rarity: 3, hp: 85, damage: 20 },
  { type: "tool", name: "Pipe Cutter Deluxe", baseFilename: "tool_pipe_cutter_deluxe", visualDescription: "A heavy-duty red pipe cutter with a digital readout.", price: 95, rarity: 2, damage: 16 }
]

// Helpers
const rarityLabel = (r: number) =>
  r >= 4 ? "Epic" : r === 3 ? "Rare" : r === 2 ? "Uncommon" : "Common"

const rarityBadgeColor = (r: number) =>
  r >= 4 ? "text-fuchsia-500" : r === 3 ? "text-emerald-500" : r === 2 ? "text-lime-500" : "text-gray-500"

function computeCardPower(card: BaseCard): number {
  switch (card.type) {
    case "plumber":
      return (card.damage || 0) + (card.hp || 0) * 0.4 + card.rarity * 4
    case "tool":
      return (card.damage || 0) + card.rarity * 3
    case "power-up":
      return ((card.damageMultiplier ? (card.damageMultiplier - 1) * 100 : 0) + (card.healthMultiplier ? (card.healthMultiplier - 1) * 100 : 0)) * 0.6 + card.rarity * 5
    case "sandwich":
      return (card.health || 0) * 0.6 + card.rarity * 2
    case "excuse":
      return (card.timeGain || 0) * 0.5 + card.rarity * 1.5
    default:
      return card.rarity
  }
}

// Components (local to page)
function StatPanel({ icon, value, label }: { icon: JSX.Element; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800 rounded-md border border-gray-200 shadow-md px-4 py-3">
      <div className="text-emerald-400">{icon}</div>
      <div>
        <div className="text-xl font-bold text-emerald-400 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">{value}</div>
        <div className="uppercase text-[10px] text-gray-300 tracking-widest">{label}</div>
      </div>
    </div>
  )
}

function CardPill({ card, qty }: { card: BaseCard; qty: number }) {
  const power = Math.round(computeCardPower(card))
  return (
    <div className="relative bg-gray-100 border-2 border-emerald-500 rounded-lg shadow-lg px-3 py-3 min-w-[200px] md:min-w-0 transition-transform hover:scale-[1.02]">
      <div className="absolute top-2 right-2 text-xs uppercase tracking-widest font-bold">
        <span className={`${rarityBadgeColor(card.rarity)}`}>{rarityLabel(card.rarity)}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-md overflow-hidden border-2 border-emerald-400 shadow">
          <Image src={`/cards/${card.baseFilename}.png`} alt={card.name} fill sizes="56px" className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-base uppercase tracking-wide drop-shadow-[0_1px_0_rgba(34,197,94,0.9)]">{card.name}</div>
          <div className="text-gray-700 text-xs flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-emerald-500" />
              POWER: <span className="font-bold">{power}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span>Qty x{qty}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()

  const [profile, setProfile] = useLocalStorage<Profile>("pp_profile", {
    wins: 0,
    coins: 0,
    emergenciesSolved: 0,
    level: 1
  })
  const [collection, setCollection] = useLocalStorage<Collection>("pp_collection", {})
  const [decks, setDecks] = useLocalStorage<Deck[]>("pp_decks", [])
  const [activeDeckId, setActiveDeckId] = useLocalStorage<string | null>("pp_active_deck_id", null)
  const [showSettings, setShowSettings] = useState(false)

  // Initial seed for first-time players
  useEffect(() => {
    if (Object.keys(collection).length === 0 && decks.length === 0 && profile.coins === 0 && profile.wins === 0) {
      const starterCollection: Collection = {
        plumber_turbo_tony: 1,
        plumber_wrenchin_wes: 1,
        tool_mega_plunger: 1,
        tool_leak_detector: 1,
        tool_pipe_patch_kit: 1,
        powerup_safety_goggles: 1,
        sandwich_classic_sub: 2,
        excuse_blame_the_dog: 1
      }
      const starterDeck: Deck = {
        id: cryptoRandomId(),
        name: "Leak Busters",
        cards: Object.keys(starterCollection)
      }
      setCollection(starterCollection)
      setDecks([starterDeck])
      setActiveDeckId(starterDeck.id)
      setProfile({ wins: 0, coins: 500, emergenciesSolved: 0, level: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalCards = useMemo(
    () => Object.values(collection).reduce((sum, qty) => sum + qty, 0),
    [collection]
  )

  const topCards = useMemo(() => {
    const owned = ALL_CARDS.filter(c => (collection[c.baseFilename] || 0) > 0)
      .map(c => ({ card: c, qty: collection[c.baseFilename] || 0, score: computeCardPower(c) + c.rarity * 10 }))
      .sort((a, b) => b.card.rarity - a.card.rarity || b.score - a.score)
      .slice(0, 10)
    return owned
  }, [collection])

  function renameDeck(id: string) {
    const name = window.prompt("Rename deck to:", decks.find(d => d.id === id)?.name || "")
    if (!name) return
    setDecks(prev => prev.map(d => (d.id === id ? { ...d, name } : d)))
  }

  function deleteDeck(id: string) {
    const deck = decks.find(d => d.id === id)
    if (!deck) return
    if (!window.confirm(`Delete deck "${deck.name}"? This cannot be undone.`)) return
    setDecks(prev => prev.filter(d => d.id !== id))
    if (activeDeckId === id) setActiveDeckId(null)
  }

  function createDeck() {
    const base = "New Deck"
    let idx = 1
    const existingNames = new Set(decks.map(d => d.name))
    let candidate = base
    while (existingNames.has(candidate)) {
      idx += 1
      candidate = `${base} ${idx}`
    }
    const newDeck: Deck = { id: cryptoRandomId(), name: candidate, cards: [] }
    setDecks(prev => [newDeck, ...prev])
    setActiveDeckId(newDeck.id)
  }

  function openDeck(id: string) {
    setActiveDeckId(id)
    router.push("/deck")
  }

  function resetProgress() {
    if (!window.confirm("Reset all progress? This clears profile, decks, and collection.")) return
    setProfile({ wins: 0, coins: 500, emergenciesSolved: 0, level: 1 })
    setCollection({})
    setDecks([])
    setActiveDeckId(null)
    setShowSettings(false)
  }

  const activeDeckName = decks.find(d => d.id === activeDeckId)?.name || "None"

  return (
    <>
      <Head>
        <title>Pocket Plumbers • Dashboard</title>
        <meta name="description" content="Your main hub for Pocket Plumbers. View stats, top cards, and manage decks." />
      </Head>
      <main className="w-full min-h-screen bg-gray-900 text-gray-100 font-mono">
        <section className="relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[url('/pixelgrid.svg')]"></div>
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-4">
            {/* Header / Greeting */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-emerald-500 to-gray-900 border-b-2 border-emerald-700 px-4 py-3 rounded-b-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-300 shadow">
                  <Image src="/cards/plumber_turbo_tony.png" alt="Player Avatar" fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-emerald-100">Welcome, Plumber!</div>
                  <div className="text-lg md:text-2xl font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                    Level {profile.level}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(s => !s)}
                className="inline-flex items-center gap-2 bg-gray-900/40 hover:bg-gray-900/60 text-white border-2 border-emerald-700 rounded px-3 py-2 uppercase tracking-wider shadow transition-colors"
                aria-label="Settings"
              >
                <Cog className="w-5 h-5" /> Settings
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <StatPanel icon={<Trophy className="w-5 h-5" />} value={profile.wins} label="Wins" />
              <StatPanel icon={<CoinsIcon className="w-5 h-5" />} value={profile.coins} label="Coins" />
              <StatPanel icon={<ShieldCheck className="w-5 h-5" />} value={profile.emergenciesSolved} label="Emergencies Solved" />
              <StatPanel icon={<Layers className="w-5 h-5" />} value={totalCards} label="Total Cards" />
            </div>

            {/* Top Cards */}
            <section className="mt-8">
              <h2 className="uppercase text-xl md:text-2xl font-bold text-emerald-400 mb-3 tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Top Cards
              </h2>

              {topCards.length === 0 ? (
                <div className="bg-gray-800 border border-gray-200 rounded-md p-4 text-gray-300">
                  You don’t have any cards yet. Visit the shop to start your collection!
                </div>
              ) : (
                <>
                  <div className="flex md:hidden overflow-x-auto gap-4 pb-2">
                    {topCards.map(({ card, qty }) => (
                      <CardPill key={card.baseFilename} card={card} qty={qty} />
                    ))}
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {topCards.map(({ card, qty }) => (
                      <CardPill key={card.baseFilename} card={card} qty={qty} />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-3">
                <Link href="/cards" className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 uppercase font-bold tracking-wider">
                  View Full Card List <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Decks Management */}
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="uppercase text-xl md:text-2xl font-bold text-emerald-400 mb-2 tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                  My Decks
                </h2>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  Active: <span className="text-emerald-400 font-bold">{activeDeckName}</span>
                </div>
              </div>

              <div className="space-y-2">
                {decks.length === 0 && (
                  <div className="bg-gray-800 border border-gray-200 rounded-md p-4 text-gray-300">
                    No decks yet. Create your first deck to head into emergencies!
                  </div>
                )}

                {decks.map(deck => (
                  <div
                    key={deck.id}
                    className="flex items-center bg-white border border-emerald-200 rounded-lg px-3 py-2 shadow transition hover:border-emerald-400 group"
                  >
                    <button
                      onClick={() => openDeck(deck.id)}
                      className="text-left font-bold text-gray-800 group-hover:text-emerald-500 uppercase flex-1"
                    >
                      {deck.name}
                    </button>
                    <span className="text-xs text-gray-500 mr-2">{deck.cards.length} Cards</span>
                    <button
                      onClick={() => renameDeck(deck.id)}
                      className="ml-2 px-2 py-1 text-xs rounded bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-700 tracking-wider inline-flex items-center gap-1"
                      aria-label={`Rename ${deck.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Rename
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-400 border border-red-700 inline-flex items-center gap-1"
                      aria-label={`Delete ${deck.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={createDeck}
                className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest inline-flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                New Deck
              </button>
            </section>

            {/* Quick Shortcuts */}
            <nav className="mt-10 mb-24">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/cards"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest transition"
                >
                  View Card List
                </Link>
                <button
                  onClick={() => router.push("/deck")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest transition"
                >
                  Manage Decks
                </button>
                <Link
                  href="/shop"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest transition"
                >
                  Visit Card Shop
                </Link>
                <Link
                  href="/emergency"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest transition"
                >
                  Start Emergency
                </Link>
              </div>
            </nav>
          </div>
        </section>

        {/* Sticky Bottom Shortcuts (mobile-friendly) */}
        <div className="fixed bottom-4 left-0 right-0 z-20">
          <div className="mx-auto max-w-md px-4">
            <div className="flex items-center justify-between gap-2 bg-gray-800/90 border border-gray-200 rounded-xl shadow-2xl px-3 py-2">
              <Link href="/cards" className="flex-1 text-center text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
                Cards
              </Link>
              <button onClick={() => router.push("/deck")} className="flex-1 text-center text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
                Decks
              </button>
              <Link href="/shop" className="flex-1 text-center text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
                Shop
              </Link>
              <Link href="/emergency" className="flex-1 text-center text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
                Emergency
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 w-full max-w-md">
              <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Settings
              </h2>
              <div className="space-y-3">
                <div className="text-sm text-gray-200">
                  Coins: <span className="text-emerald-300 font-bold">{profile.coins}</span>
                </div>
                <button
                  onClick={() => {
                    const add = Number(window.prompt("Add coins:", "100") || "0")
                    if (!Number.isFinite(add)) return
                    setProfile(p => ({ ...p, coins: Math.max(0, p.coins + add) }))
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-4 py-2 uppercase tracking-widest"
                >
                  Add Coins
                </button>
                <button
                  onClick={resetProgress}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded shadow border-2 border-red-700 px-4 py-2 uppercase tracking-widest"
                >
                  Reset Progress
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold rounded shadow border-2 border-gray-800 px-4 py-2 uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

// Utils
function cryptoRandomId() {
  if (typeof window !== "undefined" && "crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID()
  }
  return "id-" + Math.random().toString(36).slice(2)
}