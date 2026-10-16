"use client"

import {
  MapPin,
  Flag,
  Package,
  Clock,
  Truck,
  Fuel,
  Gauge,
  Navigation,
  CircleCheck,
  CircleDot,
  Circle,
  Leaf,
} from "lucide-react"
import { Panel, PanelBody, PanelHeader, PanelTitle, Badge } from "@/components/ui/panel"
import { HUB, STOPS, VEHICLE, DRIVER, type StopStatus } from "@/lib/fleet-data"

function statusBadge(status: StopStatus) {
  if (status === "delivered")
    return (
      <Badge tone="success">
        <CircleCheck className="size-3" /> Delivered
      </Badge>
    )
  if (status === "in-transit")
    return (
      <Badge tone="accent">
        <CircleDot className="size-3" /> In transit
      </Badge>
    )
  return (
    <Badge tone="muted">
      <Circle className="size-3" /> Pending
    </Badge>
  )
}

export function DeliveryAssignment() {
  const active = STOPS.find((s) => s.status === "in-transit") ?? STOPS[0]
  const remaining = STOPS.filter((s) => s.status !== "delivered").length
  const totalWeight = STOPS.reduce((a, s) => a + s.weightKg, 0)

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Route summary */}
      <div className="space-y-5 lg:col-span-2">
        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Navigation className="size-4 text-primary" />
              Current Assignment
            </PanelTitle>
            <Badge tone="primary">Order #{active.order}</Badge>
          </PanelHeader>
          <PanelBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" /> Pickup — Consolidation Hub
                </div>
                <p className="text-sm font-semibold leading-snug">{HUB.name}</p>
                <p className="text-xs text-muted-foreground">{HUB.address}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Flag className="size-3.5 text-accent-foreground" /> Next Destination
                </div>
                <p className="text-sm font-semibold leading-snug">{active.business}</p>
                <p className="text-xs text-muted-foreground">
                  {active.address} · {active.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 rounded-lg bg-primary/5 px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span className="font-semibold">ETA {active.etaMinutes} min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Navigation className="size-4" />
                {active.distanceKm} km remaining
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Leaf className="size-4 text-primary" />
                {active.produce}
              </div>
            </div>
          </PanelBody>
        </Panel>

        {/* Remaining orders */}
        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Package className="size-4 text-primary" />
              Remaining Orders
            </PanelTitle>
            <Badge tone="muted">{remaining} of {STOPS.length} stops</Badge>
          </PanelHeader>
          <PanelBody className="space-y-2.5">
            {STOPS.map((s, i) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{s.business}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.produce} · {s.quantity} · {s.weightKg} kg
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.address} · {s.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-10 sm:pl-0">
                  <div className="text-right">
                    <p className="text-xs font-medium">{s.window}</p>
                    <p className="text-xs text-muted-foreground">ETA {s.etaMinutes}m</p>
                  </div>
                  {statusBadge(s.status)}
                </div>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </div>

      {/* Vehicle + driver */}
      <div className="space-y-5">
        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Vehicle
            </PanelTitle>
            <Badge tone="primary">{VEHICLE.plate}</Badge>
          </PanelHeader>
          <PanelBody className="space-y-3">
            <div>
              <p className="text-sm font-semibold">{VEHICLE.model}</p>
              <p className="text-xs text-muted-foreground">{VEHICLE.type}</p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Gauge className="size-3.5" /> Load
                </span>
                <span className="font-medium">
                  {VEHICLE.loadKg.toLocaleString()} / {VEHICLE.capacity}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: "61%" }} />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Fuel className="size-3.5" /> Fuel
                </span>
                <span className="font-medium">{VEHICLE.fuelPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${VEHICLE.fuelPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Odometer</span>
              <span className="font-medium text-foreground">
                {VEHICLE.odometerKm.toLocaleString()} km
              </span>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Driver On Duty</PanelTitle>
          </PanelHeader>
          <PanelBody>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                AF
              </div>
              <div>
                <p className="text-sm font-semibold">{DRIVER.name}</p>
                <p className="text-xs text-muted-foreground">
                  ID {DRIVER.id} · {DRIVER.phone}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-secondary/60 p-2">
                <p className="font-semibold text-foreground">{totalWeight.toLocaleString()} kg</p>
                <p className="text-muted-foreground">Total produce</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-2">
                <p className="font-semibold text-foreground">4 states</p>
                <p className="text-muted-foreground">On this run</p>
              </div>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
