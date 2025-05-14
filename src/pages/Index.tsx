
import React, { useState } from 'react';
import Header from '@/components/Header';
import RouteForm from '@/components/RouteForm';
import RouteCard from '@/components/RouteCard';
import RouteDetails from '@/components/RouteDetails';
import JourneyMap from '@/components/JourneyMap';
import { sampleRoutes } from '@/utils/routeData';
import { Route, RouteFilter } from '@/utils/types';

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>(sampleRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(sampleRoutes[0].id);
  const selectedRoute = routes.find(route => route.id === selectedRouteId) || routes[0];

  const handleFilterChange = (filter: RouteFilter) => {
    let sortedRoutes = [...sampleRoutes];
    
    switch (filter.sortBy) {
      case 'time':
        sortedRoutes.sort((a, b) => a.totalDuration - b.totalDuration);
        break;
      case 'cost':
        sortedRoutes.sort((a, b) => a.totalCost - b.totalCost);
        break;
      case 'sustainability':
        sortedRoutes.sort((a, b) => a.totalCO2 - b.totalCO2);
        break;
    }
    
    setRoutes(sortedRoutes);
    setSelectedRouteId(sortedRoutes[0].id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Multimodal Routes: Bunschoten to Den Haag</h2>
        
        <RouteForm onFilterChange={handleFilterChange} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Route Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose the best option for your journey
              </p>
            </div>
            
            {routes.map(route => (
              <RouteCard
                key={route.id}
                route={route}
                selected={route.id === selectedRouteId}
                onSelect={setSelectedRouteId}
              />
            ))}
          </div>
          
          <div className="space-y-6">
            <RouteDetails route={selectedRoute} />
            <JourneyMap route={selectedRoute} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
