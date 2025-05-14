
import React from 'react';
import { Route } from '@/utils/types';
import { formatDuration } from '@/utils/formatters';
import { Car, Clock, MapPin, Train, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tripOptionsData } from '@/utils/tripOptionsData';

interface RouteDetailsProps {
  route: Route;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  // Get additional details from trip options data
  const tripOption = tripOptionsData.tripOptions.find(option => option.option.toString() === route.id);
  const additionalInfo = tripOption?.details.additionalInfo || '';

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle>Journey Details</CardTitle>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDuration(route.totalDuration)}
            </div>
            <div>
              <Badge className="bg-primary text-primary-foreground">
                €{route.totalCost.toFixed(2)}
              </Badge>
            </div>
            <div>
              <Badge className="bg-green-100 text-green-800 text-[10px] px-2.5 py-0.5 min-w-16 text-center">
                {route.totalCO2.toFixed(1)} kg CO₂
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {route.segments.map((segment, index) => (
          <div key={index} className="route-segment py-4">
            <div className={`route-dot ${segment.mode}`}></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div className="flex items-center">
                {segment.mode === 'car' && <Car className="h-5 w-5 text-blue-500 mr-2" />}
                {segment.mode === 'train' && <Train className="h-5 w-5 text-yellow-500 mr-2" />}
                {segment.mode === 'parking' && <MapPin className="h-5 w-5 text-green-500 mr-2" />}
                <span className="font-medium">{segment.mode === 'parking' ? 'Park at' : segment.mode === 'car' ? 'Drive to' : 'Train to'} {segment.to}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {segment.departureTime} - {segment.arrivalTime} ({formatDuration(segment.duration)})
              </div>
            </div>
            
            <div className="ml-7 text-sm">
              <div className="text-muted-foreground">{segment.from} → {segment.to}</div>
              {segment.distance && (
                <div className="mt-1 flex items-center gap-6">
                  <span>{segment.distance} km</span>
                  <span>€{segment.cost.toFixed(2)}</span>
                  <span>{segment.co2.toFixed(1)} kg CO₂</span>
                </div>
              )}
              {segment.details && (
                <div className="mt-1 text-xs bg-secondary p-2 rounded-md">
                  {segment.details}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Additional Information */}
        {additionalInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800 mb-1 flex items-center">
              <Info className="h-4 w-4 mr-1" /> Additional Information
            </h4>
            <p className="text-sm text-blue-700">{additionalInfo}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteDetails;
