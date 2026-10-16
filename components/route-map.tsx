"use client"

import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"
import { HUB, DRIVER, STOPS, ROUTE_LINE, type DeliveryStop } from "@/lib/fleet-data"

function makeIcon(html: string, size = 34) {
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const hubIcon = makeIcon(
  `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;background:oklch(0.28 0.04 155);color:white;box-shadow:0 2px 8px rgba(0,0,0,.3);font-size:16px;">🏭</div>`,
)

const driverIcon = makeIcon(
  `<div style="position:relative;width:38px;height:38px;">
     <div style="position:absolute;inset:0;border-radius:50%;background:oklch(0.54 0.13 150 / .25);animation:pulse 2s infinite;"></div>
     <div style="position:absolute;inset:7px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:oklch(0.54 0.13 150);color:white;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:15px;">🚚</div>
   </div>`,
  38,
)

function stopIcon(index: number, status: DeliveryStop["status"]) {
  const bg =
    status === "delivered"
      ? "oklch(0.55 0.13 150)"
      : status === "in-transit"
        ? "oklch(0.75 0.16 75)"
        : "oklch(0.98 0.008 145)"
  const fg = status === "pending" ? "oklch(0.3 0.04 150)" : "white"
  const border = status === "pending" ? "border:2px solid oklch(0.54 0.13 150);" : ""
  return makeIcon(
    `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:${bg};color:${fg};${border}box-shadow:0 2px 6px rgba(0,0,0,.3);font-weight:700;font-size:13px;font-family:system-ui;">${index + 1}</div>`,
    30,
  )
}

function FitBounds() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds([HUB.coords, DRIVER.coords, ...STOPS.map((s) => s.coords)])
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [map])
  return null
}

export default function RouteMap() {
  return (
    <MapContainer
      center={DRIVER.coords}
      zoom={8}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <Polyline
        positions={ROUTE_LINE}
        pathOptions={{ color: "oklch(0.54 0.13 150)", weight: 4, opacity: 0.85, dashArray: "1 10", lineCap: "round" }}
      />

      <Marker position={HUB.coords} icon={hubIcon}>
        <Popup>
          <strong>{HUB.name}</strong>
          <br />
          {HUB.address}
        </Popup>
      </Marker>

      <Marker position={DRIVER.coords} icon={driverIcon}>
        <Popup>
          <strong>{DRIVER.name}</strong>
          <br />
          {DRIVER.heading} · {DRIVER.speedKmh} km/h
        </Popup>
      </Marker>

      {STOPS.map((s, i) => (
        <Marker key={s.id} position={s.coords} icon={stopIcon(i, s.status)}>
          <Popup>
            <strong>
              #{i + 1} · {s.business}
            </strong>
            <br />
            {s.produce}
            <br />
            {s.address}
          </Popup>
        </Marker>
      ))}

      <FitBounds />
    </MapContainer>
  )
}
