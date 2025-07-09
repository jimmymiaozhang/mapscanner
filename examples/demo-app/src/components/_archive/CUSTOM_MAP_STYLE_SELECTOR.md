# Custom Map Style Selector Implementation

## Overview

This document describes the implementation of a custom base map style selector that has been integrated into the left sidebar of the new MainPage layout in the demo app.

## Features

- **Organized Architecture**: Clean component structure with separation of concerns
- **Visual Feedback**: Selected styles are highlighted with blue borders  
- **Layer Management**: Individual layer visibility and color controls
- **Color Pickers**: Custom color selection for 3D buildings and background
- **Custom Style Support**: Displays custom styles with special indicators
- **Redux Integration**: Uses the same Redux actions and state as the built-in kepler.gl selector

## Architecture: Organized Component Structure

### Phase 1: Working Prototype (✅ Complete)
- `examples/demo-app/src/components/CustomMapStyleSelector.tsx` - Working monolithic component (690 lines)

### Phase 2: Organized Refactor (✅ Complete) 
- **Directory**: `examples/demo-app/src/components/map-style-selector/`
- **Structure**: Clean, maintainable component architecture

```
src/components/map-style-selector/
├── index.tsx                    // Main export point
├── types.ts                     // TypeScript interfaces  
├── styled-components.tsx        // All styled components
├── MapStyleSelector.tsx         // Main container component
├── MapStyleDropdown.tsx         // Style selection dropdown
├── LayerGroupItem.tsx           // Individual layer controls
├── BackgroundLayerItem.tsx      // Special background layer
├── LayerGroupList.tsx           // Layer groups container
└── ColorPicker.tsx              // Color picker functionality
```

## Files Added/Modified

### Current Implementation (✅ Active)
- `examples/demo-app/src/components/map-style-selector/` - Complete organized feature directory
- `examples/demo-app/src/components/SidebarLeft.tsx` - Updated to use organized components

### Legacy Files (📁 Preserved)
- `examples/demo-app/src/components/CustomMapStyleSelector.tsx` - Original monolithic component (kept as reference/backup)

## Component Structure

### MapStyleSelector (Main Container)
- **Location**: `examples/demo-app/src/components/map-style-selector/MapStyleSelector.tsx`
- **Purpose**: Main container component that orchestrates all sub-components
- **Responsibilities**:
  - Redux state management and action dispatching
  - Color picker state management
  - Coordinates between dropdown and layer components

### MapStyleDropdown
- **Location**: `examples/demo-app/src/components/map-style-selector/MapStyleDropdown.tsx`
- **Purpose**: Handles base map style selection
- **Features**:
  - Shows available map styles with previews
  - Toggle between collapsed/expanded states
  - "Add Map Style" functionality

### LayerGroupItem & BackgroundLayerItem
- **Location**: `examples/demo-app/src/components/map-style-selector/LayerGroupItem.tsx`
- **Location**: `examples/demo-app/src/components/map-style-selector/BackgroundLayerItem.tsx`
- **Purpose**: Individual layer controls with different styling
- **Features**:
  - Layer visibility toggle (eye icon)
  - Move to top functionality (upload icon)
  - Color picker integration for applicable layers

### ColorPicker
- **Location**: `examples/demo-app/src/components/map-style-selector/ColorPicker.tsx`
- **Purpose**: Reusable color selection component
- **Features**:
  - Custom color block with RGB preview
  - Portaled color picker modal
  - Disabled state handling

### styled-components.tsx
- **Location**: `examples/demo-app/src/components/map-style-selector/styled-components.tsx`
- **Purpose**: Centralized styling for all components
- **Benefits**:
  - Consistent theming across components
  - Easy maintenance and updates
  - Proper TypeScript prop handling

### types.ts
- **Location**: `examples/demo-app/src/components/map-style-selector/types.ts`
- **Purpose**: TypeScript interfaces for all components
- **Benefits**:
  - Type safety across component boundaries
  - Clear component API definitions
  - Better development experience

### SidebarLeft Integration
- **Location**: `examples/demo-app/src/components/SidebarLeft.tsx`
- **Enhancements**:
  - Added tab navigation (Styles, Layers, Filters, Data)
  - Organized map style selector is displayed in the "Styles" tab
  - Future tabs prepared for additional functionality

## Technical Implementation

### Redux Connection
```typescript
// Get map style state from Redux
const mapStyle = useSelector((state: any) => state?.demo?.keplerGl?.map?.mapStyle);

// Dispatch style change action
const handleStyleChange = useCallback((newStyleType: string) => {
  dispatch(mapStyleChange(newStyleType));
}, [dispatch]);
```

### Available Map Styles
The component displays all available map styles including:
- **No Basemap** - Empty base map
- **MapLibre Styles**: DarkMatter, Positron, Voyager
- **Mapbox Styles**: Dark, Light, Muted variants
- **Satellite**: Satellite imagery with streets
- **Custom Styles**: User-added custom styles

### UI Layout
```
┌─────────────────────────────────────┐
│ Styles | Layers | Filters | Data    │
├─────────────────────────────────────┤
│ Base Map Style                      │
│ ──────────────                     │
│ ┌─────────┐ ┌─────────┐            │
│ │ Dark    │ │ Light   │            │
│ │ [img]   │ │ [img]   │            │
│ └─────────┘ └─────────┘            │
│ ┌─────────┐ ┌─────────┐            │
│ │ Positron│ │ Voyager │            │
│ │ [img]   │ │ [img]   │            │
│ └─────────┘ └─────────┘            │
└─────────────────────────────────────┘
```

## Usage

1. **Start the demo app**: `npm start` from root directory
2. **Open the application**: Navigate to `http://localhost:8080`
3. **Access the selector**: 
   - The left sidebar should be visible by default
   - Click on the "Styles" tab if not already selected
   - The organized map style selector will be displayed under "Base Map Style"
4. **Interact with features**: 
   - Click on any style preview to change the base map
   - Toggle layer visibility with eye icons
   - Change 3D building and background colors with color pickers
   - Move layers to top with upload icons

## Refactoring Benefits

### Phase 1 → Phase 2 Improvements
- ✅ **Organized Architecture**: Clean separation of concerns across 8 components
- ✅ **Type Safety**: Comprehensive TypeScript interfaces for all component props
- ✅ **Maintainability**: Each component has a single responsibility
- ✅ **Reusability**: Components can be used independently or combined
- ✅ **Testability**: Smaller components are easier to unit test
- ✅ **Developer Experience**: Clear component structure and well-defined APIs

### Continued Benefits
- ✅ **Reuses existing logic**: No duplication of map style functionality
- ✅ **Consistent behavior**: Same Redux actions and state as built-in selector
- ✅ **Modern UI**: Clean styling with proper hover states and visual feedback
- ✅ **Extensible**: Easy to add more styling options in the future
- ✅ **Performance**: Proper memoization and callback optimization

## Development Workflow Validation

This refactoring successfully validates our **Phase 1 → Phase 2 → Phase 3** approach:

### ✅ Phase 1: Working Prototype
- Single monolithic `CustomMapStyleSelector.tsx` (690 lines)
- All functionality working and tested
- Safety net preserved for rollback capability

### ✅ Phase 2: Organized Refactor  
- Broke down into 8 logical components
- Maintained exact same external API
- All functionality preserved during refactoring
- Type safety improved with comprehensive interfaces

### ✅ Phase 3: Documentation & Cleanup
- Updated documentation with new architecture
- Clear component responsibilities defined
- Ready for future feature additions

## Future Component Development

This pattern is now proven and ready for:

1. **Data Table Panel** - Dataset management and preview
2. **Filter Panel** - Data filtering controls  
3. **Layer Panel** - Layer configuration and styling
4. **Interaction Panel** - Tooltip and brush configurations
5. **Export Panel** - Map and data export options

Each will follow the same **monolithic → organized → documented** workflow.

## Testing

The organized implementation has been verified to ensure:
- ✅ All map style changes work correctly
- ✅ Layer visibility toggles function properly  
- ✅ Color pickers open and change colors correctly
- ✅ Move to top functionality works
- ✅ Redux state updates are handled properly
- ✅ Component renders without compilation errors
- ✅ TypeScript types are properly defined and used
- ✅ Component integrates seamlessly with existing KeplerGl instance 