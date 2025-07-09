# Archived Components

This directory contains legacy components that have been replaced but are preserved for reference.

## Contents

### CustomMapStyleSelector.tsx
- **Status**: Archived (January 2025)
- **Replaced by**: `map-style-selector/` organized component structure
- **Purpose**: Original working monolithic implementation (690 lines)
- **Note**: Fully functional implementation preserved as reference

### CUSTOM_MAP_STYLE_SELECTOR.md
- **Status**: Archived (January 2025) 
- **Replaced by**: Updated documentation in the organized component structure
- **Purpose**: Original documentation covering the monolithic implementation
- **Note**: Contains valuable development history and workflow validation

## Development History

This archive represents the successful completion of our **Phase 1 → Phase 2 → Phase 3** refactoring approach:

1. **Phase 1**: Created working monolithic `CustomMapStyleSelector.tsx`
2. **Phase 2**: Refactored into organized `map-style-selector/` structure  
3. **Phase 3**: Documented new architecture and archived legacy files

## Current Implementation

The active codebase now uses:
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

These archived files can be safely deleted in the future once the organized structure has been thoroughly tested and validated. 