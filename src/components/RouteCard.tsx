
import React from 'react';
import { Route } from '@/utils/types';
import { formatDuration } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Car, Clock, Train } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RouteCardProps {
  route: Route;
  selected: boolean;
  onSelect: (routeId: string) => void;
}

// This function would be in a separate formatters.ts file in a real app
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const RouteCard: React.FC<RouteCardProps> = ({ route, selected, onSelect }) => {
  const handleSelect = () => {
    onSelect(route.id);
  };

  const getBadgeForRoute = () => {
    const routes = [
      { id: '1', badge: 'Most popular', color: 'bg-blue-100 text-blue-800' },
      { id: '2', badge: 'Fastest', color: 'bg-green-100 text-green-800' },
      { id: '3', badge: 'Eco-friendly', color: 'bg-amber-100 text-amber-800' },
    ];
    
    const match = routes.find(r => r.id === route.id);
    return match ? (
      <Badge className={`${match.color} ml-2`}>{match.badge}</Badge>
    ) : null;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
      }`}
      onClick={handleSelect}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="text-lg font-medium">
            {route.departureTime} - {route.arrivalTime}
            {getBadgeForRoute()}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(route.totalDuration)}
          </div>
          <div className="text-sm font-medium">€{route.totalCost.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-sm mb-4">
        <div className="flex items-center">
          <Car className="h-4 w-4 text-blue-500 mr-1" /> 
          {route.segments[0].distance} km
        </div>
        <div>→</div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          {route.parkingLocation}
        </div>
        <div>→</div>
        <div className="flex items-center">
          <Train className="h-4 w-4 text-yellow-500 mr-1" />
          {route.segments[2].distance} km
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
          Drive to {route.segments[0].to}
        </div>
        <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
          Park for €{route.parkingCost.toFixed(2)}
        </div>
        <div className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
          {route.segments[2].details}
        </div>
      </div>
      
      {selected && (
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            View Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default RouteCard;
