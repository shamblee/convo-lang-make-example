import { useEffect, useMemo, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import {
  CircleDollarSign,
  ShoppingCart,
  Sparkles,
  Clock,
  Gift,
  Tag,
  ArrowLeftRight,
  CheckCircle2,
  X,
} from "lucide-react"

type BaseCard = {
  type: "plumber" | "tool" | "excuse" | "power-up" | "sandwich"
  name: string
  baseFilename: string
  visualDescription: string
  price: number
  rarity: 1 | 2 | 3 | 4
}

type Plumber = BaseCard & { type: "plumber"; hp: number; damage: number }
type Tool = BaseCard & { type: "tool"; damage: number }
type Excuse = BaseCard & { type: "excuse"; timeGain: number }
type PowerUp = BaseCard & {
  type: "power-up"
  damageMultiplier?: number
  healthMultiplier?: number
}
type Sandwich = BaseCard & { type: "sandwich"; health: number }

type Card = Plumber | Tool | Excuse | PowerUp | Sandwich

type Collection = Record<string, number>

type PackDef = {
  key: string
  name: string
  description: string
  count: number
  price: number
  types: Card["type"][]
  odds: Record<1 | 2 | 3 | 4, number>
  badge?: string
}

type TradeCoin = {
  id: string
  seller: string
  offer: string // baseFilename
  wantCoins: number
  createdAt: number
}

type TradeSwap = {
  id: string
  seller: string
  offer: string // baseFilename
  request: string // baseFilename
  createdAt: number
}

type Trade = TradeCoin | TradeSwap

type DailyData = {
  dateKey: string
  singleOffers: string[] // baseFilenames
  trades: Trade[]
  specials: {
    packKey: string
    discountPct: number
    message: string
  }
}

const ALL_CARDS: Card[] = [
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
    visualDescription:
      "A computer with a 'backorder' alert on the screen.",
    price: 80,
    rarity: 3,
    timeGain: 10,
  },
  {
    type: "excuse",
    name: "Client Not Home",
    baseFilename: "excuse_client_not_home",
    visualDescription:
      "A locked door with a 'Sorry, missed you' note.",
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
    visualDescription: "Shiny black gloves etched with golden symbols.",
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

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue] as const
}

function formatCoins(n: number) {
  return n.toLocaleString()
}

function rarityLabel(r: 1 | 2 | 3 | 4) {
  return r === 4 ? "Epic" : r === 3 ? "Rare" : r === 2 ? "Uncommon" : "Common"
}

function rarityBorder(r: number) {
  if (r === 4) return "border-yellow-300"
  if (r === 3) return "border-emerald-400"
  if (r === 2) return "border-emerald-300"
  return "border-gray-300"
}

function rarityGlow(r: number) {
  if (r === 4) return "shadow-[0_0_24px_rgba(253,224,71,0.4)]"
  if (r === 3) return "shadow-[0_0_18px_rgba(52,211,153,0.35)]"
  if (r === 2) return "shadow-[0_0_10px_rgba(110,231,183,0.25)]"
  return ""
}

function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickByRarity<T extends Card>(cards: T[], rarity: 1 | 2 | 3 | 4) {
  const pool = cards.filter((c) => c.rarity === rarity)
  if (pool.length) return randomItem(pool)
  // fallback to closest rarity
  for (const r of [3, 2, 1, 4]) {
    const alt = cards.filter((c) => c.rarity === r)
    if (alt.length) return randomItem(alt)
  }
  return randomItem(cards)
}

function weightedRarity(odds: Record<1 | 2 | 3 | 4, number>): 1 | 2 | 3 | 4 {
  const entries: { r: 1 | 2 | 3 | 4; w: number }[] = [
    { r: 1, w: odds[1] || 0 },
    { r: 2, w: odds[2] || 0 },
    { r: 3, w: odds[3] || 0 },
    { r: 4, w: odds[4] || 0 },
  ]
  const total = entries.reduce((s, e) => s + e.w, 0)
  let roll = Math.random() * total
  for (const e of entries) {
    if (roll < e.w) return e.r
    roll -= e.w
  }
  return 1
}

const PACKS: PackDef[] = [
  {
    key: "mixed",
    name: "Mixed Starter Pack",
    description: "Balanced mix for new fixers",
    count: 5,
    price: 180,
    types: ["plumber", "tool", "power-up", "excuse", "sandwich"],
    odds: { 1: 0.55, 2: 0.3, 3: 0.13, 4: 0.02 },
  },
  {
    key: "plumber",
    name: "Plumber Power Pack",
    description: "Skilled pros ready to roll",
    count: 3,
    price: 300,
    types: ["plumber"],
    odds: { 1: 0.5, 2: 0.3, 3: 0.17, 4: 0.03 },
  },
  {
    key: "tools",
    name: "Tool Kit Pack",
    description: "Reliable gear for any job",
    count: 4,
    price: 160,
    types: ["tool"],
    odds: { 1: 0.6, 2: 0.3, 3: 0.1, 4: 0 },
  },
  {
    key: "boost",
    name: "Boost Bundle",
    description: "Power-ups, excuses, and snacks",
    count: 4,
    price: 140,
    types: ["power-up", "excuse", "sandwich"],
    odds: { 1: 0.6, 2: 0.3, 3: 0.09, 4: 0.01 },
  },
]

function localDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function nextLocalMidnight(now = new Date()) {
  const n = new Date(now)
  n.setHours(24, 0, 0, 0)
  return +n
}

function getCard(baseFilename: string) {
  return ALL_CARDS.find((c) => c.baseFilename === baseFilename)!
}

function sampleWithoutReplace<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  const out: T[] = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy[idx])
    copy.splice(idx, 1)
  }
  return out
}

function generateDaily(dateKey: string): DailyData {
  // Single offers: 8 cards weighted by rarity
  const weights: Record<1 | 2 | 3 | 4, number> = { 1: 50, 2: 30, 3: 15, 4: 5 }
  const pool: Card[] = []
  for (const c of ALL_CARDS) {
    for (let i = 0; i < weights[c.rarity]; i++) pool.push(c)
  }
  const singleOffers = sampleWithoutReplace(pool, 8).map((c) => c.baseFilename)

  // Trades: 4 total, 2 coin trades + 2 swaps
  const trades: Trade[] = []
  for (let i = 0; i < 2; i++) {
    const offer = randomItem(ALL_CARDS)
    const price =
      Math.round(offer.price * (0.85 + Math.random() * 0.35) / 5) * 5
    trades.push({
      id: `tcoin_${dateKey}_${i}`,
      seller: ["Pipemaster98", "RetroRoto", "LeakBoss", "ValveVixen"][
        Math.floor(Math.random() * 4)
      ],
      offer: offer.baseFilename,
      wantCoins: Math.max(10, price),
      createdAt: Date.now(),
    } as TradeCoin)
  }
  for (let i = 0; i < 2; i++) {
    const offer = randomItem(ALL_CARDS)
    // request a similarly priced card (not same)
    const candidates = ALL_CARDS.filter(
      (c) =>
        c.baseFilename !== offer.baseFilename &&
        Math.abs(c.price - offer.price) <= Math.max(40, offer.price * 0.25)
    )
    const request = (candidates.length ? randomItem(candidates) : randomItem(ALL_CARDS)).baseFilename
    trades.push({
      id: `tswap_${dateKey}_${i}`,
      seller: ["GasketGuru", "PixelPlumb", "ClampChamp", "DrainDynamo"][
        Math.floor(Math.random() * 4)
      ],
      offer: offer.baseFilename,
      request,
      createdAt: Date.now(),
    } as TradeSwap)
  }

  const specialPack = randomItem(PACKS)
  const discountPct = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]
  const message = `${specialPack.name}: ${discountPct}% OFF today!`

  return {
    dateKey,
    singleOffers,
    trades,
    specials: {
      packKey: specialPack.key,
      discountPct,
      message,
    },
  }
}

function useDaily() {
  const [daily, setDaily] = useLocalStorage<DailyData | null>("pp_daily", null)
  useEffect(() => {
    const key = localDateKey()
    if (!daily || daily.dateKey !== key) {
      const gen = generateDaily(key)
      setDaily(gen)
    }
  }, []) // eslint-disable-line
  return [daily, setDaily] as const
}

function CardThumb({ card, size = 72 }: { card: Card; size?: number }) {
  return (
    <div
      className={[
        "relative rounded-md border bg-white shadow",
        rarityBorder(card.rarity),
        "overflow-hidden",
      ].join(" ")}
      style={{ width: size, height: size }}
      title={`${card.name} (${rarityLabel(card.rarity)})`}
    >
      <Image
        src={`/cards/${card.baseFilename}.png`}
        alt={card.name}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  )
}

function ProgressBar({ until }: { until: number }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const total = 24 * 60 * 60 * 1000
  const midnight = nextLocalMidnight(new Date(until - total + 1000))
  const elapsed = Math.min(Math.max(now - midnight, 0), total)
  const pct = Math.max(0, Math.min(100, (elapsed / total) * 100))
  const remainingMs = Math.max(0, until - now)
  const hrs = Math.floor(remainingMs / 3600000)
  const mins = Math.floor((remainingMs % 3600000) / 60000)
  const secs = Math.floor((remainingMs % 60000) / 1000)
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded bg-gray-300 overflow-hidden">
        <div
          className="h-2 bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-gray-700">
        <Clock className="h-3 w-3 text-emerald-600" />
        Resets in {String(hrs).padStart(2, "0")}:{String(mins).padStart(2, "0")}
        :{String(secs).padStart(2, "0")}
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [coins, setCoins] = useLocalStorage<number>("pp_coins", 1000)
  const [collection, setCollection] = useLocalStorage<Collection>("pp_collection", {})
  const [daily, setDaily] = useDaily()
  const [activeTab, setActiveTab] = useState<"packs" | "singles" | "trades">("packs")

  const resetAt = useMemo(() => nextLocalMidnight(), [])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalCards, setModalCards] = useState<Card[]>([])
  const [modalMessage, setModalMessage] = useState<string>("")

  // Trades: keep user posted trades combined with daily trades, store under pp_trades_user
  const [userTrades, setUserTrades] = useLocalStorage<Trade[]>("pp_trades_user", [])

  // Post trade form state
  const ownedCards = useMemo(
    () =>
      ALL_CARDS.filter((c) => (collection[c.baseFilename] || 0) > 0).sort(
        (a, b) => a.name.localeCompare(b.name)
      ),
    [collection]
  )
  const [postOffer, setPostOffer] = useState<string>("")
  const [postType, setPostType] = useState<"coins" | "swap">("coins")
  const [postCoins, setPostCoins] = useState<number>(50)
  const [postRequest, setPostRequest] = useState<string>("")

  function addToCollection(bases: string[]) {
    setCollection((prev) => {
      const next = { ...prev }
      for (const b of bases) next[b] = (next[b] || 0) + 1
      return next
    })
  }

  function removeFromCollection(bases: string[]) {
    setCollection((prev) => {
      const next = { ...prev }
      for (const b of bases) {
        const cur = next[b] || 0
        next[b] = Math.max(0, cur - 1)
        if (next[b] === 0) delete next[b]
      }
      return next
    })
  }

  function effectivePackPrice(pack: PackDef) {
    if (!daily || daily.specials.packKey !== pack.key) return pack.price
    const discounted = Math.round(pack.price * (1 - daily.specials.discountPct / 100))
    return Math.max(1, discounted)
  }

  function buyPack(pack: PackDef) {
    const cost = effectivePackPrice(pack)
    if (coins < cost) return
    const allowed = ALL_CARDS.filter((c) => pack.types.includes(c.type))
    const opened: Card[] = []
    for (let i = 0; i < pack.count; i++) {
      const r = weightedRarity(pack.odds)
      const card = pickByRarity(allowed, r)
      opened.push(card)
    }
    setCoins(coins - cost)
    addToCollection(opened.map((c) => c.baseFilename))
    setModalTitle(`${pack.name} Opened!`)
    setModalCards(opened)
    setModalMessage(
      daily && daily.specials.packKey === pack.key
        ? `Special applied: ${daily.specials.discountPct}% off`
        : "New cards added to your collection!"
    )
    setModalOpen(true)
  }

  function buySingle(base: string) {
    const card = getCard(base)
    if (coins < card.price) return
    setCoins(coins - card.price)
    addToCollection([base])
    setModalTitle("Purchased!")
    setModalCards([card])
    setModalMessage(`${card.name} added to your collection.`)
    setModalOpen(true)
  }

  function acceptTrade(trade: Trade) {
    if ("wantCoins" in trade) {
      if (coins < trade.wantCoins) return
      setCoins(coins - trade.wantCoins)
      addToCollection([trade.offer])
      setModalTitle("Trade Complete")
      setModalCards([getCard(trade.offer)])
      setModalMessage(`You bought ${getCard(trade.offer).name} from ${trade.seller}.`)
      // remove from daily or user trades if exists
      removeTrade(trade.id)
      setModalOpen(true)
    } else {
      // swap: need requested in collection
      const have = (collection[trade.request] || 0) > 0
      if (!have) return
      removeFromCollection([trade.request])
      addToCollection([trade.offer])
      setModalTitle("Swap Complete")
      setModalCards([getCard(trade.offer)])
      setModalMessage(
        `You swapped ${getCard(trade.request).name} for ${getCard(trade.offer).name} with ${trade.seller}.`
      )
      removeTrade(trade.id)
      setModalOpen(true)
    }
  }

  function removeTrade(id: string) {
    setDaily((prev) => {
      if (!prev) return prev
      const updated = { ...prev, trades: prev.trades.filter((t) => t.id !== id) }
      localStorage.setItem("pp_daily", JSON.stringify(updated))
      return updated
    })
    setUserTrades((prev) => prev.filter((t) => t.id !== id))
  }

  function postNewTrade() {
    if (!postOffer) return
    const seller = "You"
    const id = `you_${Date.now()}`
    if (postType === "coins") {
      const t: TradeCoin = {
        id,
        seller,
        offer: postOffer,
        wantCoins: Math.max(1, Math.round(postCoins)),
        createdAt: Date.now(),
      }
      setUserTrades((prev) => [t, ...prev])
    } else {
      if (!postRequest) return
      const t: TradeSwap = {
        id,
        seller,
        offer: postOffer,
        request: postRequest,
        createdAt: Date.now(),
      }
      setUserTrades((prev) => [t, ...prev])
    }
    setModalTitle("Trade Posted")
    setModalCards([getCard(postOffer)])
    setModalMessage("Your trade is now visible in the shop.")
    setModalOpen(true)
    setPostOffer("")
    setPostCoins(50)
    setPostRequest("")
  }

  const allTrades = useMemo<Trade[]>(() => {
    const d = daily?.trades || []
    return [...userTrades, ...d].sort((a, b) => b.createdAt - a.createdAt)
  }, [daily, userTrades])

  if (!mounted) {
    return (
      <>
        <Head>
          <title>Pocket Plumbers • Shop</title>
          <meta name="description" content="Buy packs, singles, and trade cards." />
        </Head>
        <main className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="font-mono text-gray-300">Loading…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Pocket Plumbers • Shop</title>
        <meta name="description" content="Buy packs, single cards, and trade with others." />
      </Head>

      <main className="relative w-full min-h-screen bg-gradient-to-b from-gray-100 via-emerald-100 to-gray-200">
        <div className="absolute inset-0 opacity-20 bg-[url('/pixelgrid.svg')] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 py-8">
          <div className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl p-6 md:p-8 relative font-mono text-gray-100">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                <h2 className="text-emerald-400 text-2xl font-bold uppercase tracking-widest drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                  SHOP
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 rounded px-3 py-2 border border-gray-600">
                <CircleDollarSign className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-emerald-300 tracking-wider">
                  {formatCoins(coins)}
                </span>
              </div>
            </div>

            {/* Promo / Bonus Bar */}
            {daily && (
              <div className="mb-4">
                <div className="bg-gradient-to-r from-emerald-400/60 to-yellow-300/60 rounded-md text-center text-gray-900 font-mono text-sm py-2 px-3 uppercase tracking-wider shadow drop-shadow-[0_1px_0_rgba(0,0,0,0.4)] flex items-center justify-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span>{daily.specials.message}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar until={resetAt} />
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("packs")}
                className={[
                  "px-4 py-1 rounded-full font-bold uppercase tracking-wider transition-all",
                  activeTab === "packs"
                    ? "bg-emerald-500 text-white shadow border-2 border-emerald-700"
                    : "border-2 border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-500/20",
                ].join(" ")}
              >
                Card Packs
              </button>
              <button
                onClick={() => setActiveTab("singles")}
                className={[
                  "px-4 py-1 rounded-full font-bold uppercase tracking-wider transition-all",
                  activeTab === "singles"
                    ? "bg-emerald-500 text-white shadow border-2 border-emerald-700"
                    : "border-2 border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-500/20",
                ].join(" ")}
              >
                Single Cards
              </button>
              <button
                onClick={() => setActiveTab("trades")}
                className={[
                  "px-4 py-1 rounded-full font-bold uppercase tracking-wider transition-all",
                  activeTab === "trades"
                    ? "bg-emerald-500 text-white shadow border-2 border-emerald-700"
                    : "border-2 border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-500/20",
                ].join(" ")}
              >
                Trades
              </button>
            </div>

            {/* Content */}
            {activeTab === "packs" && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PACKS.map((pack) => {
                    const discounted = daily && daily.specials.packKey === pack.key
                    const price = effectivePackPrice(pack)
                    return (
                      <div
                        key={pack.key}
                        className={[
                          "relative bg-white text-gray-900 rounded-lg border-2 shadow-lg p-4 overflow-hidden transition-transform hover:scale-[1.01]",
                          discounted ? "border-emerald-500" : "border-emerald-300",
                          discounted ? "shadow-[0_0_24px_rgba(16,185,129,0.35)]" : "",
                        ].join(" ")}
                      >
                        {discounted && (
                          <div className="absolute -right-8 -top-3 rotate-12 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-10 py-1 shadow">
                            Limited!
                          </div>
                        )}
                        <div className="flex gap-3 items-center">
                          <div className="relative w-20 h-20 rounded-md border-2 border-emerald-400 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-emerald-50 opacity-80" />
                            <Sparkles className="absolute right-2 bottom-2 h-6 w-6 text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(34,197,94,0.5)]">
                              {pack.name}
                            </h3>
                            <p className="text-sm text-gray-600">{pack.description}</p>
                            <div className="mt-1 text-xs text-gray-600 uppercase tracking-wider">
                              {pack.count} cards • Types: {pack.types.join(", ")}
                            </div>
                            <div className="mt-2 text-[11px] text-gray-700">
                              Odds: C {Math.round(pack.odds[1] * 100)}% • U{" "}
                              {Math.round(pack.odds[2] * 100)}% • R{" "}
                              {Math.round(pack.odds[3] * 100)}% • E{" "}
                              {Math.round((pack.odds[4] || 0) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-5 w-5 text-emerald-600" />
                            <div className="text-gray-900 font-bold">
                              {discounted && (
                                <span className="text-[12px] mr-2 line-through text-gray-400">
                                  {formatCoins(pack.price)}
                                </span>
                              )}
                              <span className="text-emerald-700">{formatCoins(price)}</span>
                            </div>
                            {discounted && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-400 rounded px-2 py-[2px] uppercase tracking-wider">
                                <Tag className="h-3 w-3" />
                                {daily?.specials.discountPct}% Off
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => coins >= price && buyPack(pack)}
                            disabled={coins < price}
                            title={coins < price ? "Not enough coins" : "Buy pack"}
                            className={[
                              "inline-flex items-center gap-2 rounded border-2 px-3 py-1 uppercase tracking-widest font-bold transition-colors",
                              coins < price
                                ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                : "bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600",
                            ].join(" ")}
                          >
                            <ShoppingCart className="h-4 w-4" /> Buy
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {activeTab === "singles" && (
              <section>
                {!daily ? (
                  <p className="text-sm text-gray-300">Loading today&apos;s offers…</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {daily.singleOffers.map((base) => {
                      const card = getCard(base)
                      const owned = collection[base] || 0
                      return (
                        <div
                          key={base}
                          className={[
                            "bg-white rounded-lg border-2 p-3 shadow relative overflow-hidden",
                            rarityBorder(card.rarity),
                            rarityGlow(card.rarity),
                          ].join(" ")}
                        >
                          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-100 border border-emerald-300 rounded px-2 py-[2px]">
                            {rarityLabel(card.rarity)}
                          </div>
                          <div className="flex items-center gap-3">
                            <CardThumb card={card} size={72} />
                            <div className="flex-1">
                              <div className="font-bold uppercase tracking-wider text-gray-900 drop-shadow-[0_1px_0_rgba(34,197,94,0.5)]">
                                {card.name}
                              </div>
                              <div className="text-xs text-gray-600">{card.type}</div>
                              <div className="mt-1 flex items-center gap-2">
                                <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                                <span className="text-gray-900 font-bold">
                                  {formatCoins(card.price)}
                                </span>
                                {owned > 0 && (
                                  <span className="ml-2 text-[11px] text-emerald-700 bg-emerald-100 border border-emerald-300 rounded px-2 py-[1px] uppercase">
                                    Owned: {owned}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => coins >= card.price && buySingle(base)}
                              disabled={coins < card.price}
                              title={coins < card.price ? "Not enough coins" : "Buy card"}
                              className={[
                                "w-full inline-flex items-center justify-center gap-2 rounded border-2 px-3 py-1 uppercase tracking-widest font-bold transition-colors",
                                coins < card.price
                                  ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                  : "bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600",
                              ].join(" ")}
                            >
                              <ShoppingCart className="h-4 w-4" /> Purchase
                            </button>
                            <div className="mt-2">
                              <ProgressBar until={resetAt} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === "trades" && (
              <section className="space-y-6">
                {/* Post Trade */}
                <div className="bg-white rounded-lg border-2 border-emerald-300 p-4 shadow">
                  <h3 className="text-gray-900 font-bold uppercase tracking-wider mb-3 drop-shadow-[0_1px_0_rgba(34,197,94,0.5)]">
                    Post a Trade
                  </h3>
                  {ownedCards.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      You don’t own any cards yet. Buy packs or singles to start trading!
                    </div>
                  ) : (
                    <form
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
                      onSubmit={(e) => {
                        e.preventDefault()
                        postNewTrade()
                      }}
                    >
                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-700">
                          Offer
                        </span>
                        <select
                          value={postOffer}
                          onChange={(e) => setPostOffer(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select card</option>
                          {ownedCards.map((c) => (
                            <option key={c.baseFilename} value={c.baseFilename}>
                              {c.name} (x{collection[c.baseFilename] || 0})
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-700">
                          Trade Type
                        </span>
                        <select
                          value={postType}
                          onChange={(e) => setPostType(e.target.value as any)}
                          className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="coins">Coins</option>
                          <option value="swap">Swap</option>
                        </select>
                      </label>

                      {postType === "coins" ? (
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-700">
                            Price (Coins)
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={postCoins}
                            onChange={(e) => setPostCoins(parseInt(e.target.value || "1", 10))}
                            className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </label>
                      ) : (
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-700">
                            Request Card
                          </span>
                          <select
                            value={postRequest}
                            onChange={(e) => setPostRequest(e.target.value)}
                            className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Select card</option>
                            {ALL_CARDS.filter((c) => c.baseFilename !== postOffer).map((c) => (
                              <option key={c.baseFilename} value={c.baseFilename}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}

                      <button
                        type="submit"
                        className="rounded bg-emerald-500 text-white font-bold uppercase tracking-widest border-2 border-emerald-700 px-4 py-2 hover:bg-emerald-600 transition-colors"
                      >
                        Post Trade
                      </button>
                    </form>
                  )}
                </div>

                {/* Trades list */}
                <div className="space-y-3">
                  {allTrades.length === 0 ? (
                    <div className="flex items-center gap-3 bg-white border-2 border-emerald-300 rounded-lg p-4">
                      <div className="relative w-14 h-14 rounded-md border-2 border-emerald-400 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-emerald-50 opacity-90" />
                        <Sparkles className="absolute right-2 bottom-2 h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-gray-900">
                          No trades yet
                        </div>
                        <div className="text-sm text-gray-600">
                          Be the first to post a trade and kick off the marketplace!
                        </div>
                      </div>
                    </div>
                  ) : (
                    allTrades.map((t) => {
                      const offer = getCard(t.offer)
                      const isYours = t.seller === "You"
                      const canAccept =
                        "wantCoins" in t
                          ? coins >= t.wantCoins
                          : (collection[(t as TradeSwap).request] || 0) > 0
                      return (
                        <div
                          key={t.id}
                          className={[
                            "flex items-center gap-3 bg-white rounded-lg border-2 p-3 shadow",
                            rarityBorder(offer.rarity),
                          ].join(" ")}
                        >
                          <CardThumb card={offer} size={64} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold uppercase tracking-wider text-gray-900">
                                  {offer.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Seller:{" "}
                                  <span className="uppercase tracking-wider">
                                    {t.seller}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                {"wantCoins" in t ? (
                                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded px-2 py-[2px] text-xs uppercase">
                                    <CircleDollarSign className="h-3 w-3" />
                                    {formatCoins(t.wantCoins)}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-2 py-[2px] text-xs uppercase">
                                    <ArrowLeftRight className="h-3 w-3" />
                                    For: {getCard((t as TradeSwap).request).name}
                                  </div>
                                )}
                              </div>
                            </div>
                            {"request" in t && (
                              <div className="mt-1 text-[11px] text-gray-600">
                                You own: {collection[(t as TradeSwap).request] || 0}
                              </div>
                            )}
                          </div>

                          {isYours ? (
                            <button
                              onClick={() => removeTrade(t.id)}
                              className="rounded border-2 border-red-600 text-red-600 px-3 py-1 uppercase text-xs font-bold tracking-widest hover:bg-red-50"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => canAccept && acceptTrade(t)}
                              disabled={!canAccept}
                              className={[
                                "inline-flex items-center gap-1 rounded border-2 px-3 py-1 uppercase text-xs font-bold tracking-widest transition-colors",
                                canAccept
                                  ? "bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600"
                                  : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed",
                              ].join(" ")}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Trade
                            </button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-emerald-400 text-xl font-bold uppercase mb-3 tracking-widest drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                {modalTitle}
              </h3>
              {modalCards.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {modalCards.map((c, idx) => (
                    <div
                      key={c.baseFilename + "_" + idx}
                      className={[
                        "bg-white rounded-md border-2 p-2 text-center animate-[fadeIn_200ms_ease-out]",
                        rarityBorder(c.rarity),
                        rarityGlow(c.rarity),
                      ].join(" ")}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="mx-auto">
                        <CardThumb card={c} size={72} />
                      </div>
                      <div className="mt-2 text-[12px] uppercase font-bold text-gray-900 tracking-wider">
                        {c.name}
                      </div>
                      <div className="text-[10px] uppercase text-gray-600">
                        {rarityLabel(c.rarity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-200">{modalMessage}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded border-2 border-gray-400 text-gray-100 px-4 py-2 uppercase text-xs tracking-widest hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false)
                    setActiveTab("packs")
                  }}
                  className="rounded bg-emerald-500 text-white border-2 border-emerald-700 px-4 py-2 uppercase text-xs tracking-widest hover:bg-emerald-600"
                >
                  Buy More
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}