
import React from 'react';
import { Route } from '@/utils/types';
import { formatDuration } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Car, Clock, Train, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { tripOptionsData } from '@/utils/tripOptionsData';

interface RouteCardProps {
  route: Route;
  selected: boolean;
  onSelect: (routeId: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, selected, onSelect }) => {
  const handleSelect = () => {
    onSelect(route.id);
  };

  const getBadgeForRoute = () => {
    const routeId = parseInt(route.id);
    const routeOption = tripOptionsData.tripOptions[routeId - 1];
    
    if (routeOption.recommended) {
      return <Badge className="bg-blue-100 text-blue-800 ml-2">Recommended</Badge>;
    }
    
    if (routeOption.fastest) {
      return <Badge className="bg-green-100 text-green-800 ml-2">Fastest</Badge>;
    }
    
    if (routeOption.cheapest) {
      return <Badge className="bg-amber-100 text-amber-800 ml-2">Cheapest</Badge>;
    }
    
    return null;
  };
  
  // Get pros and cons from trip options data
  const tripOption = tripOptionsData.tripOptions.find(option => option.option.toString() === route.id);
  const pros = tripOption?.details.pros || [];
  const cons = tripOption?.details.cons || [];

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
        {route.segments[0] && (
          <div className="flex items-center">
            <Car className="h-4 w-4 text-blue-500 mr-1" /> 
            {route.segments[0].distance} km
          </div>
        )}
        <div>→</div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          {route.parkingLocation}
        </div>
        {route.segments[2] && (
          <>
            <div>→</div>
            <div className="flex items-center">
              <Train className="h-4 w-4 text-yellow-500 mr-1" />
              {route.segments[2]?.distance || 0} km
            </div>
          </>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {route.segments.map((segment, index) => (
          <div key={index} className={`text-xs px-2 py-1 ${
            segment.mode === 'car' ? 'bg-blue-50 text-blue-700' : 
            segment.mode === 'parking' ? 'bg-green-50 text-green-700' : 
            'bg-yellow-50 text-yellow-700'
          } rounded-full`}>
            {segment.mode === 'car' && `Drive to ${segment.to}`}
            {segment.mode === 'parking' && `Park for €${segment.cost.toFixed(2)}`}
            {segment.mode === 'train' && segment.details}
          </div>
        ))}
      </div>
      
      {selected && (
        <>
          <div className="mt-4 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-green-700">Pros</h4>
                <ul className="text-xs space-y-1">
                  {pros.slice(0, 2).map((pro, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mr-1 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-700">Cons</h4>
                <ul className="text-xs space-y-1">
                  {cons.slice(0, 2).map((con, idx) => (
                    <li key={idx} className="flex items-start">
                      <X className="h-3 w-3 text-red-600 mr-1 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Details
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RouteCard;
