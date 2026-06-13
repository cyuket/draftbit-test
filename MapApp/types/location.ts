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
