"use client"

import { ShieldAlert, Warehouse, Users, Phone, MessageSquare, Headset } from "lucide-react"
import { Panel, PanelBody, PanelHeader, PanelTitle, Badge } from "@/components/ui/panel"
import { buttonVariants } from "@/components/ui/button"
import { CONTACTS, type Contact } from "@/lib/fleet-data"

const groups: { key: Contact["kind"]; title: string; icon: typeof Phone; tone: "danger" | "primary" | "accent" }[] = [
  { key: "emergency", title: "Emergency", icon: ShieldAlert, tone: "danger" },
  { key: "hub", title: "Consolidation Hub", icon: Warehouse, tone: "primary" },
  { key: "customer", title: "Customers / Recipients", icon: Users, tone: "accent" },
]

function ContactRow({ c }: { c: Contact }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{c.name}</p>
        <p className="truncate text-xs text-muted-foreground">{c.role}</p>
        {c.note && <p className="truncate text-xs text-muted-foreground">{c.note}</p>}
        <p className="mt-0.5 text-xs font-medium text-primary">{c.phone}</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        {c.kind === "customer" && (
          <button
            type="button"
            className={buttonVariants({ variant: "outline", size: "icon", className: "size-9" })}
            aria-label={`Message ${c.name}`}
          >
            <MessageSquare className="size-4" />
          </button>
        )}
        <a
          href={`tel:${c.phone.replace(/\s/g, "")}`}
          className={buttonVariants({ size: "icon", className: "size-9" })}
          aria-label={`Call ${c.name}`}
        >
          <Phone className="size-4" />
        </a>
      </div>
    </div>
  )
}

export function ContactPanel() {
  const emergency = CONTACTS.filter((c) => c.kind === "emergency")

  return (
    <div className="space-y-5">
      {/* Emergency banner */}
      <Panel className="border-destructive/30 bg-destructive/5">
        <PanelBody className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-destructive text-white">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Emergency & breakdown assistance</p>
              <p className="text-xs text-muted-foreground">
                Accident, medical, cold-chain failure or vehicle breakdown — call immediately.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {emergency.map((c) => (
              <a
                key={c.id}
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className={buttonVariants({ variant: "destructive", size: "lg" })}
              >
                <Phone className="size-4" /> {c.phone}
              </a>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map((g) => {
          const list = CONTACTS.filter((c) => c.kind === g.key)
          return (
            <Panel key={g.key}>
              <PanelHeader>
                <PanelTitle className="flex items-center gap-2">
                  <g.icon className="size-4 text-primary" />
                  {g.title}
                </PanelTitle>
                <Badge tone={g.tone}>{list.length}</Badge>
              </PanelHeader>
              <PanelBody className="space-y-2.5">
                {list.map((c) => (
                  <ContactRow key={c.id} c={c} />
                ))}
              </PanelBody>
            </Panel>
          )
        })}
      </div>

      <Panel>
        <PanelBody className="flex items-center gap-3 pt-5">
          <Headset className="size-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Fleet Control Room is staffed 24/7. All calls are logged against order run{" "}
            <span className="font-medium text-foreground">TT-4401 → TT-4404</span>.
          </p>
        </PanelBody>
      </Panel>
    </div>
  )
}
