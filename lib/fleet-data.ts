export type StopStatus = "delivered" | "in-transit" | "pending"

export type DeliveryStop = {
  id: string
  order: string
  recipient: string
  business: string
  address: string
  state: string
  produce: string
  quantity: string
  weightKg: number
  coords: [number, number] // [lat, lng]
  status: StopStatus
  window: string
  etaMinutes: number
  distanceKm: number
  contact: string
}

// Consolidation hub — Cameron Highlands, Pahang (source of fresh farm produce)
export const HUB = {
  name: "Cameron Highlands Consolidation Hub",
  address: "Lot 4, Pusat Pengumpulan Tanah Rata, Pahang",
  coords: [4.4710, 101.3771] as [number, number],
}

// Driver's live position (currently between Ipoh and KL, on the way south)
export const DRIVER = {
  name: "Ahmad Faizal bin Rahim",
  id: "DRV-2291",
  phone: "+60 12-887 4410",
  coords: [3.9820, 101.4200] as [number, number],
  heading: "South-bound, Route E1",
  speedKmh: 84,
}

export const VEHICLE = {
  plate: "PMK 7823",
  model: "Isuzu NPR Reefer Truck",
  type: "Refrigerated (Cold Chain)",
  capacity: "3,500 kg",
  loadKg: 2140,
  fuelPct: 62,
  odometerKm: 184203,
}

export const STOPS: DeliveryStop[] = [
  {
    id: "s1",
    order: "TT-4401",
    recipient: "Siti Aminah",
    business: "Pasar Borong Selayang",
    address: "Jalan Ipoh, Selayang, Selangor",
    state: "Selangor",
    produce: "Cameron Highlands Lettuce & Cabbage",
    quantity: "48 crates",
    weightKg: 620,
    coords: [3.2560, 101.6480],
    status: "in-transit",
    window: "10:30 – 11:30",
    etaMinutes: 42,
    distanceKm: 58,
    contact: "+60 3-6120 8841",
  },
  {
    id: "s2",
    order: "TT-4402",
    recipient: "Lim Wei Sheng",
    business: "TF Value Mart, KL City",
    address: "123 Orchid Drive, Kuala Lumpur",
    state: "Kuala Lumpur",
    produce: "Strawberries & Cherry Tomatoes",
    quantity: "30 punnet boxes",
    weightKg: 310,
    coords: [3.1390, 101.6869],
    status: "in-transit",
    window: "11:45 – 12:30",
    etaMinutes: 74,
    distanceKm: 92,
    contact: "+60 3-2145 3320",
  },
  {
    id: "s3",
    order: "TT-4403",
    recipient: "Nurul Huda",
    business: "Econsave Seremban",
    address: "Jalan Rasah, Seremban, Negeri Sembilan",
    state: "Negeri Sembilan",
    produce: "Carrots, Leeks & Spring Onion",
    quantity: "55 crates",
    weightKg: 710,
    coords: [2.7297, 101.9381],
    status: "pending",
    window: "13:30 – 14:30",
    etaMinutes: 138,
    distanceKm: 156,
    contact: "+60 6-763 1190",
  },
  {
    id: "s4",
    order: "TT-4404",
    recipient: "Rajesh Kumar",
    business: "Melaka Central Wholesale",
    address: "Jalan Hang Tuah, Melaka",
    state: "Melaka",
    produce: "Broccoli, Cauliflower & Capsicum",
    quantity: "40 crates",
    weightKg: 500,
    coords: [2.1896, 102.2501],
    status: "pending",
    window: "15:15 – 16:15",
    etaMinutes: 214,
    distanceKm: 233,
    contact: "+60 6-282 7745",
  },
]

// Ordered route line: hub -> driver -> stops
export const ROUTE_LINE: [number, number][] = [
  HUB.coords,
  [4.5975, 101.0901], // Ipoh
  DRIVER.coords,
  STOPS[0].coords,
  STOPS[1].coords,
  STOPS[2].coords,
  STOPS[3].coords,
]

export type SensorReading = {
  t: string
  temp: number
  humidity: number
}

// Cold-chain readings for the last hours (reefer target 2–6°C)
export const SENSOR_HISTORY: SensorReading[] = [
  { t: "06:00", temp: 3.8, humidity: 88 },
  { t: "07:00", temp: 4.1, humidity: 87 },
  { t: "08:00", temp: 3.6, humidity: 90 },
  { t: "09:00", temp: 4.4, humidity: 86 },
  { t: "10:00", temp: 5.2, humidity: 84 },
  { t: "11:00", temp: 4.9, humidity: 85 },
  { t: "12:00", temp: 4.3, humidity: 89 },
]

export const IOT = {
  temp: { value: 4.3, min: 2, max: 6, unit: "°C" },
  humidity: { value: 89, min: 80, max: 95, unit: "%" },
  container: {
    doorSealed: true,
    powerOk: true,
    compressorOk: true,
    lastOpened: "08:12 — Ipoh checkpoint",
  },
}

export type Contact = {
  id: string
  name: string
  role: string
  phone: string
  kind: "emergency" | "hub" | "customer"
  note?: string
}

export const CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "MERS 999 Emergency",
    role: "Ambulance / Police / Fire",
    phone: "999",
    kind: "emergency",
    note: "Nationwide emergency response",
  },
  {
    id: "c2",
    name: "Fleet Control Room",
    role: "24/7 Dispatch & Breakdown",
    phone: "+60 5-491 2200",
    kind: "emergency",
    note: "Accident, breakdown & cold-chain alerts",
  },
  {
    id: "c3",
    name: "Cameron Highlands Hub",
    role: "Consolidation & Loading",
    phone: "+60 5-491 1088",
    kind: "hub",
    note: "En Zulkifli — Hub Supervisor",
  },
  {
    id: "c4",
    name: "Quality Control Desk",
    role: "Produce grading & rejects",
    phone: "+60 5-491 1092",
    kind: "hub",
  },
  {
    id: "c5",
    name: "Siti Aminah",
    role: "Pasar Borong Selayang — TT-4401",
    phone: "+60 3-6120 8841",
    kind: "customer",
  },
  {
    id: "c6",
    name: "Lim Wei Sheng",
    role: "TF Value Mart KL — TT-4402",
    phone: "+60 3-2145 3320",
    kind: "customer",
  },
]
