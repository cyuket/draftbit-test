import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../constants/api';
import { Location } from '../types/location';

async function fetchLocations(): Promise<Location[]> {
  const res = await fetch(`${BASE_URL}/locations`);
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
  return res.json();
}

async function fetchLocation(id: string): Promise<Location> {
  const res = await fetch(`${BASE_URL}/locations/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch location ${id}: ${res.status}`);
  return res.json();
}

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
