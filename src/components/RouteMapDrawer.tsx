
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/utils/types';
import { getRouteCoordinates, getParkingCoordinates, getTrainCoordinates, fitMapBounds } from '@/utils/mapUtils';

interface RouteMapDrawerProps {
  map: mapboxgl.Map | null;
  route: Route;
}

const RouteMapDrawer: React.FC<RouteMapDrawerProps> = ({ map, route }) => {
  const drawCompleted = useRef(false);

  const drawRoute = () => {
    if (!map) return;
    
    // Clear existing layers and sources
    if (map.getSource('car-route')) {
      map.removeLayer('car-route-layer');
      map.removeSource('car-route');
    }
    if (map.getSource('train-route')) {
      map.removeLayer('train-route-layer');
      map.removeSource('train-route');
    }
    if (map.getSource('parking')) {
      map.removeLayer('parking-layer');
      map.removeSource('parking');
    }

    // Get coordinates
    const carCoordinates = getRouteCoordinates(route.id);
    const parkingCoordinates = getParkingCoordinates(route.id);
    const trainCoordinates = getTrainCoordinates(parkingCoordinates);

    // Add the car route
    map.addSource('car-route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': carCoordinates
        }
      }
    });

    map.addLayer({
      'id': 'car-route-layer',
      'type': 'line',
      'source': 'car-route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#3b82f6', // blue
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Add the parking location
    map.addSource('parking', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {
          'description': route.parkingLocation
        },
        'geometry': {
          'type': 'Point',
          'coordinates': parkingCoordinates
        }
      }
    });

    map.addLayer({
      'id': 'parking-layer',
      'type': 'circle',
      'source': 'parking',
      'paint': {
        'circle-radius': 8,
        'circle-color': '#10b981', // green
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add the train route
    map.addSource('train-route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': trainCoordinates
        }
      }
    });

    map.addLayer({
      'id': 'train-route-layer',
      'type': 'line',
      'source': 'train-route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#eab308', // yellow
        'line-width': 4,
        'line-opacity': 0.8,
        'line-dasharray': [2, 1] // dashed line for train
      }
    });

    // Fit bounds to show the entire route
    const startCoord: mapboxgl.LngLatLike = [5.3833, 52.2333]; // Bunschoten
    const parkingCoord: mapboxgl.LngLatLike = parkingCoordinates as mapboxgl.LngLatLike; // Parking location
    const endCoord: mapboxgl.LngLatLike = [4.3246, 52.0799]; // Den Haag
    
    fitMapBounds(map, startCoord, parkingCoord, endCoord);
    
    drawCompleted.current = true;
  };

  useEffect(() => {
    if (map && map.loaded()) {
      drawRoute();
    } else if (map) {
      map.once('idle', drawRoute);
    }
    
    return () => {
      drawCompleted.current = false;
    };
  }, [route.id, map]);

  return null;
};

export default RouteMapDrawer;
