
import React, { useEffect, useRef, useState } from 'react';
import { Route } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface JourneyMapProps {
  route: Route;
}

// This would be stored in environment variables in a real app
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRlbW8iLCJhIjoiY2xzdnJ1b2liMGk1bjJrbzYwbGNnaWg3MCJ9.MjA9mPB0tZQ0zE-GPyPlzg';

const JourneyMap: React.FC<JourneyMapProps> = ({ route }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string>(MAPBOX_TOKEN);

  // Function to visualize route on map
  const drawRoute = () => {
    if (!map.current) return;
    
    // Clear existing layers and sources
    if (map.current.getSource('car-route')) {
      map.current.removeLayer('car-route-layer');
      map.current.removeSource('car-route');
    }
    if (map.current.getSource('train-route')) {
      map.current.removeLayer('train-route-layer');
      map.current.removeSource('train-route');
    }
    if (map.current.getSource('parking')) {
      map.current.removeLayer('parking-layer');
      map.current.removeSource('parking');
    }

    // Add the car route (simplified for demo - would use actual coordinates in real app)
    map.current.addSource('car-route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': route.id === '1' 
            ? [[5.3833, 52.2333], [5.3872, 52.1561]] // Bunschoten to Amersfoort
            : route.id === '2'
              ? [[5.3833, 52.2333], [5.1222, 52.0900]] // Bunschoten to Utrecht
              : [[5.3833, 52.2333], [5.1714, 52.2333]] // Bunschoten to Hilversum
        }
      }
    });

    map.current.addLayer({
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
    const parkingCoordinates = route.id === '1'
      ? [5.3872, 52.1561] // Amersfoort
      : route.id === '2'
        ? [5.1222, 52.0900] // Utrecht
        : [5.1714, 52.2333]; // Hilversum

    map.current.addSource('parking', {
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

    map.current.addLayer({
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
    map.current.addSource('train-route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            parkingCoordinates,
            [4.3246, 52.0799], // Den Haag
          ]
        }
      }
    });

    map.current.addLayer({
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
    const bounds = new mapboxgl.LngLatBounds();
    
    // Convert coordinates to the correct type for mapboxgl.LngLatBounds.extend()
    const startCoord: mapboxgl.LngLatLike = [5.3833, 52.2333]; // Bunschoten
    const parkingCoord: mapboxgl.LngLatLike = parkingCoordinates as mapboxgl.LngLatLike; // Parking location
    const endCoord: mapboxgl.LngLatLike = [4.3246, 52.0799]; // Den Haag
    
    bounds.extend(startCoord);
    bounds.extend(parkingCoord);
    bounds.extend(endCoord);

    map.current.fitBounds(bounds, {
      padding: 60,
      duration: 1000
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;
    
    mapboxgl.accessToken = apiKey;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [5.0, 52.1], // Center of Netherlands
        zoom: 8,
      });

      map.current.on('load', () => {
        drawRoute();
        setMapInitialized(true);
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [apiKey]);

  // Update route visualization when selected route changes
  useEffect(() => {
    if (mapInitialized && map.current) {
      map.current.once('idle', drawRoute);
    }
  }, [route.id, mapInitialized]);

  // API key input for users without a preset key
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Journey Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!MAPBOX_TOKEN && !apiKey ? (
          <div className="mb-4">
            <label className="text-sm font-medium">Enter Mapbox API Key:</label>
            <input 
              type="text" 
              value={apiKey}
              onChange={handleApiKeyChange}
              className="w-full p-2 mt-1 border rounded"
              placeholder="Enter your Mapbox public token"
            />
          </div>
        ) : null}

        <div className="aspect-video bg-muted rounded-md overflow-hidden">
          <div ref={mapContainer} className="h-full w-full" />
        </div>
        
        <div className="mt-2 flex gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-1 bg-blue-500 rounded mr-1"></div>
            <span>Car ({route.segments[0].from} → {route.segments[0].to})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Parking at {route.parkingLocation}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-1 bg-yellow-500 mr-1"></div>
            <span className="whitespace-nowrap">Train ({route.segments[2].from} → {route.segments[2].to})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyMap;
