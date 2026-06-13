# MapApp — Abuja Explorer

A cross-platform mobile app that lets you discover 10 iconic locations across Abuja, Nigeria. Tap a pin on the map to read a full description, see an image, and get the coordinates. Built with Expo + React Native for the frontend and a Cloudflare Worker for the API backend.

---

## Live API

```
https://map-app-locations.cyriluket-maps.workers.dev
```

| Endpoint | Description |
|---|---|
| `GET /locations` | Returns all 10 locations as a JSON array |
| `GET /locations/:id` | Returns a single location by ID |

Test it in your browser:
- https://map-app-locations.cyriluket-maps.workers.dev/locations
- https://map-app-locations.cyriluket-maps.workers.dev/locations/1

---

## Screenshots

> Run `npx expo start` and scan the QR code with Expo Go to see the app live.

**Screen 1 — Map View**
- Full-screen interactive map centered on Abuja
- Colour-coded pins per category (landmark, park, museum, market, restaurant)
- Live location button + dark/light mode toggle
- Badge showing total location count

**Screen 2 — Location Detail**
- Full-width header image
- Category badge, name, description
- Address and GPS coordinates
- Back button to return to the map

---

## Project Structure

```
/
├── MapApp/                     # Expo React Native app
│   ├── app/
│   │   ├── _layout.tsx         # Root layout — QueryClient + ThemeProvider + Stack navigator
│   │   ├── index.tsx           # Screen 1: Map with pins
│   │   └── location/[id].tsx   # Screen 2: Location detail (dynamic route)
│   ├── components/
│   │   ├── MapPin.tsx          # Custom coloured marker with drop-shadow tail
│   │   └── LocationCard.tsx    # Card component (image + badge + description)
│   ├── constants/
│   │   ├── api.ts              # Cloudflare Worker base URL
│   │   └── theme.ts            # Light + dark theme token objects
│   ├── context/
│   │   └── ThemeContext.tsx    # React context for dark/light mode state
│   ├── hooks/
│   │   ├── useLocations.ts     # useLocations() + useLocation(id) — React Query hooks
│   │   └── useTheme.ts         # Reads ThemeContext
│   ├── types/
│   │   └── location.ts         # Location TypeScript interface
│   ├── assets/                 # App icons and splash screen
│   ├── app.json                # Expo config
│   └── package.json
│
└── worker/                     # Cloudflare Worker API
    ├── src/
    │   ├── index.ts            # Request handler + hardcoded LOCATIONS array
    │   └── types.ts            # Location type (shared shape)
    ├── wrangler.toml           # Worker name + compatibility date
    └── package.json
```

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Expo SDK 54 | Managed workflow — no bare native config needed |
| Routing | Expo Router (file-based) | `app/` directory maps directly to screens; `[id].tsx` = dynamic segment |
| Maps | react-native-maps 1.20 | Best-in-class map library for iOS + Android |
| Data fetching | @tanstack/react-query 5 | Automatic caching, background refetch, built-in loading/error state |
| API backend | Cloudflare Worker (TypeScript) | Free tier, globally distributed, zero cold-start |
| Language | TypeScript throughout | Shared `Location` type between app and worker |
| Styling | React Native `StyleSheet` API | No extra library — keeps the bundle lean |
| Theme | React Context + token objects | Lightweight dark/light mode without a third-party library |

---

## Location Data

Ten real Abuja landmarks are hardcoded in the Cloudflare Worker (`worker/src/index.ts`). No database is needed.

| # | Name | Category |
|---|---|---|
| 1 | Aso Rock | landmark |
| 2 | Aso Rock Presidential Villa | landmark |
| 3 | Nigerian National Mosque | landmark |
| 4 | Nigerian National Christian Centre | landmark |
| 5 | Millennium Park | park |
| 6 | Arts and Crafts Village | market |
| 7 | National Museum Abuja | museum |
| 8 | Wuse Market | market |
| 9 | Jabi Lake | park |
| 10 | Transcorp Hilton Abuja | restaurant |

Each location has: `id`, `name`, `description`, `category`, `lat`, `lng`, `imageUrl`, `address`.

---

## TypeScript Types

```typescript
// MapApp/types/location.ts
export interface Location {
  id: string;
  name: string;
  description: string;
  category: string;   // "museum" | "park" | "restaurant" | "landmark" | "market"
  lat: number;
  lng: number;
  imageUrl: string;
  address: string;
}
```

---

## Running the App Locally

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/client) installed on your phone **or** an iOS/Android simulator
- (Optional) Xcode (iOS) / Android Studio (Android) for native simulators

### Steps

```bash
# 1. Clone the repo and enter the app directory
cd MapApp

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npx expo start
```

Expo will print a QR code in the terminal. Scan it with Expo Go (iOS or Android) to open the app instantly. The app hits the live Cloudflare Worker — no local server needed.

#### Run on a simulator

```bash
# iOS simulator (requires Xcode on macOS)
npm run ios

# Android emulator (requires Android Studio)
npm run android

# Browser (web preview — maps may be limited)
npm run web
```

---

## Deploying / Updating the Cloudflare Worker

```bash
# Enter the worker directory
cd worker

# Install worker dependencies
npm install

# Deploy to Cloudflare (requires wrangler login)
npx wrangler login     # one-time auth
npx wrangler deploy    # pushes to workers.dev
```

After deploy, Wrangler prints the public URL. Paste it into `MapApp/constants/api.ts`:

```typescript
export const BASE_URL = "https://<your-worker-name>.<your-subdomain>.workers.dev";
```

### Worker routing (no framework)

The worker manually matches URL paths:

```typescript
if (url.pathname === "/locations") { /* return all */ }

const match = url.pathname.match(/^\/locations\/(.+)$/);
if (match) { /* return single by id */ }
```

Every response includes `Access-Control-Allow-Origin: *` and handles `OPTIONS` preflight so the app can call it from any origin.

---

## How Expo Router's File-Based Routing Works

```
app/
├── _layout.tsx        → wraps every screen (providers, navigator)
├── index.tsx          → renders at route  "/"
└── location/
    └── [id].tsx       → renders at route  "/location/:id"
```

Inside `[id].tsx`, the dynamic segment is read with:

```typescript
const { id } = useLocalSearchParams<{ id: string }>();
```

Navigation from the map screen:

```typescript
router.push(`/location/${location.id}`);
```

Back navigation:

```typescript
router.back();
```

---

## How React Query Is Wired Up

The root layout wraps the entire app in a `QueryClientProvider`:

```typescript
// app/_layout.tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

Custom hooks in `hooks/useLocations.ts` expose the queries:

```typescript
export function useLocations() {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });
}

export function useLocation(id: string) {
  return useQuery<Location, Error>({
    queryKey: ['location', id],
    queryFn: () => fetchLocation(id),
    enabled: !!id,
  });
}
```

**Why React Query over `useEffect` + `fetch`?**
- Automatic caching — navigating back to the map doesn't re-fetch
- `staleTime: 5min` prevents hammering the Worker on every render
- Built-in `isLoading` / `isError` / `error` state — no manual state management
- Request deduplication — two components requesting the same key share one request
- Background refetch on window focus (useful on web)

---

## Dark / Light Mode

A `ThemeContext` (React Context) holds the current theme and a `toggleTheme` function. Screens and components call `useTheme()` to get the active token object. The map itself respects the mode via `userInterfaceStyle={isDark ? 'dark' : 'light'}`. A moon/sun button in the top-right corner of the map screen toggles the theme.

---

## Pin Colour Coding

Each `MapPin` is coloured by category:

| Category | Colour |
|---|---|
| landmark | Blue `#3B82F6` |
| park | Green `#10B981` |
| museum | Purple `#8B5CF6` |
| market | Pink `#EC4899` |
| restaurant | Amber `#F59E0B` |
| beach | Cyan `#06B6D4` |

---

## How to Extend

| Feature | Approach |
|---|---|
| User's current location | `MapView` already has `showsUserLocation` — enable location permissions via `expo-location` |
| Pin clustering | Add `react-native-map-clustering` as a drop-in `MapView` replacement |
| Favourites | Store IDs in `AsyncStorage` or `expo-secure-store`; filter in a new "Saved" tab |
| Auth | Add a `/auth` route with Expo Auth Session + a JWT-protected Worker endpoint |
| Real database | Replace the hardcoded array in the Worker with a `D1` (Cloudflare SQLite) binding |
| Search | Add a `TextInput` on the map screen; filter the cached `locations` array client-side |

---

## wrangler.toml Explained

```toml
name = "map-app-locations"        # Worker name → subdomain prefix
main = "src/index.ts"             # Entry point
compatibility_date = "2024-01-01" # Pins the Workers runtime version
```

Cloudflare Workers differ from a Node server:
- No file system, no `require('fs')`, no long-lived process
- Each request is a fresh invocation (V8 isolate, not a process)
- Cold-start is ~0ms — isolates are pre-warmed globally
- Billed per request, not per server hour
- `wrangler.toml` replaces `package.json` as the deployment manifest

---

## Dependencies

### MapApp

| Package | Version | Purpose |
|---|---|---|
| expo | ~54.0.35 | Core SDK |
| expo-router | ~6.0.24 | File-based navigation |
| expo-status-bar | ~3.0.9 | Status bar control |
| react-native-maps | 1.20.1 | Map view and markers |
| react-native-screens | ~4.16.0 | Native screen transitions |
| react-native-gesture-handler | ~2.28.0 | Touch handling |
| react-native-reanimated | ~4.1.1 | Animation engine |
| @tanstack/react-query | ^5.101.0 | Data fetching + caching |
| react | 19.1.0 | UI framework |
| react-native | 0.81.5 | Mobile runtime |

### Worker

No runtime dependencies — the Worker uses only the global `fetch` API and `Response` built into the Cloudflare Workers runtime.
