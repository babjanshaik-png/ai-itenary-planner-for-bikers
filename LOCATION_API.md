# Location Autocomplete API Integration

## Current Implementation

The Where modal now includes **live location autocomplete** that fetches suggestions as you type.

### Features
✅ Real-time search with debouncing (300ms delay)  
✅ Loading indicator while fetching  
✅ Dropdown suggestions with location details  
✅ Click to select from suggestions  
✅ Auto-closes suggestions after selection  
✅ MapPin icons for each suggestion  

---

## Default API: OpenStreetMap Nominatim

**Currently using**: Free, no API key required

### Pros
- ✅ Completely free
- ✅ No API key needed
- ✅ Good global coverage
- ✅ Open source

### Cons
- ⚠️ Rate limited (1 request per second)
- ⚠️ Less accurate than Google Places
- ⚠️ Slower response times

### Code Location
```typescript
// In TripFilters.tsx - fetchLocationPredictions function
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&addressdetails=1`,
  {
    headers: {
      'Accept': 'application/json',
    }
  }
);
```

---

## Alternative: Google Places Autocomplete API

**Recommended for production**: Best accuracy and features

### Setup Steps

#### 1. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Places API"
4. Create API credentials (API Key)
5. Restrict key to your domain

#### 2. Install Google Places Library
```bash
npm install @googlemaps/js-api-loader
```

#### 3. Create Environment Variable
Create `.env.local` file:
```env
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
```

#### 4. Replace the API Code

**Option A: Using Places Autocomplete Service**
```typescript
import { Loader } from "@googlemaps/js-api-loader";

// Initialize loader
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

// In fetchLocationPredictions function:
const fetchLocationPredictions = async (input: string) => {
  if (input.length < 2) {
    setPredictions([]);
    return;
  }

  setIsLoading(true);
  
  try {
    const google = await loader.load();
    const service = new google.maps.places.AutocompleteService();
    
    service.getPlacePredictions(
      {
        input: input,
        types: ['(cities)'] // or ['geocode'] for all locations
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const formattedPredictions: LocationPrediction[] = predictions.map(p => ({
            place_id: p.place_id,
            description: p.description,
            structured_formatting: {
              main_text: p.structured_formatting.main_text,
              secondary_text: p.structured_formatting.secondary_text
            }
          }));
          
          setPredictions(formattedPredictions);
          setShowSuggestions(true);
        } else {
          setPredictions([]);
        }
        setIsLoading(false);
      }
    );
  } catch (error) {
    console.error('Error fetching predictions:', error);
    setPredictions([]);
    setIsLoading(false);
  }
};
```

**Option B: Using REST API (No npm package needed)**
```typescript
const fetchLocationPredictions = async (input: string) => {
  if (input.length < 2) {
    setPredictions([]);
    return;
  }

  setIsLoading(true);
  
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      const formattedPredictions: LocationPrediction[] = data.predictions.map((p: any) => ({
        place_id: p.place_id,
        description: p.description,
        structured_formatting: {
          main_text: p.structured_formatting.main_text,
          secondary_text: p.structured_formatting.secondary_text
        }
      }));
      
      setPredictions(formattedPredictions);
      setShowSuggestions(true);
    }
  } catch (error) {
    console.error('Error fetching predictions:', error);
    setPredictions([]);
  } finally {
    setIsLoading(false);
  }
};
```

### Pricing
- **Free tier**: $200 credit per month
- **Cost**: $2.83 per 1000 requests (Autocomplete - Per Session)
- **Typically**: 2-3 requests per search

---

## Alternative: Mapbox Geocoding API

**Good middle ground**: Free tier + good features

### Setup Steps

#### 1. Get Mapbox Access Token
1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Get your access token from dashboard
3. Free tier: 100,000 requests/month

#### 2. Add to Environment
```env
VITE_MAPBOX_ACCESS_TOKEN=your_token_here
```

#### 3. Replace API Code
```typescript
const fetchLocationPredictions = async (input: string) => {
  if (input.length < 2) {
    setPredictions([]);
    return;
  }

  setIsLoading(true);
  
  try {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${token}&limit=5&types=place,locality,neighborhood`
    );
    
    const data = await response.json();
    
    const formattedPredictions: LocationPrediction[] = data.features.map((feature: any) => ({
      place_id: feature.id,
      description: feature.place_name,
      structured_formatting: {
        main_text: feature.text,
        secondary_text: feature.place_name.replace(feature.text + ', ', '')
      }
    }));
    
    setPredictions(formattedPredictions);
    setShowSuggestions(true);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    setPredictions([]);
  } finally {
    setIsLoading(false);
  }
};
```

### Pricing
- **Free tier**: 100,000 requests/month
- **Cost after**: $0.50 per 1,000 requests
- **Good for**: Small to medium apps

---

## Alternative: LocationIQ (Nominatim-based)

**Better OSM experience**: With API key and higher limits

### Setup Steps

#### 1. Get API Key
1. Sign up at [LocationIQ](https://locationiq.com/)
2. Get your API key
3. Free tier: 5,000 requests/day

#### 2. Add to Environment
```env
VITE_LOCATIONIQ_API_KEY=your_key_here
```

#### 3. Replace API Code
```typescript
const fetchLocationPredictions = async (input: string) => {
  if (input.length < 2) {
    setPredictions([]);
    return;
  }

  setIsLoading(true);
  
  try {
    const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
    const response = await fetch(
      `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(input)}&limit=5&format=json`
    );
    
    const data = await response.json();
    
    const formattedPredictions: LocationPrediction[] = data.map((item: any) => ({
      place_id: item.place_id,
      description: item.display_name,
      structured_formatting: {
        main_text: item.display_name.split(',')[0],
        secondary_text: item.display_name.split(',').slice(1).join(',').trim()
      }
    }));
    
    setPredictions(formattedPredictions);
    setShowSuggestions(true);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    setPredictions([]);
  } finally {
    setIsLoading(false);
  }
};
```

### Pricing
- **Free tier**: 5,000 requests/day
- **Cost**: Starting at $49/month for 100k requests
- **Good for**: Higher volume OSM needs

---

## Comparison Table

| Feature | OSM Nominatim | Google Places | Mapbox | LocationIQ |
|---------|---------------|---------------|--------|------------|
| **Free Tier** | Unlimited* | $200/month | 100k/month | 5k/day |
| **API Key** | ❌ Not needed | ✅ Required | ✅ Required | ✅ Required |
| **Accuracy** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Speed** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Setup** | ✅ Easy | 🔶 Medium | ✅ Easy | ✅ Easy |
| **Best For** | Testing | Production | Production | Medium apps |

*Rate limited to 1 req/sec

---

## Recommended Approach

### For Development/Testing
✅ **Use OpenStreetMap Nominatim** (current implementation)
- No setup needed
- Works immediately
- Good enough for testing

### For Production
✅ **Use Google Places API**
- Best accuracy
- Most reliable
- Industry standard
- Worth the cost for good UX

### For Budget-Conscious Production
✅ **Use Mapbox**
- Good free tier
- Good accuracy
- Lower costs than Google

---

## Current Implementation Details

### Debouncing
Searches are debounced with 300ms delay to avoid excessive API calls:
```typescript
debounceTimer.current = setTimeout(() => {
  fetchLocationPredictions(value);
}, 300);
```

### Loading State
Shows a spinner while fetching:
```tsx
{isLoading && (
  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
)}
```

### Suggestions UI
```tsx
<div className="absolute z-10 w-full mt-2 bg-white border rounded-2xl shadow-lg">
  {predictions.map((prediction) => (
    <button onClick={() => handleSelectPrediction(prediction)}>
      <MapPin className="text-orange-600" />
      <div>
        <div>{prediction.structured_formatting.main_text}</div>
        <div>{prediction.structured_formatting.secondary_text}</div>
      </div>
    </button>
  ))}
</div>
```

---

## Testing

### Try It Now
1. Open the chat page
2. Click "Where" in the header
3. Start typing a location (e.g., "New York", "London", "Mumbai")
4. See suggestions appear in dropdown
5. Click a suggestion to select it
6. Click Save

### Expected Behavior
- Suggestions appear after 2+ characters
- Loading spinner shows during fetch
- Up to 5 suggestions displayed
- Click selects and closes dropdown
- Selected location appears in header

---

## Rate Limiting Best Practices

### Current Implementation
✅ Debouncing (300ms)  
✅ Minimum 2 characters  
✅ Limit results to 5  

### Additional Improvements
```typescript
// Add caching to avoid duplicate requests
const cache = new Map<string, LocationPrediction[]>();

const fetchLocationPredictions = async (input: string) => {
  // Check cache first
  if (cache.has(input)) {
    setPredictions(cache.get(input)!);
    return;
  }
  
  // ... fetch logic ...
  
  // Store in cache
  cache.set(input, formattedPredictions);
};
```

---

## Troubleshooting

### No suggestions appearing
1. Check console for errors
2. Verify API is responding (Network tab)
3. Check rate limits
4. Ensure input is 2+ characters

### CORS errors
- Nominatim: Should work fine
- Google/Mapbox: Need to add domain to allowed origins
- Use proxy server if needed

### Slow performance
- Increase debounce delay (e.g., 500ms)
- Reduce limit (e.g., 3 results instead of 5)
- Add caching
- Consider backend proxy

---

## Next Steps

1. **Choose your API** based on needs
2. **Get API key** if needed
3. **Replace the fetch code** in `TripFilters.tsx`
4. **Test thoroughly**
5. **Monitor usage** and costs

Your location autocomplete is now working! 🎉🗺️
