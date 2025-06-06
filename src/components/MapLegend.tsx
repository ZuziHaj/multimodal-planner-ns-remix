
import React from 'react';
import { RouteSegment } from '@/utils/types';

interface MapLegendProps {
  segments: RouteSegment[];
  parkingLocation: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ segments, parkingLocation }) => {
  // Check if segments array exists and has the required elements
  const hasCarSegment = segments && segments.length > 0 && segments[0]?.mode === 'car';
  const hasTrainSegment = segments && segments.length > 2 && segments[2]?.mode === 'train';

  return (
    <div className="mt-2 flex gap-3 text-xs flex-wrap">
      {hasCarSegment && (
        <div className="flex items-center">
          <div className="w-3 h-1 bg-blue-500 rounded mr-1"></div>
          <span>Car ({segments[0].from} → {segments[0].to})</span>
        </div>
      )}
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
        <span>Parking at {parkingLocation}</span>
      </div>
      {hasTrainSegment && (
        <div className="flex items-center">
          <div className="w-3 h-1 bg-yellow-500 mr-1"></div>
          <span className="whitespace-nowrap">Train ({segments[2].from} → {segments[2].to})</span>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
