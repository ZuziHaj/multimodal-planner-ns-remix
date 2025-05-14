
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/utils/types';
import { getRouteCoordinates, getParkingCoordinates, getTrainCoordinates, fitMapBounds, fetchRealCarRoute, fetchRealTrainRoute } from '@/utils/mapUtils';

interface RouteMapDrawerProps {
  map: mapboxgl.Map | null;
  route: Route;
}

const RouteMapDrawer: React.FC<RouteMapDrawerProps> = ({ map, route }) => {
  const drawCompleted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const drawRoute = async () => {
    if (!map) {
      console.error('Map instance not available');
      return;
    }
    
    try {
      console.log('Drawing route:', route.id);
      setIsLoading(true);
      
      // Clear existing layers and sources
      ['car-route', 'train-route', 'parking'].forEach(source => {
        if (map.getSource(source)) {
          const layers = [`${source}-layer`];
          if (source === 'parking') {
            layers.push('parking-marker');
          }
          
          layers.forEach(layer => {
            if (map.getLayer(layer)) {
              map.removeLayer(layer);
            }
          });
          
          map.removeSource(source);
        }
      });

      // Get coordinates
      const carStartEnd = getRouteCoordinates(route.id);
      const parkingCoordinates = getParkingCoordinates(route.id);
      const trainStartEnd = getTrainCoordinates(parkingCoordinates);
      
      console.log('Route coordinates:', {
        carStartEnd,
        parkingCoordinates,
        trainStartEnd
      });

      // Fetch realistic routes
      const carRouteGeometry = await fetchRealCarRoute(carStartEnd[0], carStartEnd[1]);
      const trainRouteGeometry = await fetchRealTrainRoute(trainStartEnd[0], trainStartEnd[1]);
      
      // Add the car route (realistic or fallback to straight line)
      map.addSource('car-route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': carRouteGeometry || {
            'type': 'LineString',
            'coordinates': carStartEnd
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

      // Add parking marker icon with P symbol
      map.addLayer({
        'id': 'parking-marker',
        'type': 'symbol',
        'source': 'parking',
        'layout': {
          'text-field': 'P',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        'paint': {
          'text-color': '#ffffff'
        }
      });

      // Add the train route (realistic or fallback to straight line)
      map.addSource('train-route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': trainRouteGeometry || {
            'type': 'LineString',
            'coordinates': trainStartEnd
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
      const startCoord = carStartEnd[0] as mapboxgl.LngLatLike;
      const parkingCoord = parkingCoordinates as mapboxgl.LngLatLike;
      const endCoord = trainStartEnd[trainStartEnd.length - 1] as mapboxgl.LngLatLike;
      
      console.log('Fitting map bounds with coordinates', { startCoord, parkingCoord, endCoord });
      
      fitMapBounds(map, startCoord, parkingCoord, endCoord);
      
      drawCompleted.current = true;
      console.log('Route drawing completed successfully');
    } catch (error) {
      console.error('Error drawing route:', error);
    } finally {
      setIsLoading(false);
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

  return isLoading ? (
    <div className="absolute top-0 right-0 bg-white/80 px-2 py-1 text-xs m-1 rounded">
      Loading routes...
    </div>
  ) : null;
};

export default RouteMapDrawer;
