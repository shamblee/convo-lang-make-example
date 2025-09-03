import Head from "next/head"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type CardType = "plumber" | "tool" | "excuse" | "power-up" | "sandwich"

type BaseCard = {
  type: CardType
  name: string
  baseFilename: string
  visualDescription: string
  price: number
  rarity: number
}
type PlumberCard = BaseCard & { type: "plumber"; hp: number; damage: number }
type ToolCard = BaseCard & { type: "tool"; damage: number }
type ExcuseCard = BaseCard & { type: "excuse"; timeGain: number }
type PowerUpCard =
  | (BaseCard & { type: "power-up"; damageMultiplier?: number; healthMultiplier?: number })
type SandwichCard = BaseCard & { type: "sandwich"; health: number }

type AnyCard = PlumberCard | ToolCard | ExcuseCard | PowerUpCard | SandwichCard

type Deck = {
  id: string
  name: string
  cards: string[] // baseFilenames
}

type ActivePlumber = {
  baseFilename: string
  name: string
  baseHP: number
  baseDamage: number
  hp: number
  maxHp: number
}

type Emergency = {
  key: string
  name: string
  description: string
  maxHp: number
  hp: number
  turnsLeft: number
}

const ALL_CARDS: AnyCard[] = [
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

const CARD_MAP: Record<string, AnyCard> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.baseFilename, c])
)

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

function randId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createStarterDeck(): Deck {
  const picks = [
    "plumber_turbo_tony",
    "plumber_speedy_sal",
    "plumber_old_school_stan",
    "tool_mega_plunger",
    "tool_snake_o_matic",
    "tool_leak_detector",
    "tool_pipe_patch_kit",
    "tool_turbo_torque_wrench",
    "tool_copper_pipe_set",
    "tool_waterproof_tape",
    "tool_mini_shop_vac",
    "tool_liquid_drain_blaster",
    "tool_pipe_cutter_deluxe",
    "powerup_caffeinated_surge",
    "powerup_safety_goggles",
    "powerup_protein_shake",
    "powerup_quick_reflexes",
    "powerup_inspirational_playlist",
    "sandwich_classic_sub",
    "sandwich_mega_blt",
    "sandwich_energy_bagel",
    "excuse_blame_the_dog",
    "excuse_traffic_jam",
    "excuse_misplaced_tools",
    "excuse_epic_rainstorm"
  ]
  const dupes = ["tool_mega_plunger", "tool_pipe_patch_kit", "sandwich_classic_sub", "powerup_caffeinated_surge"]
  const cards = [...picks, ...dupes, "plumber_wrenchin_wes", "plumber_pipe_pro_paula"]
  return { id: randId("deck"), name: "Starter Kit", cards }
}

function formatType(t: CardType) {
  if (t === "power-up") return "Power-Up"
  return t[0].toUpperCase() + t.slice(1)
}

function rarityBadge(rarity: number) {
  if (rarity >= 4) return "Legend"
  if (rarity === 3) return "Rare"
  if (rarity === 2) return "Uncommon"
  return "Common"
}

export default function EmergencyPage() {
  const [decks, setDecks] = useLocalStorage<Deck[]>("pp_decks", [])
  const [selectedDeckId, setSelectedDeckId] = useLocalStorage<string | null>("pp_selected_deck_id", null)
  const [coins, setCoins] = useLocalStorage<number>("pp_coins", 0)

  const [showDeckModal, setShowDeckModal] = useState(false)

  const [drawPile, setDrawPile] = useState<string[]>([])
  const [hand, setHand] = useState<string[]>([])
  const [discard, setDiscard] = useState<string[]>([])

  const [turn, setTurn] = useState(1)
  const [log, setLog] = useState<string[]>([])
  const [activePlumber, setActivePlumber] = useState<ActivePlumber | null>(null)
  const [damageMultiplier, setDamageMultiplier] = useState(1)
  const [healthMultiplier, setHealthMultiplier] = useState(1)
  const [activeEffects, setActiveEffects] = useState<string[]>([])

  const [emergency, setEmergency] = useState<Emergency>({
    key: "burst_pipe",
    name: "Burst Pipe in Basement",
    description: "Water gushes across the floor—a main pipe has blown! Fix it quick before the timer runs out!",
    maxHp: 160,
    hp: 160,
    turnsLeft: 7
  })

  const [victory, setVictory] = useState<{ open: boolean; coins: number } | null>(null)
  const [defeat, setDefeat] = useState<{ open: boolean } | null>(null)
  const [undoStack, setUndoStack] = useState<string[]>([]) // JSON snapshots

  const selectedDeck = useMemo(() => decks.find((d) => d.id === selectedDeckId) || null, [decks, selectedDeckId])

  useEffect(() => {
    if (decks.length === 0) {
      const starter = createStarterDeck()
      setDecks([starter])
      setSelectedDeckId(starter.id)
      setShowDeckModal(true)
    } else if (!selectedDeckId) {
      setShowDeckModal(true)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!selectedDeck) return
    startNewBattle(selectedDeck)
  }, [selectedDeckId]) // eslint-disable-line

  function startNewBattle(deck: Deck) {
    const shuffled = shuffle(deck.cards)
    const firstHand = shuffled.slice(0, 5)
    const rest = shuffled.slice(5)
    setDrawPile(rest)
    setHand(firstHand)
    setDiscard([])
    setTurn(1)
    setActivePlumber(null)
    setDamageMultiplier(1)
    setHealthMultiplier(1)
    setActiveEffects([])
    setEmergency({
      key: "burst_pipe",
      name: "Burst Pipe in Basement",
      description: "Water gushes across the floor—a main pipe has blown! Fix it quick before the timer runs out!",
      maxHp: 160,
      hp: 160,
      turnsLeft: 7
    })
    setLog([
      `Emergency detected: ${"Burst Pipe in Basement"} — fix it before flooding escalates!`,
      `Tip: Deploy a plumber, then use tools for immediate fixes. Power-Ups boost your effects.`
    ])
    setVictory(null)
    setDefeat(null)
    setUndoStack([])
  }

  function pushUndo() {
    const snapshot = JSON.stringify({
      drawPile,
      hand,
      discard,
      turn,
      log,
      activePlumber,
      damageMultiplier,
      healthMultiplier,
      activeEffects,
      emergency
    })
    setUndoStack((s) => [...s, snapshot])
  }

  function handleUndo() {
    const last = undoStack[undoStack.length - 1]
    if (!last) return
    const state = JSON.parse(last)
    setDrawPile(state.drawPile)
    setHand(state.hand)
    setDiscard(state.discard)
    setTurn(state.turn)
    setLog(state.log)
    setActivePlumber(state.activePlumber)
    setDamageMultiplier(state.damageMultiplier)
    setHealthMultiplier(state.healthMultiplier)
    setActiveEffects(state.activeEffects)
    setEmergency(state.emergency)
    setUndoStack((s) => s.slice(0, -1))
  }

  function drawToHand(targetSize = 5) {
    let newHand = [...hand]
    let newDraw = [...drawPile]
    let newDiscard = [...discard]

    while (newHand.length < targetSize) {
      if (newDraw.length === 0) {
        if (newDiscard.length === 0) break
        newDraw = shuffle(newDiscard)
        newDiscard = []
      }
      const next = newDraw.shift()!
      newHand.push(next)
    }
    setHand(newHand)
    setDrawPile(newDraw)
    setDiscard(newDiscard)
  }

  function addLog(entry: string) {
    setLog((l) => [...l, entry])
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
  }

  function playCard(baseFilename: string) {
    if (victory?.open || defeat?.open) return
    const card = CARD_MAP[baseFilename]
    if (!card) return

    if (card.type === "sandwich" && !activePlumber) {
      addLog(`No plumber to heal. Play a plumber first.`)
      return
    }

    pushUndo()

    const idx = hand.indexOf(baseFilename)
    if (idx >= 0) {
      const newHand = hand.slice()
      newHand.splice(idx, 1)
      setHand(newHand)
    }

    if (card.type === "plumber") {
      const p = card as PlumberCard
      if (activePlumber) {
        setDiscard((d) => [...d, activePlumber.baseFilename])
      }
      const maxHp = Math.round(p.hp * healthMultiplier)
      const next: ActivePlumber = {
        baseFilename: p.baseFilename,
        name: p.name,
        baseHP: p.hp,
        baseDamage: p.damage,
        hp: maxHp,
        maxHp
      }
      setActivePlumber(next)
      addLog(`Deployed plumber: ${p.name} (HP ${maxHp})`)
      setDiscard((d) => [...d, p.baseFilename])
      return
    }

    if (card.type === "tool") {
      const t = card as ToolCard
      const dmg = Math.round(t.damage * damageMultiplier)
      setEmergency((e) => ({ ...e, hp: clamp(e.hp - dmg, 0, e.maxHp) }))
      addLog(`${card.name} used! Leak reduced by ${dmg}.`)
      setDiscard((d) => [...d, card.baseFilename])
      return
    }

    if (card.type === "power-up") {
      const p = card as PowerUpCard
      if (p.damageMultiplier) {
        const newMult = +(damageMultiplier * p.damageMultiplier).toFixed(2)
        setDamageMultiplier(newMult)
        setActiveEffects((fx) => [...fx, `${card.name} (+${Math.round((p.damageMultiplier - 1) * 100)}% dmg)`])
        addLog(`${card.name} activated! Damage boosted to x${newMult}.`)
      }
      if (p.healthMultiplier) {
        const newHealthMult = +(healthMultiplier * p.healthMultiplier).toFixed(2)
        setHealthMultiplier(newHealthMult)
        setActiveEffects((fx) => [...fx, `${card.name} (+${Math.round((p.healthMultiplier - 1) * 100)}% HP)`])
        if (activePlumber) {
          const newMax = Math.round(activePlumber.baseHP * newHealthMult)
          const newHp = clamp(activePlumber.hp + (newMax - activePlumber.maxHp), 0, newMax)
          setActivePlumber({ ...activePlumber, maxHp: newMax, hp: newHp })
          addLog(`${card.name} fortified ${activePlumber.name}! Max HP now ${newMax}.`)
        } else {
          addLog(`${card.name} will fortify your next deployed plumber.`)
        }
      }
      setDiscard((d) => [...d, card.baseFilename])
      return
    }

    if (card.type === "sandwich") {
      const s = card as SandwichCard
      if (activePlumber) {
        const healed = clamp(activePlumber.hp + s.health, 0, activePlumber.maxHp)
        const amt = healed - activePlumber.hp
        setActivePlumber({ ...activePlumber, hp: healed })
        addLog(`${card.name} restored ${amt} HP to ${activePlumber.name}.`)
      }
      setDiscard((d) => [...d, card.baseFilename])
      return
    }

    if (card.type === "excuse") {
      const ex = card as ExcuseCard
      setEmergency((e) => ({ ...e, turnsLeft: e.turnsLeft + ex.timeGain }))
      addLog(`${card.name}! You gained +${ex.timeGain} turns to respond.`)
      setDiscard((d) => [...d, card.baseFilename])
      return
    }
  }

  function endTurn() {
    if (victory?.open || defeat?.open) return
    pushUndo()

    if (activePlumber) {
      const base = activePlumber.baseDamage
      const total = Math.round(base * damageMultiplier)
      setEmergency((e) => ({ ...e, hp: clamp(e.hp - total, 0, e.maxHp) }))
      addLog(`${activePlumber.name} applied a fix for ${total} damage.`)
    } else {
      addLog(`No plumber on site this turn. The leak worsens...`)
    }

    setTimeout(() => {
      setEmergency((e) => {
        const nextTurns = e.turnsLeft - 1
        let next = { ...e, turnsLeft: nextTurns }
        if (activePlumber) {
          const attack = Math.max(8, 10 + Math.max(0, 6 - nextTurns) * 2)
          setActivePlumber((p) => {
            if (!p) return p
            const newHp = clamp(p.hp - attack, 0, p.maxHp)
            if (newHp <= 0) {
              addLog(`Pressure surge! ${p.name} was overwhelmed (${attack} dmg) and is out.`)
              return null
            } else {
              addLog(`Pressure surge hits ${p.name} for ${attack} damage.`)
              return { ...p, hp: newHp }
            }
          })
        } else {
          addLog(`Rising water pressure! Equipment gets soaked. You lose time.`)
        }
        return next
      })
      setTurn((t) => t + 1)

      drawToHand(5)

      setTimeout(() => {
        setEmergency((e) => {
          if (e.hp <= 0) {
            const bonus = Math.max(0, e.turnsLeft) * 10
            const base = 120
            const reward = base + bonus
            setVictory({ open: true, coins: reward })
            setCoins((c) => c + reward)
          } else if (e.turnsLeft <= 0) {
            setDefeat({ open: true })
          }
          return e
        })
      }, 50)
    }, 50)
  }

  const leakPercent = Math.round((emergency.hp / emergency.maxHp) * 100)
  const canUndo = undoStack.length > 0
  const cardsLeft = drawPile.length

  const typeCounts = useMemo(() => {
    if (!selectedDeck) return null
    const counts: Record<CardType, number> = {
      plumber: 0,
      tool: 0,
      "power-up": 0,
      sandwich: 0,
      excuse: 0
    }
    selectedDeck.cards.forEach((bf) => {
      const c = CARD_MAP[bf]
      if (c) counts[c.type]++
    })
    return counts
  }, [selectedDeck])

  function cardPlayableGlow(bf: string) {
    const card = CARD_MAP[bf]
    if (!card) return ""
    if (card.type === "sandwich" && !activePlumber) return "opacity-60"
    return "ring-0 hover:scale-110"
  }

  return (
    <>
      <Head>
        <title>Emergency • Pocket Plumbers</title>
        <meta name="description" content="Dive into a turn-based plumbing emergency and fix the chaos!" />
      </Head>

      <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 via-emerald-100 to-gray-200 relative font-mono text-gray-900 flex flex-col items-center">
        <div className="absolute inset-0 opacity-20 bg-[url('/pixelgrid.svg')] pointer-events-none" />

        <section className="w-full py-4 bg-white/70 border-b-2 border-emerald-300 flex flex-col items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-emerald-200 border-2 border-emerald-500 shadow flex items-center justify-center">
              <span className="text-2xl drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">🚰</span>
            </div>
            <h1 className="text-emerald-500 text-xl md:text-2xl font-bold uppercase tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              {emergency.name}
            </h1>
          </div>
          <p className="text-gray-700 text-sm mt-2 max-w-xl text-center">{emergency.description}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="uppercase text-xs tracking-wider text-gray-700">Urgency</span>
            <div className="w-40 bg-gray-200 rounded-full overflow-hidden shadow-inner h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, (emergency.turnsLeft / 10) * 100))}%` }}
              />
            </div>
            <span className="text-emerald-600 text-xs uppercase tracking-wider">{emergency.turnsLeft} turns left</span>
          </div>
          <button
            onClick={() => setShowDeckModal(true)}
            className="mt-2 text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-500"
          >
            Change Deck
          </button>
        </section>

        <main className="flex flex-1 justify-center items-center w-full max-w-5xl gap-6 py-6 z-10">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-lg bg-white border-2 border-emerald-400 shadow-md flex items-center justify-center relative">
              <div className="absolute -top-2 -left-2 text-[10px] uppercase tracking-widest font-bold text-emerald-500 bg-white border border-emerald-300 px-2 py-0.5 rounded shadow">
                Emergency
              </div>
              <div className="text-5xl">💦</div>
            </div>
            <div className="mt-3 w-48 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div className="bg-emerald-400 h-3 rounded-full transition-all" style={{ width: `${100 - leakPercent}%` }} />
            </div>
            <span className="uppercase text-xs text-gray-700 mt-1 tracking-wider">
              Leak Remaining: {leakPercent}%
            </span>
          </div>

          <div className="flex flex-col items-center px-2">
            <div className="rounded-full bg-emerald-500 text-white w-10 h-10 flex items-center justify-center font-bold shadow border-2 border-emerald-700">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white rounded-lg border-2 border-emerald-400 shadow-md px-3 py-2 mb-2 w-56">
              {activePlumber ? (
                <>
                  <div className="flex items-center gap-2">
                    <img
                      src={`/cards/${activePlumber.baseFilename}.png`}
                      alt={activePlumber.name}
                      className="w-16 h-16 rounded border-2 border-emerald-300 bg-gray-50"
                    />
                    <div>
                      <div className="font-bold uppercase text-emerald-600 text-xs tracking-wider">{activePlumber.name}</div>
                      <div className="bg-emerald-100 rounded h-2 mt-1 w-full">
                        <div
                          className="bg-emerald-500 h-2 rounded transition-all"
                          style={{ width: `${Math.round((activePlumber.hp / activePlumber.maxHp) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-gray-700 mt-1">
                        HP: {activePlumber.hp}/{activePlumber.maxHp} • Fix: {Math.round(activePlumber.baseDamage * damageMultiplier)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-gray-700 text-sm">No plumber deployed</div>
                  <div className="text-[11px] text-gray-600 mt-1">Play a plumber card to begin repairs.</div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-1 justify-center">
              {activeEffects.map((fx, i) => (
                <div key={i} className="bg-emerald-100 text-emerald-700 text-[11px] rounded px-2 py-1 border border-emerald-400">
                  {fx}
                </div>
              ))}
            </div>
          </div>
        </main>

        <section className="w-full max-w-3xl bg-gray-800 rounded-md border border-emerald-400 text-gray-100 px-4 py-2 text-sm mb-40 z-10">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 uppercase tracking-wider">Turn {turn}</span>
            <span className="text-yellow-300 uppercase tracking-wide">
              {emergency.turnsLeft <= 2 ? "CRITICAL FLOOD—Act fast!" : "Steady Hands—Keep fixing!"}
            </span>
          </div>
          <ul className="list-none pl-0 mt-1 max-h-40 overflow-y-auto space-y-0.5">
            {log.map((entry, i) => (
              <li key={i} className="leading-snug">{entry}</li>
            ))}
          </ul>
        </section>

        <div className="fixed bottom-40 right-6 z-30 flex gap-3">
          <button
            onClick={endTurn}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-5 py-2 uppercase tracking-widest transition disabled:opacity-60"
            disabled={!!victory?.open || !!defeat?.open}
          >
            End Turn
          </button>
          <button
            onClick={handleUndo}
            disabled={!canUndo || !!victory?.open || !!defeat?.open}
            className="bg-emerald-400 text-white rounded px-4 py-2 border border-emerald-600 font-bold uppercase tracking-wide shadow hover:bg-emerald-300 transition disabled:opacity-50"
          >
            Undo Move
          </button>
        </div>

        {/* Bigger card hand */}
        <section className="fixed bottom-0 w-full max-w-5xl z-20 px-4 pb-4">
          <div className="flex items-center gap-4 bg-gray-100 rounded-lg border border-emerald-300 shadow-2xl p-4 overflow-x-auto">
            {hand.map((bf) => {
              const c = CARD_MAP[bf]
              if (!c) return null
              const playableClass = cardPlayableGlow(bf)
              return (
                <div
                  key={bf + Math.random().toString(36).slice(2, 5)}
                  onClick={() => playCard(bf)}
                  className={`bg-white border-2 border-emerald-500 rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-3 cursor-pointer transition-transform relative ${playableClass} min-w-[92px] md:min-w-[108px]`}
                >
                  <img
                    src={`/cards/${bf}.png`}
                    alt={c.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded bg-gray-50"
                  />
                  <div className="absolute bottom-1.5 right-1.5 text-emerald-600 text-[11px] md:text-xs uppercase font-bold">
                    {formatType(c.type)}
                  </div>
                  <div className="absolute top-1.5 left-1.5 text-[11px] md:text-xs uppercase tracking-widest font-bold text-gray-800 bg-emerald-100 border border-emerald-400 rounded px-1.5">
                    {rarityBadge(c.rarity)}
                  </div>
                </div>
              )
            })}
            <div className="ml-auto text-xs md:text-sm text-gray-700 tracking-wide whitespace-nowrap">
              Cards Left: <b>{cardsLeft}</b>
            </div>
          </div>
        </section>

        {showDeckModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center px-4">
            <div className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-6 py-5 max-w-lg w-full">
              <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Select Deck
              </h2>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {decks.map((d) => (
                  <div
                    key={d.id}
                    className={`flex items-center bg-white border rounded-lg px-3 py-2 shadow transition group ${selectedDeckId === d.id ? "border-emerald-400" : "border-emerald-200 hover:border-emerald-400"}`}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 uppercase group-hover:text-emerald-500">{d.name}</div>
                      {typeCounts && selectedDeckId === d.id ? (
                        <div className="text-[11px] text-gray-600 mt-1">
                          Types • Plumbers {typeCounts.plumber} • Tools {typeCounts.tool} • Power-Ups {typeCounts["power-up"]} • Food {typeCounts.sandwich} • Excuses {typeCounts.excuse}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-600 mt-1">
                          {d.cards.length} cards
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDeckId(d.id)
                        setShowDeckModal(false)
                      }}
                      className="ml-2 px-3 py-1 text-xs rounded bg-emerald-500 text-white hover:bg-emerald-400 border-2 border-emerald-700 uppercase tracking-wider"
                    >
                      Use Deck
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-200">
                  Coins: <span className="text-emerald-300 font-bold">{coins}</span>
                </div>
                <button
                  onClick={() => setShowDeckModal(false)}
                  className="px-4 py-2 text-xs rounded bg-gray-800 text-gray-100 hover:bg-gray-900 border border-gray-500 uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {victory?.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-8 py-6 max-w-md w-full text-center">
              <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-2 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Emergency Resolved!
              </h2>
              <p className="text-gray-100">You stopped the flood in time. Great work!</p>
              <div className="mt-3 bg-gray-800 rounded-md border border-gray-600 px-4 py-2 flex items-center justify-center gap-3">
                <span className="text-yellow-300 font-bold uppercase tracking-wider">Coins</span>
                <span className="text-emerald-300 text-xl font-bold">+{victory.coins}</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => startNewBattle(selectedDeck!)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-5 py-2 uppercase tracking-widest transition"
                >
                  Retry
                </button>
                <Link
                  href="/dashboard"
                  className="bg-white text-gray-900 font-bold rounded shadow border-2 border-emerald-400 px-5 py-2 uppercase tracking-widest hover:bg-emerald-50 transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {defeat?.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-gray-700 rounded-lg border-2 border-emerald-400 shadow-2xl px-8 py-6 max-w-md w-full text-center">
              <h2 className="text-emerald-400 text-2xl font-bold uppercase mb-2 drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                Flooded!
              </h2>
              <p className="text-gray-100">The water rose too fast. Tweak your deck and try again.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => startNewBattle(selectedDeck!)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow border-2 border-emerald-700 px-5 py-2 uppercase tracking-widest transition"
                >
                  Retry
                </button>
                <Link
                  href="/deck"
                  className="bg-white text-gray-900 font-bold rounded shadow border-2 border-emerald-400 px-5 py-2 uppercase tracking-widest hover:bg-emerald-50 transition"
                >
                  Edit Deck
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}