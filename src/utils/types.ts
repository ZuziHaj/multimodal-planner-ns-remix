
export type TransportMode = 'car' | 'train' | 'parking' | 'walking';

export interface RouteSegment {
  mode: TransportMode;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  distance?: number; // in km
  cost: number; // in euros
  co2: number; // in kg
  details?: string;
}

export interface Route {
  id: string;
  segments: RouteSegment[];
  totalDuration: number; // in minutes
  totalCost: number; // in euros
  totalCO2: number; // in kg
  parkingLocation: string;
  parkingCost: number;
  departureTime: string;
  arrivalTime: string;
}

export interface RouteFilter {
  sortBy: 'fastest' | 'cheapest' | 'recommended';
  maxTransfers?: number;
  maxWalkingDistance?: number;
}
