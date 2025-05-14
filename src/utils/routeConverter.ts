
import { Route, RouteSegment } from './types';

interface TripOption {
  option: number;
  title: string;
  recommended: boolean;
  cheapest: boolean;
  fastest: boolean;
  details: {
    travelTime: any;
    distance: any;
    costs: {
      fuel: { amount: number; currency: string; details: string };
      parking?: { amount: number; currency: string; details: string };
      trainTicket?: { amount: number; currency: string; details: string };
      parkAndRide?: { amount: number; currency: string; details: string };
      publicTransport?: { amount: number; currency: string; details: string };
      total: { amount: number; currency: string };
    };
    pros: string[];
    cons: string[];
    additionalInfo: string;
  };
}

interface TripOptionsData {
  tripOptions: TripOption[];
  summary: {
    recommendedOption: string;
    reasonForRecommendation: string;
    cheapestOption: string;
    fastestOption: string;
  };
}

// Extract duration in minutes from string like "1 hour 30 minutes" or "40 minutes"
const extractDurationMinutes = (durationString: string): number => {
  let totalMinutes = 0;
  
  // Extract hours if present
  const hoursMatch = durationString.match(/(\d+)\s*hour/);
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }
  
  // Extract minutes if present
  const minutesMatch = durationString.match(/(\d+)\s*minute/);
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }
  
  return totalMinutes;
};

// Extract distance in km from string like "140 km"
const extractDistance = (distanceString: string): number => {
  const match = distanceString.match(/(\d+)\s*km/);
  return match ? parseInt(match[1]) : 0;
};

export const convertTripOptionsToRoutes = (data: TripOptionsData): Route[] => {
  return data.tripOptions.map((option: TripOption, index: number) => {
    const id = option.option.toString();
    const title = option.title;
    
    // Calculate total duration based on the option type
    let totalDuration = 0;
    if (option.option === 1) { // Direct driving
      totalDuration = extractDurationMinutes(option.details.travelTime.oneway);
    } else if (option.option === 2) { // Train option
      totalDuration = 
        extractDurationMinutes(option.details.travelTime.drivingToStation) + 
        extractDurationMinutes(option.details.travelTime.trainJourney);
    } else { // P+R option
      totalDuration = 
        extractDurationMinutes(option.details.travelTime.drivingToParkAndRide) + 
        extractDurationMinutes(option.details.travelTime.publicTransport);
    }
    
    const totalCost = option.details.costs.total.amount;
    const co2Estimate = calculateCO2(option);
    
    // Create segments based on option type
    const segments: RouteSegment[] = createSegmentsForOption(option);
    
    // Calculate departure and arrival times (arbitrary, for display purposes)
    const departureTime = "08:00";
    const arrivalTime = calculateArrivalTime(departureTime, totalDuration);
    
    return {
      id,
      segments,
      totalDuration,
      totalCost,
      totalCO2: co2Estimate,
      parkingLocation: getParkingLocation(option),
      parkingCost: getParkingCost(option),
      departureTime,
      arrivalTime
    };
  });
};

const calculateCO2 = (option: TripOption): number => {
  // Simple CO2 calculation based on distance and transport mode
  // Car emissions: ~170g CO2 per km
  // Train emissions: ~30g CO2 per km
  // These are rough estimates
  
  let co2 = 0;
  
  switch (option.option) {
    case 1: // Direct driving
      const drivingDistance = extractDistance(option.details.distance.total);
      co2 = drivingDistance * 0.17; // 170g per km = 0.17kg per km
      break;
    case 2: // Train option
      const carDistance = extractDistance(option.details.distance.total);
      co2 = carDistance * 0.17; // Car portion
      
      // Estimate train distance as ~140km each way
      const trainDistance = 280;
      co2 += trainDistance * 0.03; // Train portion
      break;
    case 3: // P+R option
      const driveDistance = extractDistance(option.details.distance.total);
      co2 = driveDistance * 0.17; // Car portion
      
      // Estimate public transport (probably tram/bus) ~10km
      co2 += 20 * 0.05; // Public transport (slightly higher than train)
      break;
  }
  
  return parseFloat(co2.toFixed(1));
};

const createSegmentsForOption = (option: TripOption): RouteSegment[] => {
  const segments: RouteSegment[] = [];
  
  switch (option.option) {
    case 1: // Direct driving to Den Haag
      segments.push(
        {
          mode: 'car',
          from: 'Emmeloord',
          to: 'Den Haag Centrum',
          departureTime: '08:00',
          arrivalTime: '09:30',
          duration: extractDurationMinutes(option.details.travelTime.oneway),
          distance: extractDistance(option.details.distance.oneway),
          cost: option.details.costs.fuel.amount,
          co2: extractDistance(option.details.distance.oneway) * 0.17,
          details: 'Via A6 and A4'
        },
        {
          mode: 'parking',
          from: 'Den Haag Centrum Parking',
          to: 'Den Haag Centrum',
          departureTime: '09:30',
          arrivalTime: '09:35',
          duration: 5,
          distance: 0.2,
          cost: option.details.costs.parking?.amount || 0,
          co2: 0,
          details: option.details.costs.parking?.details || 'City center parking'
        }
      );
      break;
    
    case 2: // Drive to train station
      segments.push(
        {
          mode: 'car',
          from: 'Emmeloord',
          to: 'Lelystad Centrum',
          departureTime: '08:00',
          arrivalTime: '08:40',
          duration: extractDurationMinutes(option.details.travelTime.drivingToStation),
          distance: extractDistance(option.details.distance.drivingToStation),
          cost: option.details.costs.fuel.amount,
          co2: extractDistance(option.details.distance.drivingToStation) * 0.17,
          details: 'Via N50 and A6'
        },
        {
          mode: 'parking',
          from: 'Lelystad Centrum Parking',
          to: 'Lelystad Centrum Station',
          departureTime: '08:40',
          arrivalTime: '08:45',
          duration: 5,
          distance: 0.2,
          cost: option.details.costs.parking?.amount || 0,
          co2: 0,
          details: option.details.costs.parking?.details || 'Station parking'
        },
        {
          mode: 'train',
          from: 'Lelystad Centrum',
          to: 'Den Haag Centraal',
          departureTime: '08:50',
          arrivalTime: '10:22',
          duration: extractDurationMinutes(option.details.travelTime.trainJourney),
          distance: 140, // Estimated
          cost: option.details.costs.trainTicket?.amount || 0,
          co2: 140 * 0.03, // Train CO2
          details: option.details.costs.trainTicket?.details || 'Intercity, 1 transfer'
        }
      );
      break;
    
    case 3: // Drive to P+R
      segments.push(
        {
          mode: 'car',
          from: 'Emmeloord',
          to: 'Den Haag P+R',
          departureTime: '08:00',
          arrivalTime: '09:15',
          duration: extractDurationMinutes(option.details.travelTime.drivingToParkAndRide),
          distance: extractDistance(option.details.distance.drivingToParkAndRide),
          cost: option.details.costs.fuel.amount,
          co2: extractDistance(option.details.distance.drivingToParkAndRide) * 0.17,
          details: 'Via A6 and A4'
        },
        {
          mode: 'parking',
          from: 'Den Haag P+R Parking',
          to: 'Den Haag P+R Stop',
          departureTime: '09:15',
          arrivalTime: '09:20',
          duration: 5,
          distance: 0.2,
          cost: option.details.costs.parkAndRide?.amount || 0,
          co2: 0,
          details: option.details.costs.parkAndRide?.details || 'P+R facility'
        },
        {
          mode: 'train', // Actually public transport but using train for UI
          from: 'Den Haag P+R',
          to: 'Den Haag Centrum',
          departureTime: '09:25',
          arrivalTime: '09:45',
          duration: 20, // From "20-30 minutes" range
          distance: 10, // Estimated
          cost: option.details.costs.publicTransport?.amount || 0,
          co2: 10 * 0.05,
          details: option.details.costs.publicTransport?.details || 'Tram or bus to city center'
        }
      );
      break;
  }
  
  return segments;
};

const getParkingLocation = (option: TripOption): string => {
  switch (option.option) {
    case 1: 
      return "Den Haag Centrum Parking";
    case 2: 
      return "Lelystad Centrum P+R";
    case 3:
      return "Den Haag P+R";
    default:
      return "Unknown";
  }
};

const getParkingCost = (option: TripOption): number => {
  if (option.details.costs.parking) {
    return option.details.costs.parking.amount;
  } else if (option.details.costs.parkAndRide) {
    return option.details.costs.parkAndRide.amount;
  }
  return 0;
};

const calculateArrivalTime = (departureTime: string, durationMinutes: number): string => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};
