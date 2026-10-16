"use client"

import {
  Thermometer,
  Droplets,
  DoorClosed,
  Zap,
  Snowflake,
  ShieldCheck,
  CircleCheck,
  Clock,
  Wind,
} from "lucide-react"
import { Panel, PanelBody, PanelHeader, PanelTitle, Badge } from "@/components/ui/panel"
import { IOT, SENSOR_HISTORY } from "@/lib/fleet-data"

function Gauge({
  value,
  min,
  max,
  unit,
  label,
  icon: Icon,
  optimalLow,
  optimalHigh,
}: {
  value: number
  min: number
  max: number
  unit: string
  label: string
  icon: typeof Thermometer
  optimalLow: number
  optimalHigh: number
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const inRange = value >= optimalLow && value <= optimalHigh
  return (
    <Panel>
      <PanelBody className="space-y-3 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          {inRange ? (
            <Badge tone="success">
              <CircleCheck className="size-3" /> Optimal
            </Badge>
          ) : (
            <Badge tone="danger">Alert</Badge>
          )}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight">{value}</span>
          <span className="mb-1 text-lg font-medium text-muted-foreground">{unit}</span>
        </div>
        <div className="space-y-1.5">
          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {min}
              {unit}
            </span>
            <span className="text-primary">
              Target {optimalLow}–{optimalHigh}
              {unit}
            </span>
            <span>
              {max}
              {unit}
            </span>
          </div>
        </div>
      </PanelBody>
    </Panel>
  )
}

export function IotMonitoring() {
  const maxTemp = Math.max(...SENSOR_HISTORY.map((r) => r.temp))
  const container = [
    { label: "Door seal", value: IOT.container.doorSealed ? "Sealed" : "Open", ok: IOT.container.doorSealed, icon: DoorClosed },
    { label: "Reefer power", value: IOT.container.powerOk ? "Connected" : "Fault", ok: IOT.container.powerOk, icon: Zap },
    { label: "Compressor", value: IOT.container.compressorOk ? "Running" : "Stopped", ok: IOT.container.compressorOk, icon: Wind },
    { label: "Cold chain", value: "Intact", ok: true, icon: ShieldCheck },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Gauge
          value={IOT.temp.value}
          min={IOT.temp.min}
          max={IOT.temp.max}
          unit={IOT.temp.unit}
          label="Container Temperature"
          icon={Thermometer}
          optimalLow={2}
          optimalHigh={6}
        />
        <Gauge
          value={IOT.humidity.value}
          min={70}
          max={100}
          unit={IOT.humidity.unit}
          label="Relative Humidity"
          icon={Droplets}
          optimalLow={80}
          optimalHigh={95}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Temp trend */}
        <Panel className="lg:col-span-2">
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <Snowflake className="size-4 text-primary" />
              Temperature Log — Today
            </PanelTitle>
            <Badge tone="muted">Peak {maxTemp}°C</Badge>
          </PanelHeader>
          <PanelBody>
            <div className="flex h-44 gap-2 sm:gap-3">
              {SENSOR_HISTORY.map((r) => {
                const h = ((r.temp - 0) / 8) * 100
                const warm = r.temp > 6
                return (
                  <div key={r.t} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-md ${warm ? "bg-destructive/70" : "bg-primary"}`}
                        style={{ height: `${h}%` }}
                        title={`${r.temp}°C`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">{r.temp}°</span>
                    <span className="text-[11px] text-muted-foreground">{r.t}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              Cold chain held within the 2–6°C target for the entire trip. No breach recorded.
            </div>
          </PanelBody>
        </Panel>

        {/* Container status */}
        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Container Status
            </PanelTitle>
          </PanelHeader>
          <PanelBody className="space-y-2.5">
            {container.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <c.icon className="size-4" />
                  {c.label}
                </span>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    c.ok ? "text-primary" : "text-destructive"
                  }`}
                >
                  {c.ok && <CircleCheck className="size-3.5" />}
                  {c.value}
                </span>
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Door last opened: {IOT.container.lastOpened}
            </p>
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
