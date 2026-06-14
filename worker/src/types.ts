// Shared shape for a map location — used by both the Worker responses and the React Native app
export interface Location {
  id: string;
  name: string;
  description: string;
  // Broad category used to style map pins and filter locations (e.g. "museum", "park")
  category: string;
  lat: number;
  lng: number;
  imageUrl: string;
  address: string;
}
