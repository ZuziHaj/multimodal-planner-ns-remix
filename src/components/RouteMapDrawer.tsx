
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
    if (!map) {
      console.error('Map instance not available');
      return;
    }
    
    try {
      console.log('Drawing route:', route.id);
      
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
      
      console.log('Route coordinates:', {
        carCoordinates,
        parkingCoordinates,
        trainCoordinates
      });

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
      const startCoord = carCoordinates[0] as mapboxgl.LngLatLike;
      const parkingCoord = parkingCoordinates as mapboxgl.LngLatLike;
      const endCoord = trainCoordinates[trainCoordinates.length - 1] as mapboxgl.LngLatLike;
      
      console.log('Fitting map bounds with coordinates', { startCoord, parkingCoord, endCoord });
      
      fitMapBounds(map, startCoord, parkingCoord, endCoord);
      
      drawCompleted.current = true;
      console.log('Route drawing completed successfully');
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  useEffect(() => {
    if (!map) {
      console.log('Map not available for drawing');
      return;
    }
    
    if (!route) {
      console.error('Route data not available');
      return;
    }

    if (map.loaded()) {
      console.log('Map already loaded, drawing route immediately');
      drawRoute();
    } else {
      console.log('Map not yet loaded, waiting for idle event');
      map.once('idle', drawRoute);
    }
    
    return () => {
      drawCompleted.current = false;
    };
  }, [route.id, map]);

  return null;
};

export default RouteMapDrawer;
