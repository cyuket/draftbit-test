import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../constants/api';
import { Location } from '../types/location';

// Fetches all locations from the Worker; throws on non-2xx so React Query surfaces it as an error.
async function fetchLocations(): Promise<Location[]> {
  const res = await fetch(`${BASE_URL}/locations`);
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
  return res.json();
}

// Fetches a single location by id; throws on non-2xx (including 404 for unknown ids).
async function fetchLocation(id: string): Promise<Location> {
  const res = await fetch(`${BASE_URL}/locations/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch location ${id}: ${res.status}`);
  return res.json();
}

// Hook for the full location list — results are cached under the ['locations'] key,
// so repeated calls (e.g. navigating back to the map) never trigger a redundant request.
export function useLocations() {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });
}

// Hook for a single location detail; skips the fetch when id is empty/undefined
// (enabled: !!id) to avoid a spurious request before the route param is available.
export function useLocation(id: string) {
  return useQuery<Location, Error>({
    queryKey: ['location', id],
    queryFn: () => fetchLocation(id),
    enabled: !!id,
  });
}
