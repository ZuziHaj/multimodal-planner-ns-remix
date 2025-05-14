
import mapboxgl from 'mapbox-gl';
import { Route } from '@/utils/types';

// This would be stored in environment variables in a real app
export const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRlbW8iLCJhIjoiY2xzdnJ1b2liMGk1bjJrbzYwbGNnaWg3MCJ9.MjA9mPB0tZQ0zE-GPyPlzg';

export const getRouteCoordinates = (routeId: string): [number, number][] => {
  switch (routeId) {
    case '1':
      return [[5.3833, 52.2333], [5.3872, 52.1561]]; // Bunschoten to Amersfoort
    case '2':
      return [[5.3833, 52.2333], [5.1222, 52.0900]]; // Bunschoten to Utrecht
    default:
      return [[5.3833, 52.2333], [5.1714, 52.2333]]; // Bunschoten to Hilversum
  }
};

export const getParkingCoordinates = (routeId: string): [number, number] => {
  switch (routeId) {
    case '1':
      return [5.3872, 52.1561]; // Amersfoort
    case '2':
      return [5.1222, 52.0900]; // Utrecht
    default:
      return [5.1714, 52.2333]; // Hilversum
  }
};

export const getTrainCoordinates = (parkingCoordinates: [number, number]): [number, number][] => {
  return [
    parkingCoordinates,
    [4.3246, 52.0799], // Den Haag
  ];
};

export const fitMapBounds = (
  map: mapboxgl.Map,
  startCoord: mapboxgl.LngLatLike,
  parkingCoord: mapboxgl.LngLatLike,
  endCoord: mapboxgl.LngLatLike
) => {
  const bounds = new mapboxgl.LngLatBounds();
  
  bounds.extend(startCoord);
  bounds.extend(parkingCoord);
  bounds.extend(endCoord);

  map.fitBounds(bounds, {
    padding: 60,
    duration: 1000
  });
};
