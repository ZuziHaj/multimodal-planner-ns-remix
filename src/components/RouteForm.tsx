
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RouteFilter } from '@/utils/types';
import { Calendar, Clock, Map } from 'lucide-react';

interface RouteFormProps {
  onFilterChange: (filter: RouteFilter) => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ onFilterChange }) => {
  const [origin] = useState('Emmeloord');
  const [destination] = useState('Den Haag');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [time] = useState('08:00');
  const [sortBy, setSortBy] = useState<'fastest' | 'cheapest' | 'recommended'>('recommended');

  const handleSortChange = (value: string) => {
    const newSortBy = value as 'fastest' | 'cheapest' | 'recommended';
    setSortBy(newSortBy);
    onFilterChange({ sortBy: newSortBy });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex items-center space-x-2">
            <Map className="h-4 w-4 text-muted-foreground" />
            <Input value={origin} readOnly className="bg-secondary" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex items-center space-x-2">
            <Map className="h-4 w-4 text-muted-foreground" />
            <Input value={destination} readOnly className="bg-secondary" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={date} readOnly className="bg-secondary" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input type="time" value={time} readOnly className="bg-secondary" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="fastest">Fastest</SelectItem>
              <SelectItem value="cheapest">Cheapest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Update Routes
        </Button>
      </div>
    </div>
  );
};

export default RouteForm;
