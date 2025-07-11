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
  const layerBlending = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.layerBlending || 'normal') as any;
  const overlayBlending = useSelector((state: any) => state.demo?.keplerGl?.[keplerGlId]?.visState?.overlayBlending || 'normal') as any;
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
    (mode: string) => dispatch(wrapTo(keplerGlId, VisStateActions.updateLayerBlending(mode))),
    [dispatch, keplerGlId]
  );

  const updateOverlayBlending = useCallback(
    (mode: string) => dispatch(wrapTo(keplerGlId, VisStateActions.updateOverlayBlending(mode))),
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