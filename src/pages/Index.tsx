
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RouteForm from '@/components/RouteForm';
import RouteCard from '@/components/RouteCard';
import RouteDetails from '@/components/RouteDetails';
import JourneyMap from '@/components/JourneyMap';
import { Route, RouteFilter } from '@/utils/types';
import { tripOptionsData } from '@/utils/tripOptionsData';
import { convertTripOptionsToRoutes } from '@/utils/routeConverter';

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  
  // Initialize routes from the trip options data
  useEffect(() => {
    const convertedRoutes = convertTripOptionsToRoutes(tripOptionsData);
    setRoutes(convertedRoutes);
    
    // Set initial selected route to the first one
    if (convertedRoutes.length > 0) {
      setSelectedRouteId(convertedRoutes[0].id);
      setSelectedRoute(convertedRoutes[0]);
    }
  }, []);
  
  // Update selected route when selectedRouteId changes
  useEffect(() => {
    if (selectedRouteId && routes.length > 0) {
      const route = routes.find(route => route.id === selectedRouteId);
      if (route) {
        setSelectedRoute(route);
      }
    }
  }, [selectedRouteId, routes]);

  const handleFilterChange = (filter: RouteFilter) => {
    let sortedRoutes = [...routes];
    
    switch (filter.sortBy) {
      case 'fastest':
        sortedRoutes.sort((a, b) => a.totalDuration - b.totalDuration);
        break;
      case 'cheapest':
        sortedRoutes.sort((a, b) => a.totalCost - b.totalCost);
        break;
      case 'recommended':
        // Put the recommended route at the top, keep others in original order
        const recommendedRouteIndex = sortedRoutes.findIndex(route => {
          const routeOption = tripOptionsData.tripOptions.find(option => option.option.toString() === route.id);
          return routeOption?.recommended === true;
        });
        
        if (recommendedRouteIndex !== -1) {
          const recommendedRoute = sortedRoutes.splice(recommendedRouteIndex, 1)[0];
          sortedRoutes = [recommendedRoute, ...sortedRoutes];
        }
        break;
    }
    
    setRoutes(sortedRoutes);
    
    if (sortedRoutes.length > 0) {
      setSelectedRouteId(sortedRoutes[0].id);
    }
  };

  // If data is still loading
  if (routes.length === 0 || !selectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-6 text-ns-blue">Loading route options...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-ns-blue">Multimodal Routes: Emmeloord to Den Haag</h2>
        
        <RouteForm onFilterChange={handleFilterChange} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-ns-blue">Route Options</h3>
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
            
            {/* The map will be visible here on large screens */}
            <div className="hidden lg:block">
              <JourneyMap route={selectedRoute} />
            </div>
          </div>
        </div>
        
        {/* This map is only visible on small screens */}
        <div className="lg:hidden mb-6">
          <JourneyMap route={selectedRoute} />
        </div>
      </div>
    </div>
  );
};

export default Index;
