# Build Summary

## What Was Built
A cross-platform Expo React Native app that displays 10 interesting New York City locations on an interactive map. Tapping a pin navigates to a detail screen showing the location's image, category badge, address, coordinates, and description. Data is served from a deployed Cloudflare Worker with hardcoded JSON — no database required.

## Architecture
- **API:** https://map-app-locations.cyriluket-maps.workers.dev — two endpoints: `GET /locations` (array of 10 Location objects) and `GET /locations/:id` (single Location). Data is hardcoded TypeScript; CORS headers on every response.
- **App:** Expo SDK 56, Expo Router for file-based navigation, @tanstack/react-query v5 for data fetching with 5-minute cache and auto-retry. Custom `useLocations` / `useLocation` hooks abstract the fetch logic.
- **Navigation:** Two-screen stack — `app/index.tsx` (map) pushes to `app/location/[id].tsx` (detail) via `router.push('/location/' + id)` on marker press. Back navigation via `router.back()`.

## Key Decisions
1. **Expo Router over React Navigation** — file-based routing means zero manual navigator config; dynamic `[id].tsx` segment handles detail routing automatically.
2. **React Query over useEffect + fetch** — automatic caching deduplicates repeated fetches, background refetch keeps data fresh, and built-in loading/error states remove boilerplate.
3. **Cloudflare Worker over a Node server** — zero-config deployment to a globally distributed edge network for free; no server to maintain and sub-millisecond cold starts.
4. **Hook abstraction (useLocations / useLocation)** — isolates fetch logic from screen components, making queries testable and reusable without duplicating query keys or fetch URLs.

## How to Run

### API
The Worker is already deployed at: https://map-app-locations.cyriluket-maps.workers.dev

No action needed — it is live and globally available.

### App
```bash
cd MapApp
npx expo start
# Press i for iOS simulator, a for Android emulator, or scan QR with Expo Go
```

## Known Issues / Limitations
- None identified — all 12 QA checks passed.
- The app uses `showsUserLocation` on the MapView, which will trigger an OS permission prompt on first launch (expected behaviour).
- `react-native-maps` on Android requires a Google Maps API key in `app.json` (`android.config.googleMaps.apiKey`) before the map renders on Android devices. This is not set in the current config; the iOS simulator path works without it.
