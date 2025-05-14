
import { Route } from './types';

export const sampleRoutes: Route[] = [
  {
    id: '1',
    segments: [
      {
        mode: 'car',
        from: 'Bunschoten',
        to: 'Amersfoort Centraal',
        departureTime: '08:00',
        arrivalTime: '08:20',
        duration: 20,
        distance: 15,
        cost: 3.50,
        co2: 2.7,
        details: 'Via A1'
      },
      {
        mode: 'parking',
        from: 'Amersfoort Centraal Parking',
        to: 'Amersfoort Centraal Station',
        departureTime: '08:20',
        arrivalTime: '08:25',
        duration: 5,
        distance: 0.2,
        cost: 8.00,
        co2: 0,
        details: 'P+R daily rate: €8.00'
      },
      {
        mode: 'train',
        from: 'Amersfoort Centraal',
        to: 'Den Haag Centraal',
        departureTime: '08:35',
        arrivalTime: '09:30',
        duration: 55,
        distance: 78,
        cost: 17.50,
        co2: 1.2,
        details: 'Intercity, 0 transfers'
      }
    ],
    totalDuration: 90,
    totalCost: 29.00,
    totalCO2: 3.9,
    parkingLocation: 'Amersfoort Centraal P+R',
    parkingCost: 8.00,
    departureTime: '08:00',
    arrivalTime: '09:30'
  },
  {
    id: '2',
    segments: [
      {
        mode: 'car',
        from: 'Bunschoten',
        to: 'Utrecht Centraal',
        departureTime: '08:00',
        arrivalTime: '08:30',
        duration: 30,
        distance: 25,
        cost: 5.00,
        co2: 4.5,
        details: 'Via A28'
      },
      {
        mode: 'parking',
        from: 'Utrecht Centraal Parking',
        to: 'Utrecht Centraal Station',
        departureTime: '08:30',
        arrivalTime: '08:40',
        duration: 10,
        distance: 0.4,
        cost: 10.00,
        co2: 0,
        details: 'P+R daily rate: €10.00'
      },
      {
        mode: 'train',
        from: 'Utrecht Centraal',
        to: 'Den Haag Centraal',
        departureTime: '08:45',
        arrivalTime: '09:25',
        duration: 40,
        distance: 60,
        cost: 14.80,
        co2: 0.9,
        details: 'Intercity Direct, 0 transfers'
      }
    ],
    totalDuration: 85,
    totalCost: 29.80,
    totalCO2: 5.4,
    parkingLocation: 'Utrecht Centraal P+R',
    parkingCost: 10.00,
    departureTime: '08:00',
    arrivalTime: '09:25'
  },
  {
    id: '3',
    segments: [
      {
        mode: 'car',
        from: 'Bunschoten',
        to: 'Hilversum',
        departureTime: '08:00',
        arrivalTime: '08:25',
        duration: 25,
        distance: 20,
        cost: 4.00,
        co2: 3.6,
        details: 'Via A27'
      },
      {
        mode: 'parking',
        from: 'Hilversum Parking',
        to: 'Hilversum Station',
        departureTime: '08:25',
        arrivalTime: '08:30',
        duration: 5,
        distance: 0.2,
        cost: 6.50,
        co2: 0,
        details: 'P+R daily rate: €6.50'
      },
      {
        mode: 'train',
        from: 'Hilversum',
        to: 'Den Haag Centraal',
        departureTime: '08:40',
        arrivalTime: '09:40',
        duration: 60,
        distance: 65,
        cost: 15.20,
        co2: 1.0,
        details: 'Intercity, 1 transfer at Leiden Centraal'
      }
    ],
    totalDuration: 100,
    totalCost: 25.70,
    totalCO2: 4.6,
    parkingLocation: 'Hilversum P+R',
    parkingCost: 6.50,
    departureTime: '08:00',
    arrivalTime: '09:40'
  }
];
