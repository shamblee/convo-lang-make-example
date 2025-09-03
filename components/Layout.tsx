import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Coins, Menu, X, Wrench } from "lucide-react"

type LayoutProps = {
  children: React.ReactNode
}

function classNames(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ")
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // ignore write errors
      }
    }
  }, [key, value])

  return [value, setValue] as const
}

const COINS_KEY = "pp_coins"

const NAV_LINKS = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Card List", path: "/cards" },
  { name: "Deck", path: "/deck" },
  { name: "Card Shop", path: "/shop" },
  { name: "Emergency", path: "/emergency" }
]

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [coins] = useLocalStorage<number>(COINS_KEY, 0)

  useEffect(() => {
    const handleRoute = () => setMobileOpen(false)
    // Close mobile menu on route change
    router.events.on("routeChangeStart", handleRoute)
    return () => {
      router.events.off("routeChangeStart", handleRoute)
    }
  }, [router.events])

  const activePath = useMemo(() => router.pathname, [router.pathname])

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 font-mono flex flex-col">
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b-2 border-emerald-500">
        <div className="w-full px-3 md:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-emerald-500 bg-gray-800 text-emerald-400 shadow group-hover:border-emerald-400 transition">
                  <Wrench size={18} />
                </span>
                <span className="uppercase tracking-wider font-extrabold text-sm md:text-base drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] group-hover:text-emerald-400 transition">
                  Pocket Plumbers
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = activePath === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={classNames(
                      "px-3 py-2 rounded-md text-xs uppercase tracking-wider border transition",
                      "hover:text-emerald-400 hover:border-emerald-400",
                      isActive
                        ? "text-emerald-400 border-emerald-500 bg-gray-800"
                        : "text-gray-200 border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded-md border-2 border-emerald-500 bg-gray-800 px-2 py-1 shadow"
                aria-label="Coins"
                title="Coins"
              >
                <Coins className="text-emerald-400" size={16} />
                <span className="text-emerald-400 font-bold tabular-nums drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                  {coins}
                </span>
              </div>
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md border-2 border-emerald-500 bg-gray-800 p-2 text-gray-100 hover:border-emerald-400 hover:text-emerald-400 transition"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <nav className="px-3 py-2">
              {NAV_LINKS.map((item) => {
                const isActive = activePath === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={classNames(
                      "block w-full px-3 py-2 rounded-md text-xs uppercase tracking-wider border transition mb-1",
                      "hover:text-emerald-400 hover:border-emerald-400",
                      isActive
                        ? "text-emerald-400 border-emerald-500 bg-gray-800"
                        : "text-gray-200 border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="w-full flex-1">{children}</main>
    </div>
  )
}