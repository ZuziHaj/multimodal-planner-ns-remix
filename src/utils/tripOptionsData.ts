
export const tripOptionsData = {
  "tripOptions": [
    {
      "option": 1,
      "title": "Driving to Den Haag and park in the city",
      "recommended": false,
      "cheapest": false,
      "fastest": true,
      "details": {
        "travelTime": {
          "oneway": "1 hour 30 minutes",
          "total": "3 hours"
        },
        "distance": {
          "oneway": "140 km",
          "total": "280 km"
        },
        "costs": {
          "fuel": {
            "amount": 42.00,
            "currency": "EUR",
            "details": "Based on average Ford C-MAX 2017 fuel consumption of 6.6 L/100km and current fuel price of €2.25/L"
          },
          "parking": {
            "amount": 35.00,
            "currency": "EUR",
            "details": "Average parking cost in Den Haag city center is €4.50 per hour. For a day trip (approximately 8 hours): €35.00"
          },
          "total": {
            "amount": 77.00,
            "currency": "EUR"
          }
        },
        "pros": [
          "Most flexible option for moving around Den Haag",
          "No need to coordinate with public transport schedules",
          "Fastest door-to-door travel option",
          "Convenient for carrying purchases or luggage"
        ],
        "cons": [
          "Most expensive option when considering both fuel and parking costs",
          "Potential traffic congestion in Den Haag city center",
          "Stress of finding parking in an unfamiliar city",
          "Environmental impact of driving the full distance"
        ],
        "additionalInfo": "Parking in Den Haag city center is expensive (up to €4.85/hour). Consider parking garages which might offer day rates around €20-35. Some streets in the Old Centrum have parking fees of €50 per day."
      }
    },
    {
      "option": 2,
      "title": "Drive to the nearest train station and take the train",
      "recommended": true,
      "cheapest": false,
      "fastest": false,
      "details": {
        "travelTime": {
          "drivingToStation": "40 minutes to Lelystad Centrum",
          "trainJourney": "1 hour 32 minutes (fastest train option)",
          "total": "4 hours 24 minutes (round trip)"
        },
        "distance": {
          "drivingToStation": "45 km (one way to Lelystad Centrum)",
          "total": "90 km driving"
        },
        "costs": {
          "fuel": {
            "amount": 13.50,
            "currency": "EUR",
            "details": "Based on 90 km round trip, 6.6 L/100km consumption, and €2.25/L fuel price"
          },
          "parking": {
            "amount": 15.00,
            "currency": "EUR",
            "details": "All-day parking at Lelystad station"
          },
          "trainTicket": {
            "amount": 44.80,
            "currency": "EUR",
            "details": "Return train ticket Lelystad Centrum - Den Haag Centraal (€22.40 each way, 2nd class)"
          },
          "total": {
            "amount": 73.30,
            "currency": "EUR"
          }
        },
        "pros": [
          "Balanced option between cost and convenience",
          "No parking stress in Den Haag city center",
          "Environmentally friendlier than driving the entire way",
          "Can relax or work during the train journey",
          "Train arrives directly in Den Haag city center"
        ],
        "cons": [
          "Less flexible than driving all the way",
          "Need to adhere to train schedules",
          "Total journey time is longer than driving directly"
        ],
        "additionalInfo": "NS trains from Lelystad to Den Haag run regularly throughout the day. The journey involves 1-2 transfers depending on the time of day. Weekend tickets may be cheaper."
      }
    },
    {
      "option": 3,
      "title": "Drive to a location near Den Haag and use public transport",
      "recommended": false,
      "cheapest": true,
      "fastest": false,
      "details": {
        "travelTime": {
          "drivingToParkAndRide": "1 hour 15 minutes",
          "publicTransport": "20-30 minutes",
          "total": "3 hours 30 minutes (round trip)"
        },
        "distance": {
          "drivingToParkAndRide": "120 km (one way to P+R facility)",
          "total": "240 km driving"
        },
        "costs": {
          "fuel": {
            "amount": 36.00,
            "currency": "EUR",
            "details": "Based on 240 km round trip, 6.6 L/100km consumption, and €2.25/L fuel price"
          },
          "parkAndRide": {
            "amount": 10.00,
            "currency": "EUR",
            "details": "P+R parking fee for the day"
          },
          "publicTransport": {
            "amount": 10.00,
            "currency": "EUR",
            "details": "Public transport tickets to/from city center (€5 per person round trip)"
          },
          "total": {
            "amount": 56.00,
            "currency": "EUR"
          }
        },
        "pros": [
          "Most economical option",
          "Avoids city center parking costs and stress",
          "More flexible than taking the train from Lelystad",
          "Environmental compromise"
        ],
        "cons": [
          "Requires coordination with public transport from P+R",
          "Longer total travel time than direct driving",
          "Less convenient for carrying purchases or luggage"
        ],
        "additionalInfo": "Several P+R facilities are available around Den Haag. Most offer combined parking and public transport tickets. Check opening hours as some P+R facilities may close in the evening."
      }
    }
  ],
  "summary": {
    "recommendedOption": "Option 2: Drive to Lelystad Centrum and take the train to Den Haag",
    "reasonForRecommendation": "This option offers the best balance between cost, convenience, and stress-free travel. While not the cheapest or fastest option, it eliminates the hassle of city parking while still being reasonably priced. The train arrives directly in Den Haag city center, allowing for easy exploration.",
    "cheapestOption": "Option 3: Drive to a P+R facility near Den Haag",
    "fastestOption": "Option 1: Drive directly to Den Haag"
  }
};
