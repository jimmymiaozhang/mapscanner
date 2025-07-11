// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {wrapTo, UIStateActions, VisStateActions, MapStateActions} from '@kepler.gl/actions';
import styled from 'styled-components';

// Import the kepler.gl injector and LayerManagerFactory
import {appInjector, LayerManagerFactory} from '@kepler.gl/components';

// Get the LayerManager component using the injector
const LayerManager = appInjector.get(LayerManagerFactory);

// Styled wrapper to customize the UI without affecting original kepler.gl
const CustomLayerWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  
  /* Override button styles */
  .add-data-button,
  .add-layer-button {
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
  .add-layer-button,
  button[class*="add-data"],
  button[class*="add-layer"] {
    width: 90px !important;
    max-width: 90px !important;
    padding: 6px 8px !important;
    font-size: 11px !important;
    height: 28px !important;
    border-radius: 4px !important;
  }
  
  /* Override panel titles */
  .panel-title,
  .layer-manager-title {
    font-size: 11px !important;
    font-weight: 500 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.2px !important;
    margin-bottom: 8px !important;
    color: #666 !important;
  }
  
  /* Ensure layer title is properly styled */
  .layer-manager-title {
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
  
  /* LAYOUT ALIGNMENT CUSTOMIZATIONS */
  
  /* Reset all container paddings to ensure consistent base */
  .side-panel-section {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* Target the dataset section container directly */
  .layer-manager > div[class*="StyledDatasetSection"],
  .layer-manager > div:first-child {
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
      
      /* Add Data button positioning */
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
  .layer-manager > div:first-child > div,
  .layer-manager > div:nth-child(2) > div,
  .layer-manager div[class*="StyledDatasetSection"] > div,
  .layer-manager div[class*="StyledDatasetTitle"],
  .layer-manager .dataset-section > div:first-child {
    margin-left: 16px !important;
    margin-right: 16px !important;
    width: calc(100% - 32px) !important;
    box-sizing: border-box !important;
    max-width: calc(100% - 32px) !important;
    
    /* Force flex layout to match layer section */
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 16px !important;
    margin-bottom: 32px !important;
  }
  
  /* Layer Panel with its natural PanelHeaderRow structure */
  .layer-manager-header {
    /* Add matching margins */
    margin-left: 16px !important;
    margin-right: 16px !important;
    width: calc(100% - 32px) !important;
    box-sizing: border-box !important;
    
    /* Make layer title match dataset title exactly */
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
    
    /* Ensure button consistency */
    .add-layer-button {
      margin: 0 !important;
      padding: 6px 8px !important;
      flex-shrink: 0 !important;
      width: 90px !important;
      box-sizing: border-box !important;
    }
  }
  
  /* Override the layer manager */
  .layer-manager {
    width: 100% !important;
    
    .side-panel-section {
      padding: 0 !important;
      margin: 0 !important;
      
      /* Add consistent vertical spacing */
      &:not(:first-child) {
        margin-top: 16px !important;
      }
    }
    
    /* Ensure dataset section gets margins */
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
  
  /* HIDE DATASET SECTION AND UNNECESSARY UI ELEMENTS */
  
  /* Hide dataset section by class name */
  div[class*="StyledDatasetSection"] {
    display: none !important;
  }
  
  /* Hide add-data-button specifically */
  button.add-data-button {
    display: none !important;
  }
  
  /* Hide elements containing ONLY dataset content */
  .layer-manager > div:has(span:contains("Datasets")):not(:has(span:contains("Layers"))) {
    display: none !important;
  }
  
  /* Hide PanelViewListToggle (View List/View by Dataset icons) */
  [class*="PanelViewListToggle"],
  [class*="panel-view-list-toggle"] {
    display: none !important;
  }
  
  /* Hide the first SidePanelSection (usually contains toggle) */
  .layer-manager > .side-panel-section:first-child:not(:has(span:contains("Layers"))) {
    display: none !important;
  }
  
  /* Hide SidePanelDivider (dividing line) */
  .layer-manager > .side-panel-divider:first-of-type,
  .layer-manager > [class*="SidePanelDivider"]:first-of-type {
    display: none !important;
  }
`;

interface CustomLayerManagerProps {
  keplerGlId?: string;
}

const CustomLayerManager: React.FC<CustomLayerManagerProps> = ({keplerGlId = 'map'}) => {
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get state from kepler.gl Redux store with safe fallbacks
  const datasets = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.datasets || {});
  const layers = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.layers || []);
  const layerOrder = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.layerOrder || []);
  const layerClasses = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.layerClasses || {});
  const layerBlending = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.layerBlending || 'normal') as 'normal' | 'additive' | 'subtractive';
  const overlayBlending = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.overlayBlending || 'normal') as 'normal' | 'screen' | 'darken';
  const panelListView = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.uiState?.layerPanelListView || 'list');

  // Function to replace button text and panel titles
  const replaceButtonText = useCallback(() => {
    if (!wrapperRef.current) return;
    
    // Replace button text
    const buttons = wrapperRef.current.querySelectorAll('button');
    buttons.forEach(button => {
      const buttonText = button.textContent || '';
      
      // Replace Add Data button text
      if (buttonText.includes('layerManager.addData') || 
          buttonText.includes('addData') ||
          buttonText.includes('sidebar.panels.layer')) {
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
      
      // Replace Add Layer button text
      if (buttonText.includes('layerManager.addLayer') || 
          buttonText.includes('addLayer') ||
          buttonText.includes('Add Layer')) {
        const walker = document.createTreeWalker(
          button,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
          if (textNode.textContent?.includes('layerManager.addLayer') || 
              textNode.textContent?.includes('addLayer')) {
            textNode.textContent = 'Add Layer';
          }
        }
      }
    });

    // Replace panel title text
    const titleElements = wrapperRef.current.querySelectorAll('.panel-title, .layer-manager-title');
    titleElements.forEach(element => {
      const titleText = element.textContent || '';
      
      // Replace "SIDEBAR.PANELS.LAYER" with "Layers"
      if (titleText.includes('SIDEBAR.PANELS.LAYER') || 
          titleText.includes('sidebar.panels.layer') ||
          titleText.includes('layerManager.title') ||
          titleText.includes('LAYERS')) {
        element.textContent = 'Layers';
      }
    });

    // Also check for any other text elements that might contain the localization key
    const allTextElements = wrapperRef.current.querySelectorAll('*');
    allTextElements.forEach(element => {
      if (element.children.length === 0) { // Only text nodes
        const text = element.textContent || '';
        if (text.includes('SIDEBAR.PANELS.LAYER') || text.includes('sidebar.panels.layer')) {
          element.textContent = 'Layers';
        }
      }
    });
  }, []);

  // Replace button text after component mounts and updates
  useEffect(() => {
    const timer = setTimeout(() => {
      replaceButtonText();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [replaceButtonText, layers, datasets]);

  // Also replace text when datasets change
  useEffect(() => {
    replaceButtonText();
  }, [datasets, replaceButtonText]);

  // Set up MutationObserver to catch dynamically added buttons and text changes
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [replaceButtonText]);

  // Hide dataset section since it's redundant with Data tab
  useEffect(() => {
    const hideDatasetSection = () => {
      if (!wrapperRef.current) return;

      // Strategy 1: Target the DatasetSection component specifically
      // Look for elements that contain "Datasets" text AND "Add Data" button together
      const allElements = wrapperRef.current.querySelectorAll('*');
      
      allElements.forEach(element => {
        const elementText = element.textContent || '';
        
        // Check if this element contains both "Datasets" and "Add Data" (the dataset section)
        if (elementText.includes('Datasets') && elementText.includes('Add Data') && 
            !elementText.includes('Layers') && !elementText.includes('Add Layer')) {
          
          // This should be the DatasetSection - hide it
          (element as HTMLElement).style.display = 'none';
          
          // Also hide the divider that comes after it
          const nextSibling = element.nextElementSibling;
          if (nextSibling && nextSibling.className?.includes('Divider')) {
            (nextSibling as HTMLElement).style.display = 'none';
          }
        }
      });

      // Strategy 2: Target by CSS class names (if available)
      const styledDatasetSections = wrapperRef.current.querySelectorAll('[class*="StyledDatasetSection"]');
      styledDatasetSections.forEach(section => {
        (section as HTMLElement).style.display = 'none';
      });

      // Strategy 3: Target by finding the Add Data button and hiding its container
      const addDataButtons = wrapperRef.current.querySelectorAll('button.add-data-button, button[class*="add-data"]');
      addDataButtons.forEach(button => {
        // Walk up the DOM to find the section container
        let current = button.parentElement;
        while (current && current !== wrapperRef.current) {
          const currentText = current.textContent || '';
          // If we find a container with "Datasets" and "Add Data" but no "Layers"
          if (currentText.includes('Datasets') && currentText.includes('Add Data') && 
              !currentText.includes('Layers') && !currentText.includes('Add Layer')) {
            (current as HTMLElement).style.display = 'none';
            break;
          }
          current = current.parentElement;
        }
      });

      // Strategy 4: Hide by structure - the DatasetSection should be the first major section 
      // that contains dataset content
      const layerManagerChildren = Array.from(wrapperRef.current.children);
      
      for (const child of layerManagerChildren) {
        const childText = child.textContent || '';
        
        if (childText.includes('Datasets') && childText.includes('Add Data') && 
            !childText.includes('Layers') && !childText.includes('Add Layer')) {
          (child as HTMLElement).style.display = 'none';
          break; // Only hide the first match to avoid hiding layer content
        }
      }

      // Strategy 5: Hide the PanelViewListToggle (View List/View by Dataset icons)
      const panelViewToggles = wrapperRef.current.querySelectorAll('[class*="PanelViewListToggle"], [class*="panel-view-list-toggle"]');
      panelViewToggles.forEach(toggle => {
        // Hide the toggle and its parent section
        const parentSection = toggle.closest('.side-panel-section') || toggle.closest('[class*="SidePanelSection"]');
        if (parentSection) {
          (parentSection as HTMLElement).style.display = 'none';
        } else {
          (toggle as HTMLElement).style.display = 'none';
        }
      });

      // Strategy 6: Hide the first SidePanelSection (usually contains PanelViewListToggle)
      const firstSidePanelSection = wrapperRef.current.querySelector('.side-panel-section');
      if (firstSidePanelSection) {
        const sectionText = firstSidePanelSection.textContent || '';
        // If it doesn't contain layer content, hide it (it's likely the toggle section)
        if (!sectionText.includes('Layers') && !sectionText.includes('Add Layer')) {
          (firstSidePanelSection as HTMLElement).style.display = 'none';
        }
      }

      // Strategy 7: Hide SidePanelDivider (the dividing line)
      const sidePanelDividers = wrapperRef.current.querySelectorAll('.side-panel-divider, [class*="SidePanelDivider"]');
      if (sidePanelDividers.length > 0) {
        // Hide the first divider (usually after dataset section)
        if (sidePanelDividers[0]) {
          (sidePanelDividers[0] as HTMLElement).style.display = 'none';
        }
      }

      // Strategy 8: More specific - find divider that follows a hidden dataset section
      const allChildren = Array.from(wrapperRef.current.children);
      for (let i = 0; i < allChildren.length - 1; i++) {
        const currentElement = allChildren[i];
        const nextElement = allChildren[i + 1];
        
        // If current element is hidden (dataset section) and next is a divider, hide the divider
        const currentIsHidden = (currentElement as HTMLElement).style.display === 'none';
        const nextIsDivider = nextElement.classList.contains('side-panel-divider') || 
                              nextElement.className.includes('SidePanelDivider');
        
        if (currentIsHidden && nextIsDivider) {
          (nextElement as HTMLElement).style.display = 'none';
        }
      }
    };

    // Run multiple times to catch dynamically loaded content
    const timeouts = [0, 100, 300, 500, 1000].map(delay => 
      setTimeout(hideDatasetSection, delay)
    );

    // Also run periodically but less frequently
    const interval = setInterval(hideDatasetSection, 2000);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      clearInterval(interval);
    };
  }, [datasets, layers]);

  // Set up MutationObserver for real-time hiding
  useEffect(() => {
    if (!wrapperRef.current) return;

    const hideDatasetSection = () => {
      if (!wrapperRef.current) return;

      // Use the same precise targeting as the main effect
      const allElements = wrapperRef.current.querySelectorAll('*');
      
      allElements.forEach(element => {
        const elementText = element.textContent || '';
        
        // Target elements that contain both "Datasets" and "Add Data" but no layer content
        if (elementText.includes('Datasets') && elementText.includes('Add Data') && 
            !elementText.includes('Layers') && !elementText.includes('Add Layer')) {
          (element as HTMLElement).style.display = 'none';
        }
      });

      // Also target by CSS class names
      const styledDatasetSections = wrapperRef.current.querySelectorAll('[class*="StyledDatasetSection"]');
      styledDatasetSections.forEach(section => {
        (section as HTMLElement).style.display = 'none';
      });

      // Target specific add-data-button class
      const addDataButtons = wrapperRef.current.querySelectorAll('button.add-data-button, button[class*="add-data"]');
      addDataButtons.forEach(button => {
        let current = button.parentElement;
        while (current && current !== wrapperRef.current) {
          const currentText = current.textContent || '';
          if (currentText.includes('Datasets') && currentText.includes('Add Data') && 
              !currentText.includes('Layers') && !currentText.includes('Add Layer')) {
            (current as HTMLElement).style.display = 'none';
            break;
          }
          current = current.parentElement;
        }
      });

      // Also hide PanelViewListToggle and SidePanelDivider
      const panelViewToggles = wrapperRef.current.querySelectorAll('[class*="PanelViewListToggle"], [class*="panel-view-list-toggle"]');
      panelViewToggles.forEach(toggle => {
        const parentSection = toggle.closest('.side-panel-section') || toggle.closest('[class*="SidePanelSection"]');
        if (parentSection) {
          (parentSection as HTMLElement).style.display = 'none';
        } else {
          (toggle as HTMLElement).style.display = 'none';
        }
      });

      // Hide first side panel section if it doesn't contain layer content
      const firstSidePanelSection = wrapperRef.current.querySelector('.side-panel-section');
      if (firstSidePanelSection) {
        const sectionText = firstSidePanelSection.textContent || '';
        if (!sectionText.includes('Layers') && !sectionText.includes('Add Layer')) {
          (firstSidePanelSection as HTMLElement).style.display = 'none';
        }
      }

      // Hide SidePanelDivider
      const sidePanelDividers = wrapperRef.current.querySelectorAll('.side-panel-divider, [class*="SidePanelDivider"]');
      if (sidePanelDividers[0]) {
        (sidePanelDividers[0] as HTMLElement).style.display = 'none';
      }

      // More specific divider hiding - find divider that follows hidden elements
      const allChildren = Array.from(wrapperRef.current.children);
      for (let i = 0; i < allChildren.length - 1; i++) {
        const currentElement = allChildren[i];
        const nextElement = allChildren[i + 1];
        
        const currentIsHidden = (currentElement as HTMLElement).style.display === 'none';
        const nextIsDivider = nextElement.classList.contains('side-panel-divider') || 
                              nextElement.className.includes('SidePanelDivider');
        
        if (currentIsHidden && nextIsDivider) {
          (nextElement as HTMLElement).style.display = 'none';
        }
      }
    };

    const observer = new MutationObserver(() => {
      setTimeout(hideDatasetSection, 50);
    });

    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Run immediately
    hideDatasetSection();

    return () => {
      observer.disconnect();
    };
  }, []);

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
    (dataId: string) => dispatch(wrapTo(keplerGlId, UIStateActions.openDeleteModal(dataId))),
    [dispatch, keplerGlId]
  );

  const showAddDataModal = useCallback(
    () => dispatch(wrapTo(keplerGlId, UIStateActions.toggleModal('addData'))),
    [dispatch, keplerGlId]
  );

  // UI State Actions
  const togglePanelListView = useCallback(
    (params: any) => dispatch(wrapTo(keplerGlId, UIStateActions.togglePanelListView(params))),
    [dispatch, keplerGlId]
  );

  const toggleModal = useCallback(
    (modal: string) => dispatch(wrapTo(keplerGlId, UIStateActions.toggleModal(modal))),
    [dispatch, keplerGlId]
  );

  // Vis State Actions for layers
  const addLayer = useCallback(
    (props?: any, datasetId?: string) => dispatch(wrapTo(keplerGlId, VisStateActions.addLayer(props, datasetId))),
    [dispatch, keplerGlId]
  );

  const removeLayer = useCallback(
    (layerId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.removeLayer(layerId))),
    [dispatch, keplerGlId]
  );

  const duplicateLayer = useCallback(
    (layerId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.duplicateLayer(layerId))),
    [dispatch, keplerGlId]
  );

  const layerConfigChange = useCallback(
    (layer: any, newConfig: any) => dispatch(wrapTo(keplerGlId, VisStateActions.layerConfigChange(layer, newConfig))),
    [dispatch, keplerGlId]
  );

  const layerTypeChange = useCallback(
    (layer: any, newType: string) => dispatch(wrapTo(keplerGlId, VisStateActions.layerTypeChange(layer, newType))),
    [dispatch, keplerGlId]
  );

  const layerVisConfigChange = useCallback(
    (layer: any, newVisConfig: any) => dispatch(wrapTo(keplerGlId, VisStateActions.layerVisConfigChange(layer, newVisConfig))),
    [dispatch, keplerGlId]
  );

  const layerVisualChannelConfigChange = useCallback(
    (layer: any, newConfig: any, channel: string, newVisConfig?: any) => dispatch(wrapTo(keplerGlId, VisStateActions.layerVisualChannelConfigChange(layer, newConfig, channel, newVisConfig))),
    [dispatch, keplerGlId]
  );

  const layerColorUIChange = useCallback(
    (layer: any, prop: string, newConfig: any) => dispatch(wrapTo(keplerGlId, VisStateActions.layerColorUIChange(layer, prop, newConfig))),
    [dispatch, keplerGlId]
  );

  const layerTextLabelChange = useCallback(
    (layer: any, idx: number | 'all', prop: string, value: any) => dispatch(wrapTo(keplerGlId, VisStateActions.layerTextLabelChange(layer, idx, prop, value))),
    [dispatch, keplerGlId]
  );

  const layerToggleVisibility = useCallback(
    (layerId: string, isVisible: boolean) => dispatch(wrapTo(keplerGlId, VisStateActions.layerToggleVisibility(layerId, isVisible))),
    [dispatch, keplerGlId]
  );

  const layerSetIsValid = useCallback(
    (layer: any, isValid: boolean) => dispatch(wrapTo(keplerGlId, VisStateActions.layerSetIsValid(layer, isValid))),
    [dispatch, keplerGlId]
  );

  const updateLayerBlending = useCallback(
    (mode: 'normal' | 'additive' | 'subtractive') => dispatch(wrapTo(keplerGlId, VisStateActions.updateLayerBlending(mode))),
    [dispatch, keplerGlId]
  );

  const updateOverlayBlending = useCallback(
    (mode: 'normal' | 'screen' | 'darken') => dispatch(wrapTo(keplerGlId, VisStateActions.updateOverlayBlending(mode))),
    [dispatch, keplerGlId]
  );

  // Map State Actions
  const fitBounds = useCallback(
    (bounds: any) => dispatch(wrapTo(keplerGlId, MapStateActions.fitBounds(bounds))),
    [dispatch, keplerGlId]
  );

  // Create action objects for the LayerManager
  const uiStateActions = useMemo(() => ({
    togglePanelListView,
    toggleModal,
    openDeleteModal: removeDataset
  }), [togglePanelListView, toggleModal, removeDataset]);

  const visStateActions = useMemo(() => ({
    addLayer,
    removeLayer,
    duplicateLayer,
    layerConfigChange,
    layerTypeChange,
    layerVisConfigChange,
    layerVisualChannelConfigChange,
    layerColorUIChange,
    layerTextLabelChange,
    layerToggleVisibility,
    layerSetIsValid,
    updateLayerBlending,
    updateOverlayBlending,
    showDatasetTable,
    updateTableColor,
    removeDataset
  }), [
    addLayer,
    removeLayer,
    duplicateLayer,
    layerConfigChange,
    layerTypeChange,
    layerVisConfigChange,
    layerVisualChannelConfigChange,
    layerColorUIChange,
    layerTextLabelChange,
    layerToggleVisibility,
    layerSetIsValid,
    updateLayerBlending,
    updateOverlayBlending,
    showDatasetTable,
    updateTableColor,
    removeDataset
  ]);

  const mapStateActions = useMemo(() => ({
    fitBounds
  }), [fitBounds]);

  const panelMetadata = {
    id: 'layer',
    label: 'Layers',
    iconComponent: null
  };

  return (
    <CustomLayerWrapper ref={wrapperRef}>
      {/* @ts-ignore */}
      <LayerManager
        datasets={datasets}
        layers={layers}
        layerOrder={layerOrder}
        layerClasses={layerClasses}
        layerBlending={layerBlending}
        overlayBlending={overlayBlending}
        uiStateActions={uiStateActions}
        visStateActions={visStateActions}
        mapStateActions={mapStateActions}
        showAddDataModal={showAddDataModal}
        removeDataset={removeDataset}
        showDatasetTable={showDatasetTable}
        updateTableColor={updateTableColor}
        panelListView={panelListView}
        panelMetadata={panelMetadata}
      />
    </CustomLayerWrapper>
  );
};

export default CustomLayerManager; 