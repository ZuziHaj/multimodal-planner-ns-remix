import React, { useEffect, useRef, useState } from 'react';
import { Route } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/utils/mapUtils';
import MapLegend from './MapLegend';
import RouteMapDrawer from './RouteMapDrawer';

interface JourneyMapProps {
  route: Route;
}

const JourneyMap: React.FC<JourneyMapProps> = ({ route }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string>(MAPBOX_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) {
      console.log('Map container ref not available yet');
      return;
    }

    // Prevent multiple initializations
    if (map.current) {
      console.log('Map already initialized, skipping');
      return; 
    }
    
    console.log('Initializing map with token:', apiKey ? 'Token provided' : 'No token');
    
    if (!apiKey) {
      console.error('No Mapbox API key provided');
      setMapError('Missing Mapbox API key');
      return;
    }

    mapboxgl.accessToken = apiKey;
    
    try {
      // Calculate container dimensions to ensure visibility
      const containerWidth = mapContainer.current.clientWidth;
      const containerHeight = mapContainer.current.clientHeight;
      
      console.log(`Map container dimensions: ${containerWidth}x${containerHeight}px`);
      
      if (containerWidth === 0 || containerHeight === 0) {
        console.error('Map container has zero width or height');
        setMapError('Map container has invalid dimensions');
        return;
      }

      console.log('Creating new mapbox map instance');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // Use a more Google Maps-like style with detailed roads and features
        style: 'mapbox://styles/mapbox/streets-v12', 
        center: [5.0, 52.1], // Center of Netherlands
        zoom: 8,
        attributionControl: true,
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapInitialized(true);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Cleanup
      return () => {
        console.log('Cleaning up map');
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [apiKey]);

  // Validate route data
  useEffect(() => {
    if (!route) {
      console.error('Route data is undefined');
      return;
    }
    
    console.log('Route data received:', route.id);
  }, [route]);

  // API key input for users without a preset key
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    // Reset map to reinitialize with new token
    if (map.current) {
      map.current.remove();
      map.current = null;
      setMapInitialized(false);
    }
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

        <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden relative">
          <div ref={mapContainer} className="h-full w-full" />
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-sm text-destructive font-medium p-4 text-center">
                {mapError}
              </div>
            </div>
          )}
        </div>
        
        <MapLegend segments={route.segments} parkingLocation={route.parkingLocation} />
        
        {mapInitialized && map.current && <RouteMapDrawer map={map.current} route={route} />}
      </CardContent>
    </Card>
  );
};

export default JourneyMap;
