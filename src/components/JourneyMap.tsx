
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
  }, [apiKey, mapInitialized]);

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
        
        <MapLegend segments={route.segments} parkingLocation={route.parkingLocation} />
        
        {mapInitialized && <RouteMapDrawer map={map.current} route={route} />}
      </CardContent>
    </Card>
  );
};

export default JourneyMap;
