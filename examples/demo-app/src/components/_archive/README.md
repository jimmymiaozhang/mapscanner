# Archived Components

This directory contains legacy components that have been replaced but are preserved for reference.

## Archive Structure

Each archived feature has its own documentation:

- **MAP_STYLE_SELECTOR_ARCHIVE.md** - Documentation for the map style selector refactoring
- **CUSTOM_MAP_STYLE_SELECTOR.md** - Original documentation for the monolithic map style selector
- **CustomMapStyleSelector.tsx** - Original monolithic map style selector implementation

## Development Workflow

All archived components in this directory follow our standard **Phase 1 → Phase 2 → Phase 3** refactoring approach:

1. **Phase 1**: Create working monolithic component
2. **Phase 2**: Refactor into organized structure  
3. **Phase 3**: Document new architecture and archive legacy files

## Future Archives

When new features are refactored, they will be archived here with similar documentation:

```
_archive/
├── README.md                          # This general overview
├── MAP_STYLE_SELECTOR_ARCHIVE.md      # Map style selector specific docs
├── CustomMapStyleSelector.tsx         # Map style selector monolithic
├── CUSTOM_MAP_STYLE_SELECTOR.md       # Map style selector original docs
├── DATA_TABLE_ARCHIVE.md              # Future: Data table specific docs
├── CustomDataTable.tsx                # Future: Data table monolithic
└── FILTER_PANEL_ARCHIVE.md            # Future: Filter panel specific docs
```

## Cleanup Policy

These archived files can be safely deleted once:
1. The organized structure has been thoroughly tested
2. The team is confident in the new implementation
3. Sufficient time has passed (recommended: 2-4 weeks minimum)

See individual archive documentation files for feature-specific details. 