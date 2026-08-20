export interface TouristPlace {
  id: string;
  name: string;
  category: "attraction" | "camp" | "trailhead" | "viewpoint" | "medical";
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  description: string;
  openingHours?: string;
  address?: string;
  imageUrl?: string;
  altitude?: string;
}
