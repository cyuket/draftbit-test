// Shared shape for a location returned by the Cloudflare Worker API.
// Used across hooks, screens, and components to enforce consistent typing.
export interface Location {
  id: string;
  name: string;
  description: string;
  category: string; // e.g. "museum" | "park" | "restaurant"
  lat: number;
  lng: number;
  imageUrl: string;
  address: string;
}
