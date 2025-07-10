// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {wrapTo, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import styled from 'styled-components';

// Import the kepler.gl injector and FilterManagerFactory
import {appInjector, FilterManagerFactory} from '@kepler.gl/components';

// Get the FilterManager component using the injector
const FilterManager = appInjector.get(FilterManagerFactory);

// Styled wrapper to customize the UI without affecting original kepler.gl
const CustomFilterWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  
  /* Override button styles */
  .add-data-button,
  .add-filter-button {
    width: 90px !important;
    max-width: 90px !important;
    padding: 6px 8px !important;
    font-size: 11px !important;
    height: 28px !important;
    border-radius: 4px !important;
    
    svg {
      width: 12px !important;
      height: 12px !important;
      margin-right: 4px !important;
    }
    
    span {
      font-size: 11px !important;
    }
  }
  
  /* Override button text content - more specific targeting */
  .add-data-button,
  .add-filter-button,
  button[class*="add-data"],
  button[class*="add-filter"] {
    width: 90px !important;
    max-width: 90px !important;
    padding: 6px 8px !important;
    font-size: 11px !important;
    height: 28px !important;
    border-radius: 4px !important;
  }
  
  /* Target all buttons in the filter manager that contain localization keys */
  .side-panel-section button {
    position: relative;
    
    /* Hide text that starts with layerManager or filterManager */
    &[class*="layerManager"],
    &[class*="filterManager"] {
      font-size: 0 !important;
      
      &::after {
        font-size: 11px !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
      }
    }
  }
  
  /* Custom button text replacement via JavaScript will be handled in useEffect */
  
  /* Override panel titles */
  .panel-title,
  .filter-manager-title {
    font-size: 11px !important;
    font-weight: 500 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.2px !important;
    margin-bottom: 8px !important;
    color: #666 !important;
  }
  
  /* Ensure filter title is properly styled */
  .filter-manager-title {
    display: block !important;
  }
  
  /* Override dataset section titles */
  .dataset-section .panel-title {
    color: #666 !important;
  }
  
  /* Constrain width for sidebar */
  .side-panel-section {
    width: 100% !important;
    max-width: 100% !important;
    padding: 8px 12px !important;
    
    .panel-view-list-toggle {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  
  /* Remove default padding from dataset container to avoid double padding */
  .dataset-section {
    margin: 0 !important;
  }
  
  /* LAYOUT ALIGNMENT CUSTOMIZATIONS - MAKE DATASET SECTION MATCH FILTER SECTION */
  
  /* Reset all container paddings to ensure consistent base */
  .side-panel-section {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* 1. Transform Dataset Section to use PanelHeaderRow layout like Filter Section */
  
  /* Target the dataset section container directly */
  .filter-manager > div[class*="StyledDatasetSection"],
  .filter-manager > div:first-child {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
    
    /* Target the title container inside */
    > div {
      /* Copy all PanelHeaderRow styles exactly */
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      margin-top: 16px !important;
      margin-bottom: 32px !important;
      margin-left: 16px !important;
      margin-right: 16px !important;
      width: calc(100% - 32px) !important;
      box-sizing: border-box !important;
      
      /* Dataset title styling - match StyledPanelTitle exactly */
      > span {
        font-size: 11px !important;
        line-height: 1.2 !important;
        font-weight: 400 !important;
        letter-spacing: 1.25px !important;
        color: #666 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Add Data button positioning - match filter button */
      .add-data-button {
        margin: 0 !important;
        padding: 6px 8px !important;
        flex-shrink: 0 !important;
        width: 90px !important;
        box-sizing: border-box !important;
      }
    }
  }
  
  /* Force dataset section margins - comprehensive targeting */
  .filter-manager > div:first-child > div,
  .filter-manager > div:nth-child(2) > div,
  .filter-manager div[class*="StyledDatasetSection"] > div,
  .filter-manager div[class*="StyledDatasetTitle"],
  .filter-manager .dataset-section > div:first-child {
    margin-left: 16px !important;
    margin-right: 16px !important;
    width: calc(100% - 32px) !important;
    box-sizing: border-box !important;
    max-width: calc(100% - 32px) !important;
    
    /* Force flex layout to match filter section */
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 16px !important;
    margin-bottom: 32px !important;
  }
  
  /* 2. Keep Filter Panel with its natural PanelHeaderRow structure */
  .layer-manager-header {
    /* Let it use its natural PanelHeaderRow styles */
    /* Add matching margins */
    margin-left: 16px !important;
    margin-right: 16px !important;
    width: calc(100% - 32px) !important;
    box-sizing: border-box !important;
    
    /* Make filter title match dataset title exactly */
    .panel-title {
      font-size: 11px !important;
      line-height: 1.2 !important;
      font-weight: 400 !important;
      letter-spacing: 1.25px !important;
      color: #666 !important;
      text-transform: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Just ensure button consistency */
    .add-filter-button {
      margin: 0 !important;
      padding: 6px 8px !important;
      flex-shrink: 0 !important;
      width: 90px !important;
      box-sizing: border-box !important;
    }
  }
  
  /* 3. Override any parent container padding that might affect width */
  .filter-manager {
    width: 100% !important;
    
    .side-panel-section {
      padding: 0 !important;
      margin: 0 !important;
      
      /* Add consistent vertical spacing */
      &:not(:first-child) {
        margin-top: 16px !important;
      }
    }
    
    /* Ensure dataset section gets margins - very specific targeting */
    .dataset-section {
      padding: 0 !important;
      margin: 0 !important;
      
      > div:first-child {
        margin-left: 16px !important;
        margin-right: 16px !important;
        width: calc(100% - 32px) !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
    
    /* Catch-all for any element that contains "Datasets" text */
    div:has(span:contains("Datasets")),
    div:has(span:contains("Dataset")) {
      margin-left: 16px !important;
      margin-right: 16px !important;
      width: calc(100% - 32px) !important;
      box-sizing: border-box !important;
    }
    
    /* Ultimate fallback - target by structure position */
    > div:first-child,
    > div:nth-child(1) {
      > div {
        margin-left: 16px !important;
        margin-right: 16px !important;
        width: calc(100% - 32px) !important;
        box-sizing: border-box !important;
      }
    }
  }
  
  /* 3. Additional alignment options (uncomment to use) */
  
  /* For center alignment:
  .dataset-section > div:first-child,
  .layer-manager-header {
    justify-content: center !important;
    gap: 16px !important;
  }
  */
  
  /* Override toggle button styles */
  .layer-panel-toggle-option {
    padding: 4px 8px !important;
    border-radius: 2px !important;
    cursor: pointer !important;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05) !important;
    }
    
    &.active {
      background-color: rgba(0, 123, 255, 0.1) !important;
      color: #007bff !important;
    }
  }
`;

interface CustomFilterManagerProps {
  keplerGlId?: string;
}

const CustomFilterManager: React.FC<CustomFilterManagerProps> = ({keplerGlId = 'map'}) => {
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get state from kepler.gl Redux store
  const filters = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.filters);
  const datasets = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.datasets);
  const layers = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.layers);
  const panelListView = useSelector((state: any) => state.demo.keplerGl[keplerGlId].uiState.filterPanelListView);

  // Function to replace button text and panel titles
  const replaceButtonText = useCallback(() => {
    if (!wrapperRef.current) return;
    
    // Replace button text
    const buttons = wrapperRef.current.querySelectorAll('button');
    buttons.forEach(button => {
      const buttonText = button.textContent || '';
      
      // Replace Add Data button text (more comprehensive matching)
      if (buttonText.includes('layerManager.addData') || 
          buttonText.includes('addData') ||
          buttonText.includes('sidebar.panels.layer')) {
        // Find the text node and replace it
        const walker = document.createTreeWalker(
          button,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
          if (textNode.textContent?.includes('layerManager.addData') || 
              textNode.textContent?.includes('addData')) {
            textNode.textContent = 'Add Data';
          }
        }
      }
      
      // Replace Add Filter button text (more comprehensive matching)
      if (buttonText.includes('layerManager.addFilter') || 
          buttonText.includes('addFilter') ||
          buttonText.includes('filterManager.addFilter')) {
        // Find the text node and replace it
        const walker = document.createTreeWalker(
          button,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
          if (textNode.textContent?.includes('layerManager.addFilter') || 
              textNode.textContent?.includes('addFilter') ||
              textNode.textContent?.includes('filterManager.addFilter')) {
            textNode.textContent = 'Add Filter';
          }
        }
      }
    });

    // Replace panel title text
    const titleElements = wrapperRef.current.querySelectorAll('.panel-title, .filter-manager-title');
    titleElements.forEach(element => {
      const titleText = element.textContent || '';
      
      // Replace "SIDEBAR.PANELS.FILTER" with "Filters" (proper case to match "Datasets")
      if (titleText.includes('SIDEBAR.PANELS.FILTER') || 
          titleText.includes('sidebar.panels.filter') ||
          titleText.includes('filterManager.title') ||
          titleText.includes('FILTERS')) {
        element.textContent = 'Filters';
      }
    });

    // Also check for any other text elements that might contain the localization key
    const allTextElements = wrapperRef.current.querySelectorAll('*');
    allTextElements.forEach(element => {
      if (element.children.length === 0) { // Only text nodes
        const text = element.textContent || '';
        if (text.includes('SIDEBAR.PANELS.FILTER') || text.includes('sidebar.panels.filter')) {
          element.textContent = 'Filters';
        }
      }
    });
  }, []);

  // Replace button text after component mounts and updates
  useEffect(() => {
    const timer = setTimeout(() => {
      replaceButtonText();
    }, 100); // Small delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, [replaceButtonText, filters, datasets]);

  // Also replace text when datasets change (to handle Add Filter button state)
  useEffect(() => {
    replaceButtonText();
  }, [datasets, replaceButtonText]);

  // Set up MutationObserver to catch dynamically added buttons and text changes
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Small delay to ensure the DOM is stable
          setTimeout(() => {
            replaceButtonText();
          }, 50);
        }
      });
    });

    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [replaceButtonText]);

  // Additional interval-based text replacement for stubborn localization keys
  useEffect(() => {
    const interval = setInterval(() => {
      replaceButtonText();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [replaceButtonText]);

  // Action handlers for dataset operations
  const showDatasetTable = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.showDatasetTable(dataId))),
    [dispatch, keplerGlId]
  );

  const updateTableColor = useCallback(
    (dataId: string, newColor: any) => dispatch(wrapTo(keplerGlId, VisStateActions.updateTableColor(dataId, newColor))),
    [dispatch, keplerGlId]
  );

  const removeDataset = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.removeDataset(dataId))),
    [dispatch, keplerGlId]
  );

  const showAddDataModal = useCallback(
    () => dispatch(wrapTo(keplerGlId, UIStateActions.toggleModal('addData'))),
    [dispatch, keplerGlId]
  );

  // Action handlers for filter operations
  const addFilter = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.addFilter(dataId))),
    [dispatch, keplerGlId]
  );

  const removeFilter = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.removeFilter(idx))),
    [dispatch, keplerGlId]
  );

  const setFilter = useCallback(
    (idx: number, prop: string, value: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilter(idx, prop, value))),
    [dispatch, keplerGlId]
  );

  const setFilterPlot = useCallback(
    (idx: number, newProp: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilterPlot(idx, newProp))),
    [dispatch, keplerGlId]
  );

  const toggleFilterAnimation = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.toggleFilterAnimation(idx))),
    [dispatch, keplerGlId]
  );

  const toggleFilterFeature = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.toggleFilterFeature(idx))),
    [dispatch, keplerGlId]
  );

  const setFilterView = useCallback(
    (idx: number, view: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilterView(idx, view))),
    [dispatch, keplerGlId]
  );

  const syncTimeFilterWithLayerTimeline = useCallback(
    (filterId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.syncTimeFilterWithLayerTimeline(filterId))),
    [dispatch, keplerGlId]
  );

  const togglePanelListView = useCallback(
    (params: any) => dispatch(wrapTo(keplerGlId, UIStateActions.togglePanelListView(params))),
    [dispatch, keplerGlId]
  );

  const visStateActions = useMemo(() => ({
    addFilter,
    removeFilter,
    setFilter,
    setFilterPlot,
    toggleFilterAnimation,
    toggleFilterFeature,
    setFilterView,
    syncTimeFilterWithLayerTimeline
  }), [addFilter, removeFilter, setFilter, setFilterPlot, toggleFilterAnimation, toggleFilterFeature, setFilterView, syncTimeFilterWithLayerTimeline]);

  const uiStateActions = useMemo(() => ({
    togglePanelListView
  }), [togglePanelListView]);

  const panelMetadata = {
    id: 'filter',
    label: 'Filters',
    iconComponent: null
  };

  return (
    <CustomFilterWrapper ref={wrapperRef}>
      <FilterManager
        filters={filters}
        datasets={datasets}
        layers={layers}
        showDatasetTable={showDatasetTable}
        updateTableColor={updateTableColor}
        removeDataset={removeDataset}
        showAddDataModal={showAddDataModal}
        panelMetadata={panelMetadata}
        panelListView={panelListView}
        visStateActions={visStateActions}
        uiStateActions={uiStateActions}
      />
    </CustomFilterWrapper>
  );
};

export default CustomFilterManager; 