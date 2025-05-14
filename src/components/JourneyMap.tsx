
import React from 'react';
import { Route } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

interface JourneyMapProps {
  route: Route;
}

const JourneyMap: React.FC<JourneyMapProps> = ({ route }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Journey Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="mb-2">Interactive map would be displayed here</div>
            <div className="text-sm">
              {route.segments[0].from} → {route.segments[0].to} → {route.segments[2].to}
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>In a production app, this would show an interactive map of your journey using Mapbox or Google Maps API, highlighting:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Driving route from {route.segments[0].from} to {route.segments[0].to}</li>
            <li>Parking location at {route.parkingLocation}</li>
            <li>Train route from {route.segments[2].from} to {route.segments[2].to}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyMap;
