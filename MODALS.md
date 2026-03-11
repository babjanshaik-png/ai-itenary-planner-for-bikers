# Trip Filter Modals Documentation

## Overview
These modals match the Mindtrip design for trip planning filters. They allow users to set travel parameters before planning their trip with the AI chatbot.

## Components

### 1. WhereModal
**Purpose**: Set the destination location

**Features**:
- Text input for location
- Road trip toggle switch
- Save button

**Props**:
```typescript
{
  open: boolean;           // Modal visibility
  onClose: () => void;     // Close handler
  value: string;           // Current location
  onChange: (value: string) => void;  // Update handler
}
```

**Usage**:
```tsx
<WhereModal 
  open={whereModalOpen} 
  onClose={() => setWhereModalOpen(false)}
  value={whereValue}
  onChange={setWhereValue}
/>
```

---

### 2. WhenModal
**Purpose**: Set travel dates

**Features**:
- Date input field (can be enhanced with date picker)
- Save button

**Props**:
```typescript
{
  open: boolean;
  onClose: () => void;
  value: string;           // Date string
  onChange: (value: string) => void;
}
```

**Enhancement Ideas**:
- Integrate a date picker library (react-day-picker)
- Support date ranges
- Quick presets (This weekend, Next week, etc.)

---

### 3. TravelersModal (Who)
**Purpose**: Set number of travelers by category

**Features**:
- Four categories: Adults, Children, Infants, Pets
- Plus/minus buttons for each category
- Age descriptions
- Service animal link
- Live count display in header
- Update button

**Props**:
```typescript
{
  open: boolean;
  onClose: () => void;
  value: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  onChange: (value: {...}) => void;
}
```

**Business Logic**:
- Minimum values: 0 for all categories
- Minus buttons disabled at 0
- No maximum enforced (can add if needed)
- Total count shown in header

---

### 4. BudgetModal
**Purpose**: Select budget range

**Features**:
- Five budget options with radio buttons
- Custom radio button styling
- Dollar sign symbols ($, $$, $$$, $$$$)
- Update button

**Props**:
```typescript
{
  open: boolean;
  onClose: () => void;
  value: string;           // Budget tier ID
  onChange: (value: string) => void;
}
```

**Budget Options**:
```typescript
const budgetOptions = [
  { value: "any", label: "Any budget", symbol: "" },
  { value: "budget", label: "On a budget", symbol: "$" },
  { value: "sensibly", label: "Sensibly priced", symbol: "$$" },
  { value: "upscale", label: "Upscale", symbol: "$$$" },
  { value: "luxury", label: "Luxury", symbol: "$$$$" },
];
```

---

## Design Features

### Visual Style
- **Modal backdrop**: Semi-transparent overlay
- **Modal container**: White rounded card, centered
- **Close button**: X icon in top-left
- **Primary button**: Black rounded-full button
- **Hover states**: Gray background on interactive elements

### Layout
- Max width: `sm:max-w-md` (448px)
- Padding: Consistent spacing throughout
- Responsive: Mobile-friendly sizing

### Typography
- Title: `text-xl font-semibold` centered
- Subtitle: `text-sm text-gray-500` centered
- Labels: `font-semibold text-gray-900`
- Descriptions: `text-sm text-gray-500`

### Colors
- Background: White (#ffffff)
- Text primary: Gray-900
- Text secondary: Gray-500/600
- Accent: Orange-600 (brand color)
- Buttons: Black with hover:gray-800
- Borders: Gray-300

---

## Integration in ChatPage

### State Management
```typescript
// Values
const [whereValue, setWhereValue] = useState("");
const [whenValue, setWhenValue] = useState("");
const [travelersValue, setTravelersValue] = useState({ 
  adults: 2, children: 0, infants: 0, pets: 0 
});
const [budgetValue, setBudgetValue] = useState("any");

// Modal visibility
const [whereModalOpen, setWhereModalOpen] = useState(false);
const [whenModalOpen, setWhenModalOpen] = useState(false);
const [travelersModalOpen, setTravelersModalOpen] = useState(false);
const [budgetModalOpen, setBudgetModalOpen] = useState(false);
```

### Header Buttons
Each filter in the header is clickable and opens its respective modal:

```tsx
<button onClick={() => setWhereModalOpen(true)}>
  <MapPin size={16} />
  <span>{whereValue || "Where"}</span>
</button>
```

### Display Logic
Helper functions format the displayed values:

```typescript
// Travelers: "2 travelers" or "Add travelers"
const getTravelersText = () => {
  const total = travelersValue.adults + travelersValue.children + 
                travelersValue.infants + travelersValue.pets;
  return total === 0 ? "Add travelers" : `${total} traveler${total !== 1 ? 's' : ''}`;
};

// Budget: "Budget", "$ Budget", "$$ Sensibly", etc.
const getBudgetText = () => {
  const budgetMap = {
    any: "Budget",
    budget: "$ Budget",
    sensibly: "$$ Sensibly",
    upscale: "$$$ Upscale",
    luxury: "$$$$ Luxury"
  };
  return budgetMap[budgetValue] || "Budget";
};
```

---

## Enhancements & Future Features

### WhereModal
- [ ] Autocomplete with Google Places API
- [ ] Recent searches history
- [ ] Popular destinations suggestions
- [ ] Map integration for location picking
- [ ] Multi-destination support

### WhenModal
- [ ] Calendar date picker (react-day-picker)
- [ ] Date range selection
- [ ] Quick presets (This weekend, Next month)
- [ ] Flexible dates toggle
- [ ] Duration display (e.g., "5 days")

### TravelersModal
- [ ] Validation rules (e.g., require at least 1 adult)
- [ ] Tooltips explaining age ranges
- [ ] Maximum limits per category
- [ ] Room/vehicle capacity warnings
- [ ] Seat selection for bikes

### BudgetModal
- [ ] Price range slider (min-max)
- [ ] Currency selection
- [ ] Daily vs. total budget toggle
- [ ] Budget breakdown by category
- [ ] Currency conversion

### General
- [ ] Animation on modal open/close
- [ ] Mobile swipe to dismiss
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Save preferences to localStorage
- [ ] Share trip parameters via URL
- [ ] Reset all filters button

---

## Accessibility

### Current Features
- Semantic HTML (Dialog component)
- Keyboard support (Escape to close)
- Focus management
- Clear labels and descriptions

### To Improve
- [ ] ARIA labels on all interactive elements
- [ ] Screen reader announcements
- [ ] Focus trap within modal
- [ ] High contrast mode support
- [ ] Touch target sizes (min 44x44px)

---

## Testing Checklist

### Functional
- [ ] Each modal opens on button click
- [ ] Close button works
- [ ] Click outside closes modal (if desired)
- [ ] Escape key closes modal
- [ ] Values persist after closing
- [ ] Update/Save button applies changes
- [ ] Header displays updated values

### Visual
- [ ] Modals centered on screen
- [ ] Backdrop visible
- [ ] Responsive on mobile
- [ ] All text readable
- [ ] Hover states work
- [ ] Active/selected states clear

### Edge Cases
- [ ] Empty values handled gracefully
- [ ] Zero travelers allowed
- [ ] Very long location names
- [ ] Rapid clicking doesn't break UI
- [ ] Multiple modals don't overlap

---

## Browser Compatibility
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## Dependencies
- `@/components/ui/dialog` - shadcn/ui Dialog component
- `@/components/ui/button` - shadcn/ui Button component
- `@/components/ui/input` - shadcn/ui Input component
- `lucide-react` - Icons (X, Plus, Minus)

---

## File Structure
```
src/pages/createtrip/
├── ChatPage.tsx          # Main chat interface (integrates modals)
├── TripFilters.tsx       # All four modal components
└── MODALS.md            # This documentation
```

---

## Support & Questions
For issues or enhancement requests, refer to the main project documentation.
