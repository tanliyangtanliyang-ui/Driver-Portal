"use client"

import dynamic from "next/dynamic"
import { Locate, Navigation, Route, Clock, Gauge, MapPin, Flag } from "lucide-react"
import { Panel, PanelBody, PanelHeader, PanelTitle, Badge } from "@/components/ui/panel"
import { DRIVER, HUB, STOPS } from "@/lib/fleet-data"

const RouteMap = dynamic(() => import("@/components/route-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Loading live map…
    </div>
  ),
})

export function GpsTracking() {
  const active = STOPS.find((s) => s.status === "in-transit") ?? STOPS[0]
  const totalKm = STOPS[STOPS.length - 1].distanceKm

  const stats = [
    { icon: Route, label: "Distance to final stop", value: `${totalKm} km` },
    { icon: Clock, label: "ETA next drop", value: `${active.etaMinutes} min` },
    { icon: Gauge, label: "Current speed", value: `${DRIVER.speedKmh} km/h` },
    { icon: Navigation, label: "Heading", value: DRIVER.heading },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel className="overflow-hidden lg:col-span-2">
        <PanelHeader>
          <PanelTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            Live GPS — Peninsular Malaysia
          </PanelTitle>
          <Badge tone="success">
            <span className="size-1.5 rounded-full bg-primary" /> Live
          </Badge>
        </PanelHeader>
        <div className="h-[460px] w-full border-t border-border">
          <RouteMap />
        </div>
      </Panel>

      <div className="space-y-5">
        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Locate className="size-4 text-primary" />
              Current Location
            </PanelTitle>
          </PanelHeader>
          <PanelBody className="space-y-3">
            <p className="text-sm font-semibold leading-snug">
              North–South Expressway (E1), near Bidor, Perak
            </p>
            <p className="text-xs text-muted-foreground">
              {DRIVER.coords[0].toFixed(4)}° N, {DRIVER.coords[1].toFixed(4)}° E
            </p>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg bg-secondary/60 p-3">
                  <s.icon className="mb-1 size-4 text-primary" />
                  <p className="text-sm font-semibold leading-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Route className="size-4 text-primary" />
              Route Progress
            </PanelTitle>
          </PanelHeader>
          <PanelBody>
            <ol className="relative space-y-4 border-l border-dashed border-border pl-5">
              <li className="relative">
                <span className="absolute -left-[26px] flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="size-2.5" />
                </span>
                <p className="text-sm font-medium">{HUB.name}</p>
                <p className="text-xs text-muted-foreground">Departed 06:15 · loaded</p>
              </li>
              {STOPS.map((s) => (
                <li key={s.id} className="relative">
                  <span
                    className={`absolute -left-[26px] size-4 rounded-full border-2 ${
                      s.status === "in-transit"
                        ? "border-accent-foreground bg-accent"
                        : "border-border bg-card"
                    }`}
                  />
                  <p className="text-sm font-medium">{s.business}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.state} · {s.distanceKm} km · {s.window}
                  </p>
                </li>
              ))}
              <li className="relative">
                <span className="absolute -left-[26px] flex size-4 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground">
                  <Flag className="size-2.5" />
                </span>
                <p className="text-sm font-medium">Run complete</p>
                <p className="text-xs text-muted-foreground">Return to hub</p>
              </li>
            </ol>
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
