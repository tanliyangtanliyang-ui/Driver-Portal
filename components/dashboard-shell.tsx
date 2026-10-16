"use client"

import { useState } from "react"
import {
  Truck,
  MapPin,
  Thermometer,
  Phone,
  Leaf,
  Signal,
  CircleCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DeliveryAssignment } from "@/components/modules/delivery-assignment"
import { GpsTracking } from "@/components/modules/gps-tracking"
import { IotMonitoring } from "@/components/modules/iot-monitoring"
import { ContactPanel } from "@/components/modules/contact-panel"
import { DRIVER, IOT } from "@/lib/fleet-data"

type TabKey = "assignment" | "gps" | "iot" | "contact"

const NAV: { key: TabKey; label: string; sub: string; icon: typeof Truck }[] = [
  { key: "assignment", label: "Delivery Assignment", sub: "Orders & vehicle", icon: Truck },
  { key: "gps", label: "GPS Tracking", sub: "Live route map", icon: MapPin },
  { key: "iot", label: "IoT Monitoring", sub: "Cold-chain sensors", icon: Thermometer },
  { key: "contact", label: "Contact Panel", sub: "Emergency & hub", icon: Phone },
]

export function DashboardShell() {
  const [tab, setTab] = useState<TabKey>("assignment")
  const current = NAV.find((n) => n.key === tab)!

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">TaniTrack</p>
            <p className="text-xs text-sidebar-foreground/60">Farm Produce Fleet</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => {
            const active = tab === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="size-4.5 shrink-0" />
                <span>
                  <span className="block text-sm font-medium leading-tight">{item.label}</span>
                  <span className="block text-xs text-sidebar-foreground/50">{item.sub}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="mx-3 mb-4 rounded-lg bg-sidebar-accent/60 p-3 text-xs">
          <div className="mb-1 flex items-center gap-1.5 font-medium">
            <Signal className="size-3.5 text-sidebar-primary" />
            Telemetry online
          </div>
          <p className="text-sidebar-foreground/60">
            GPS + IoT sensors reporting every 30s. Cold chain {IOT.temp.value}°C.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-border bg-card/80 px-5 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight">{current.label}</h1>
              <p className="text-xs text-muted-foreground">
                Peninsular Malaysia · Run TT-4401 → TT-4404
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:flex">
                <CircleCheck className="size-3.5" /> On schedule
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  AF
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold leading-tight">{DRIVER.name.split(" ").slice(0, 2).join(" ")}</p>
                  <p className="text-xs text-muted-foreground">{DRIVER.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto md:hidden">
            {NAV.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === item.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-5">
          {tab === "assignment" && <DeliveryAssignment />}
          {tab === "gps" && <GpsTracking />}
          {tab === "iot" && <IotMonitoring />}
          {tab === "contact" && <ContactPanel />}
        </main>
      </div>
    </div>
  )
}
