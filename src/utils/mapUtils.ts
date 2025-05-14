
import mapboxgl from 'mapbox-gl';
import { Route } from '@/utils/types';

// Update the token to use the user's provided token
export const MAPBOX_TOKEN = 'pk.eyJ1IjoienV6aWhhajExIiwiYSI6ImNtYW5ybWx1MzAxb2UyanNmbGpydnFzemoifQ.5GQKavyrl0dCNItDS3nb4A';

export const getRouteCoordinates = (routeId: string): [number, number][] => {
  console.log(`Getting route coordinates for route ID: ${routeId}`);
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
  console.log(`Getting parking coordinates for route ID: ${routeId}`);
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
  console.log(`Getting train coordinates from parking location:`, parkingCoordinates);
  return [
    parkingCoordinates,
    [4.3246, 52.0799], // Den Haag
  ];
};

// Fetch realistic car route using Mapbox Directions API
export const fetchRealCarRoute = async (start: [number, number], end: [number, number]): Promise<GeoJSON.LineString | null> => {
  try {
    console.log('Fetching realistic car route from Mapbox Directions API');
    const startStr = `${start[0]},${start[1]}`;
    const endStr = `${end[0]},${end[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startStr};${endStr}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      console.log('Successfully retrieved car route geometry');
      return data.routes[0].geometry;
    } else {
      console.error('No routes found in Directions API response:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching car route:', error);
    return null;
  }
};

// Fetch realistic train route using Mapbox Directions API
export const fetchRealTrainRoute = async (start: [number, number], end: [number, number]): Promise<GeoJSON.LineString | null> => {
  try {
    console.log('Fetching realistic train route from Mapbox Directions API');
    const startStr = `${start[0]},${start[1]}`;
    const endStr = `${end[0]},${end[1]}`;
    // Using "driving-traffic" as a proxy for train routes, since Mapbox doesn't have a specific train profile
    // In a production app, you might want to use a specialized API for public transport
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${startStr};${endStr}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      console.log('Successfully retrieved train route geometry');
      return data.routes[0].geometry;
    } else {
      console.error('No routes found in Directions API response:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching train route:', error);
    return null;
  }
};

export const fitMapBounds = (
  map: mapboxgl.Map,
  startCoord: mapboxgl.LngLatLike,
  parkingCoord: mapboxgl.LngLatLike,
  endCoord: mapboxgl.LngLatLike
) => {
  try {
    console.log('Creating bounds with coordinates:', { startCoord, parkingCoord, endCoord });
    const bounds = new mapboxgl.LngLatBounds();
    
    bounds.extend(startCoord);
    bounds.extend(parkingCoord);
    bounds.extend(endCoord);
    
    console.log('Map bounds created, applying fit');

    map.fitBounds(bounds, {
      padding: 60,
      duration: 1000
    });
    console.log('Map bounds applied successfully');
  } catch (error) {
    console.error('Error fitting map bounds:', error);
  }
};
