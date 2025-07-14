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
  
  /* Hide info icon next to "Base Map Overlay Settings" */
  div[id*="overlayBlending-description"] {
    display: none !important;
  }
  
  /* Additional selectors to target the info icon */
  [id*="overlayBlending-description"] {
    display: none !important;
  }
  
  /* Target the InfoHelper wrapper */
  div[style*="float: right"] {
    display: none !important;
  }
  
  /* Target any info helper component in overlay blending section */
  .side-panel-section:has([id*="overlayBlending"]) .info-helper,
  .side-panel-section:has([id*="overlayBlending"]) [class*="info-helper"] {
    display: none !important;
  }
  
  /* Fix layer hover background color consistency */
  .layer-panel__header:hover {
    .layer-panel__header__actions__hidden {
      background-color: inherit !important;
    }
  }
  
  /* Ensure all action icons have consistent hover background */
  .layer-panel__header:hover .layer-panel__header__actions,
  .layer-panel__header:hover .layer-panel__header__actions__hidden {
    background-color: inherit !important;
  }
  
  /* Comprehensive focus outline removal for all layer panel elements */
  .layer-manager *:focus,
  .layer-manager *:active,
  .layer-manager button:focus,
  .layer-manager button:active,
  .layer-manager [role="button"]:focus,
  .layer-manager [role="button"]:active,
  .layer-manager .panel-header__action:focus,
  .layer-manager .panel-header__action:active,
  .layer-manager .layer-panel__header:focus,
  .layer-manager .layer-panel__header:active,
  .layer-manager .layer-panel__header button:focus,
  .layer-manager .layer-panel__header button:active,
  .layer-manager .layer-panel__header [role="button"]:focus,
  .layer-manager .layer-panel__header [role="button"]:active,
  .layer-manager .layer-panel__header .panel-header__action:focus,
  .layer-manager .layer-panel__header .panel-header__action:active,
  .layer-manager .layer-panel button:focus,
  .layer-manager .layer-panel button:active,
  .layer-manager .layer-panel [role="button"]:focus,
  .layer-manager .layer-panel [role="button"]:active,
  .layer-manager .layer-panel .panel-header__action:focus,
  .layer-manager .layer-panel .panel-header__action:active,
  .layer-manager svg:focus,
  .layer-manager svg:active,
  .layer-manager .layer__remove-layer:focus,
  .layer-manager .layer__remove-layer:active,
  .layer-manager .layer__duplicate:focus,
  .layer-manager .layer__duplicate:active,
  .layer-manager .layer__zoom-to-layer:focus,
  .layer-manager .layer__zoom-to-layer:active,
  .layer-manager .layer__visibility-toggle:focus,
  .layer-manager .layer__visibility-toggle:active {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }
  
  /* Global focus state reset specifically for this component */
  .layer-manager *:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* Rotate dropdown arrow based on layer panel expanded state */
  .layer-panel__header .layer__enable-config svg {
    transition: transform 0.3s ease;
  }
  
  /* When layer panel is expanded (has is-open class), rotate the arrow up */
  .layer-panel__header .layer__enable-config.is-open svg {
    transform: rotate(180deg);
  }
  
  /* Alternative selector for when layer configurator is active */
  .layer-panel__header.active .layer__enable-config svg,
  .layer-panel:has(.layer-panel__config) .layer__enable-config svg {
    transform: rotate(180deg);
  }
  
  /* Override button styles */
  .add-data-button,
  .add-layer-button {
    width: 140px !important;
    max-width: 140px !important;
    padding: 6px 8px !important;
    font-size: 11px !important;
    height: 28px !important;
    border-radius: 4px !important;
    white-space: nowrap !important;
    
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
    width: 140px !important;
    max-width: 140px !important;
    padding: 6px 8px !important;
    font-size: 11px !important;
    height: 28px !important;
    white-space: nowrap !important;
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
    
    /* Constrain blending sections to match layer section width */
    .layer-blending-selector,
    .overlay-blending-selector,
    [class*="LayerBlendingSelector"],
    [class*="OverlayBlendingSelector"] {
      margin-left: 16px !important;
      margin-right: 16px !important;
      width: calc(100% - 32px) !important;
      box-sizing: border-box !important;
      max-width: calc(100% - 32px) !important;
    }
    
    /* Target blending sections by their content */
    .side-panel-section:has([class*="blending"]),
    .side-panel-section:has([class*="Blending"]) {
      padding-left: 16px !important;
      padding-right: 16px !important;
      width: calc(100% - 32px) !important;
      margin-left: 16px !important;
      margin-right: 16px !important;
      box-sizing: border-box !important;
      max-width: calc(100% - 32px) !important;
    }
    
    /* Target any sections containing "Layer Blending" or "Map Overlay Blending" text */
    .side-panel-section {
      &:has(*:contains("Layer Blending")),
      &:has(*:contains("Map Overlay Blending")) {
        padding-left: 16px !important;
        padding-right: 16px !important;
        width: calc(100% - 32px) !important;
        margin-left: 16px !important;
        margin-right: 16px !important;
        box-sizing: border-box !important;
        max-width: calc(100% - 32px) !important;
      }
    }
    
    /* Additional targeting for blending sections by structure */
    .side-panel-section:nth-last-child(2),
    .side-panel-section:nth-last-child(1) {
      margin-left: 16px !important;
      margin-right: 16px !important;
      width: calc(100% - 32px) !important;
      box-sizing: border-box !important;
      max-width: calc(100% - 32px) !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    
    /* Target blending sections by their typical structure */
    .side-panel-section:last-child,
    .side-panel-section:nth-last-child(3) {
      margin-left: 16px !important;
      margin-right: 16px !important;
      width: calc(100% - 32px) !important;
      box-sizing: border-box !important;
      max-width: calc(100% - 32px) !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
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
  
  /* LIGHT THEME OVERRIDES FOR LAYER COMPONENTS */
  
  /* Override dark layer panel backgrounds */
  .layer-panel,
  [class*="LayerPanel"] {
    background-color: #ffffff !important;
  }
  
  /* Override dark layer configurator backgrounds */
  .layer-panel__config,
  [class*="StyledLayerConfigurator"] {
    background-color: #ffffff !important;
    border-left-color: #e0e0e0 !important;
  }
  
  /* Override dark layer header backgrounds */
  .layer-panel__header,
  [class*="StyledLayerPanelHeader"] {
    background-color: #f8f9fa !important;
    border-color: #e0e0e0 !important;
  }
  
  /* Override dark layer header hover states */
  .layer-panel__header:hover,
  [class*="StyledLayerPanelHeader"]:hover {
    background-color: #e9ecef !important;
  }
  
  /* Override dark dropdown backgrounds in layers */
  .layer-manager .item-selector__dropdown {
    background-color: #f7f7f7 !important;
    border: 1px solid #d3d8e0 !important;
    color: #545454 !important;
  }
  
  /* Override dark dropdown hover states */
  .layer-manager .item-selector__dropdown:hover {
    background-color: #ffffff !important;
    border-color: #000000 !important;
  }
  
  /* Override dark list selector backgrounds */
  .layer-manager .list-selector {
    background-color: #ffffff !important;
    border-top: 1px solid #d3d8e0 !important;
  }
  
  /* Override dark list items */
  .layer-manager .list__item {
    color: #545454 !important;
    background-color: transparent !important;
  }
  
  .layer-manager .list__item:hover {
    background-color: #f0f0f0 !important;
  }
  
  .layer-manager .list__item.selected {
    background-color: #e8e8e8 !important;
  }
  
  /* TARGET BLENDING DROPDOWN MENUS SPECIFICALLY */
  
  /* Override blending dropdown containers */
  .layer-manager [class*="DropdownList"],
  .layer-manager [class*="DropdownListWrapper"] {
    background-color: #ffffff !important;
    border: 1px solid #d3d8e0 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Override blending dropdown items */
  .layer-manager [class*="DropdownListItem"],
  .layer-manager .dropdown-list__item {
    background-color: #ffffff !important;
    color: #333333 !important;
    border-bottom: 1px solid #f0f0f0 !important;
    padding: 8px 12px !important;
  }
  
  .layer-manager [class*="DropdownListItem"]:hover,
  .layer-manager .dropdown-list__item:hover {
    background-color: #f8f9fa !important;
    color: #333333 !important;
  }
  
  .layer-manager [class*="DropdownListItem"].selected,
  .layer-manager .dropdown-list__item.selected {
    background-color: #e3f2fd !important;
    color: #1976d2 !important;
  }
  
  /* Target specific blending selector dropdowns */
  .layer-manager .layer-blending-selector [class*="Dropdown"],
  .layer-manager .overlay-blending-selector [class*="Dropdown"],
  .layer-manager [class*="LayerBlendingSelector"] [class*="Dropdown"],
  .layer-manager [class*="OverlayBlendingSelector"] [class*="Dropdown"] {
    background-color: #ffffff !important;
    border: 1px solid #d3d8e0 !important;
  }
  
  /* Override dark backgrounds in blending dropdown lists */
  .layer-manager .layer-blending-selector [class*="List"],
  .layer-manager .overlay-blending-selector [class*="List"],
  .layer-manager [class*="LayerBlendingSelector"] [class*="List"],
  .layer-manager [class*="OverlayBlendingSelector"] [class*="List"] {
    background-color: #ffffff !important;
    border: 1px solid #d3d8e0 !important;
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  
  /* Override dark backgrounds in blending dropdown list items */
  .layer-manager .layer-blending-selector [class*="ListItem"],
  .layer-manager .overlay-blending-selector [class*="ListItem"],
  .layer-manager [class*="LayerBlendingSelector"] [class*="ListItem"],
  .layer-manager [class*="OverlayBlendingSelector"] [class*="ListItem"] {
    background-color: #ffffff !important;
    color: #333333 !important;
    padding: 10px 12px !important;
    border-bottom: 1px solid #f0f0f0 !important;
    cursor: pointer !important;
  }
  
  .layer-manager .layer-blending-selector [class*="ListItem"]:hover,
  .layer-manager .overlay-blending-selector [class*="ListItem"]:hover,
  .layer-manager [class*="LayerBlendingSelector"] [class*="ListItem"]:hover,
  .layer-manager [class*="OverlayBlendingSelector"] [class*="ListItem"]:hover {
    background-color: #f8f9fa !important;
    color: #333333 !important;
  }
  
  .layer-manager .layer-blending-selector [class*="ListItem"].selected,
  .layer-manager .overlay-blending-selector [class*="ListItem"].selected,
  .layer-manager [class*="LayerBlendingSelector"] [class*="ListItem"].selected,
  .layer-manager [class*="OverlayBlendingSelector"] [class*="ListItem"].selected {
    background-color: #e3f2fd !important;
    color: #1976d2 !important;
  }
  
  /* Override dark layer type dropdown backgrounds */
  .layer-manager [class*="DropdownListWrapper"] {
    background-color: #ffffff !important;
    border-top: 1px solid #d3d8e0 !important;
  }
  
  /* Override dark field selector backgrounds */
  .layer-manager .field-selector,
  .layer-manager [class*="FieldSelector"] {
    background-color: #f7f7f7 !important;
  }
  
  /* Override any remaining dark backgrounds with specific color targets */
  .layer-manager [style*="background-color: rgb(28, 34, 51)"],
  .layer-manager [style*="background-color: #1c2233"],
  .layer-manager [style*="background-color: rgb(36, 39, 48)"], 
  .layer-manager [style*="background-color: #242730"],
  .layer-manager [style*="background-color: rgb(41, 50, 60)"],
  .layer-manager [style*="background-color: #29323c"],
  .layer-manager [style*="background-color: rgb(41, 46, 54)"],
  .layer-manager [style*="background-color: #292e36"] {
    background-color: #ffffff !important;
  }
  
  /* Override text colors for better light theme contrast */
  .layer-manager .layer__title {
    color: #333333 !important;
  }
  
  .layer-manager .layer__title__type {
    color: #666666 !important;
  }
  
  /* Override input field styling in layers */
  .layer-manager input {
    background-color: #ffffff !important;
    border: 1px solid #d3d8e0 !important;
    color: #545454 !important;
  }
  
  .layer-manager input:focus {
    border-color: #007bff !important;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important;
  }
  
  /* Override dark backgrounds in layer config groups */
  .layer-manager .layer-config-group,
  .layer-manager [class*="LayerConfigGroup"] {
    background-color: #ffffff !important;
  }
  
  /* Override dark slider backgrounds */
  .layer-manager .range-slider,
  .layer-manager [class*="RangeSlider"] {
    background-color: #f8f9fa !important;
  }
  
  /* Override dark switch/toggle backgrounds */
  .layer-manager .switch,
  .layer-manager [class*="Switch"] {
    background-color: #ffffff !important;
  }
  
  /* Override dark color picker backgrounds */
  .layer-manager .color-picker,
  .layer-manager [class*="ColorPicker"] {
    background-color: #ffffff !important;
  }
  
  /* Ensure all kepler.gl styled components in layer manager use light theme */
  .layer-manager [class*="styled__"],
  .layer-manager [class*="Styled"] {
    background-color: #ffffff !important;
  }
  
  /* FORCE LIGHT THEME FOR BLENDING DROPDOWN MENUS */
  
  /* Target the ItemSelector components inside blending sections */
  .layer-manager .side-panel-section .item-selector .list-selector {
    background-color: #ffffff !important;
    border-top: 1px solid #d3d8e0 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    border-radius: 2px !important;
    max-height: 280px !important;
    overflow-y: auto !important;
  }
  
  /* Target list items inside blending dropdowns */
  .layer-manager .side-panel-section .item-selector .list-selector .list__item {
    background-color: #ffffff !important;
    color: #333333 !important;
    font-size: 11px !important;
    padding: 3px 9px !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
    border-bottom: 1px solid #f0f0f0 !important;
  }
  
  .layer-manager .side-panel-section .item-selector .list-selector .list__item:hover,
  .layer-manager .side-panel-section .item-selector .list-selector .list__item.hover {
    background-color: #f8f9fa !important;
    color: #333333 !important;
    cursor: pointer !important;
  }
  
  .layer-manager .side-panel-section .item-selector .list-selector .list__item.selected {
    background-color: #e3f2fd !important;
    color: #1976d2 !important;
  }
  
  /* Target the list item anchor tags */
  .layer-manager .side-panel-section .item-selector .list-selector .list__item .list__item__anchor {
    color: #333333 !important;
    padding-left: 3px !important;
    font-size: 11px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  
  .layer-manager .side-panel-section .item-selector .list-selector .list__item:hover .list__item__anchor,
  .layer-manager .side-panel-section .item-selector .list-selector .list__item.hover .list__item__anchor {
    color: #333333 !important;
  }
  
  .layer-manager .side-panel-section .item-selector .list-selector .list__item.selected .list__item__anchor {
    color: #1976d2 !important;
  }
  
  /* Target the dropdown select component (the main button) */
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown {
    background-color: #f7f7f7 !important;
    border: 1px solid #d3d8e0 !important;
    color: #333333 !important;
  }
  
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown:hover {
    background-color: #ffffff !important;
    border-color: #333333 !important;
  }
  
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown.active {
    background-color: #ffffff !important;
    border-color: #333333 !important;
  }
  
  /* Target the dropdown select value */
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown__value {
    color: #333333 !important;
  }
  
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown__value .list__item {
    color: #333333 !important;
    background-color: transparent !important;
  }
  
  .layer-manager .side-panel-section .item-selector .item-selector__dropdown__value .list__item .list__item__anchor {
    color: #333333 !important;
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

      // Strategy 10: Constrain blending sections width to match layer section
      const blendingSections = wrapperRef.current.querySelectorAll('.side-panel-section');
      blendingSections.forEach(section => {
        const sectionText = section.textContent || '';
        
        // Target sections containing "Layer Blending" or "Map Overlay Blending"
        if (sectionText.includes('Layer Blending') || sectionText.includes('Map Overlay Blending')) {
          // Apply the same width constraints as the layer header section
          (section as HTMLElement).style.marginLeft = '16px';
          (section as HTMLElement).style.marginRight = '16px';
          (section as HTMLElement).style.width = 'calc(100% - 32px)';
          (section as HTMLElement).style.boxSizing = 'border-box';
          (section as HTMLElement).style.maxWidth = 'calc(100% - 32px)';
          (section as HTMLElement).style.paddingLeft = '0';
          (section as HTMLElement).style.paddingRight = '0';
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

      // Strategy 4: Hide info icon next to "Base Map Overlay Settings"
      const infoIcons = wrapperRef.current.querySelectorAll('[id*="overlayBlending-description"], [class*="info-helper"]');
      infoIcons.forEach(icon => {
        (icon as HTMLElement).style.display = 'none';
      });

      // Strategy 5: More specific targeting of the info icon
      const overlayBlendingSections = wrapperRef.current.querySelectorAll('div');
      overlayBlendingSections.forEach(section => {
        const sectionText = section.textContent || '';
        if (sectionText.includes('Base map overlay settings') || sectionText.includes('Base Map Overlay Settings')) {
          // Look for info icon within this section
          const infoElements = section.querySelectorAll('div[style*="float: right"], [id*="description"], [class*="info"]');
          infoElements.forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        }
      });

              // Strategy 6: Set up MutationObserver to continuously hide info icon
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && wrapperRef.current) {
              // Check for info icons that might have been added
              const newInfoIcons = wrapperRef.current.querySelectorAll('[id*="overlayBlending-description"], [class*="info-helper"], div[style*="float: right"]');
              newInfoIcons?.forEach(icon => {
                (icon as HTMLElement).style.display = 'none';
              });
            }
          });
        });

        // Start observing
        if (wrapperRef.current) {
          observer.observe(wrapperRef.current, {
            childList: true,
            subtree: true
          });
        }

        // Cleanup observer on unmount
        return () => observer.disconnect();

        // Strategy 7: Hide by structure - the DatasetSection should be the first major section 
      // that contains dataset content
      if (!wrapperRef.current) return;
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
      const panelViewToggles = wrapperRef.current?.querySelectorAll('[class*="PanelViewListToggle"], [class*="panel-view-list-toggle"]');
      panelViewToggles?.forEach(toggle => {
        // Hide the toggle and its parent section
        const parentSection = toggle.closest('.side-panel-section') || toggle.closest('[class*="SidePanelSection"]');
        if (parentSection) {
          (parentSection as HTMLElement).style.display = 'none';
        } else {
          (toggle as HTMLElement).style.display = 'none';
        }
      });

      // Strategy 6: Hide the first SidePanelSection (usually contains PanelViewListToggle)
      const firstSidePanelSection = wrapperRef.current?.querySelector('.side-panel-section');
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

      // Strategy 9: Apply light theme to layer components (override dark backgrounds)
      const darkColors = [
        'rgb(28, 34, 51)',   // #1c2233
        'rgb(36, 39, 48)',   // #242730
        'rgb(41, 50, 60)',   // #29323c
        'rgb(41, 46, 54)',   // #292e36
        'rgb(45, 50, 62)',   // #2d323e
        'rgb(60, 65, 75)',   // #3c414b
      ];

      // Find and convert dark background elements to light
      const layerElements = wrapperRef.current.querySelectorAll('*');
      layerElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        
        // If it's a dark background, override it
        if (darkColors.includes(bgColor)) {
          (element as HTMLElement).style.backgroundColor = '#ffffff';
          (element as HTMLElement).style.color = '#333333';
        }
        
        // Also check for inline dark styles
        const inlineStyle = (element as HTMLElement).style.backgroundColor;
        if (darkColors.some(color => inlineStyle.includes(color.replace(/rgb\(|\)/g, '').replace(/,/g, ', ')))) {
          (element as HTMLElement).style.backgroundColor = '#ffffff';
          (element as HTMLElement).style.color = '#333333';
        }
      });

      // Strategy 11: Target blending dropdown menus specifically for light theme
      const blendingDropdowns = wrapperRef.current.querySelectorAll(
        '[class*="DropdownList"], [class*="DropdownListWrapper"], [class*="DropdownListItem"], .dropdown-list__item'
      );
      
      blendingDropdowns.forEach(dropdown => {
        // Override dark backgrounds in blending dropdowns
        (dropdown as HTMLElement).style.backgroundColor = '#ffffff';
        (dropdown as HTMLElement).style.color = '#333333';
        (dropdown as HTMLElement).style.border = '1px solid #d3d8e0';
        
        // Add hover effects
        dropdown.addEventListener('mouseenter', () => {
          if (dropdown.classList.contains('selected') || dropdown.className.includes('selected')) {
            (dropdown as HTMLElement).style.backgroundColor = '#e3f2fd';
            (dropdown as HTMLElement).style.color = '#1976d2';
          } else {
            (dropdown as HTMLElement).style.backgroundColor = '#f8f9fa';
            (dropdown as HTMLElement).style.color = '#333333';
          }
        });
        
        dropdown.addEventListener('mouseleave', () => {
          if (dropdown.classList.contains('selected') || dropdown.className.includes('selected')) {
            (dropdown as HTMLElement).style.backgroundColor = '#e3f2fd';
            (dropdown as HTMLElement).style.color = '#1976d2';
          } else {
            (dropdown as HTMLElement).style.backgroundColor = '#ffffff';
            (dropdown as HTMLElement).style.color = '#333333';
          }
        });
      });

      // Strategy 12: Target ItemSelector components in blending sections
      const itemSelectors = wrapperRef.current.querySelectorAll('.side-panel-section .item-selector');
      itemSelectors.forEach(selector => {
        // Target the dropdown button
        const dropdownButton = selector.querySelector('.item-selector__dropdown');
        if (dropdownButton) {
          (dropdownButton as HTMLElement).style.backgroundColor = '#f7f7f7';
          (dropdownButton as HTMLElement).style.border = '1px solid #d3d8e0';
          (dropdownButton as HTMLElement).style.color = '#333333';
        }

        // Target the dropdown list
        const dropdownList = selector.querySelector('.list-selector');
        if (dropdownList) {
          (dropdownList as HTMLElement).style.backgroundColor = '#ffffff';
          (dropdownList as HTMLElement).style.borderTop = '1px solid #d3d8e0';
          (dropdownList as HTMLElement).style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          
          // Target list items
          const listItems = dropdownList.querySelectorAll('.list__item');
          listItems.forEach(item => {
            (item as HTMLElement).style.backgroundColor = '#ffffff';
            (item as HTMLElement).style.color = '#333333';
            (item as HTMLElement).style.borderBottom = '1px solid #f0f0f0';
            
            // Target anchor tags
            const anchor = item.querySelector('.list__item__anchor');
            if (anchor) {
              (anchor as HTMLElement).style.color = '#333333';
            }
          });
        }
      });
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

      // Apply light theme to layer components in MutationObserver
      const darkColors = [
        'rgb(28, 34, 51)',   // #1c2233
        'rgb(36, 39, 48)',   // #242730
        'rgb(41, 50, 60)',   // #29323c
        'rgb(41, 46, 54)',   // #292e36
        'rgb(45, 50, 62)',   // #2d323e
        'rgb(60, 65, 75)',   // #3c414b
      ];

      // Find and convert dark background elements to light
      const mutationElements = wrapperRef.current.querySelectorAll('*');
      mutationElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        
        // If it's a dark background, override it
        if (darkColors.includes(bgColor)) {
          (element as HTMLElement).style.backgroundColor = '#ffffff';
          (element as HTMLElement).style.color = '#333333';
        }
        
        // Also check for inline dark styles
        const inlineStyle = (element as HTMLElement).style.backgroundColor;
        if (darkColors.some(color => inlineStyle.includes(color.replace(/rgb\(|\)/g, '').replace(/,/g, ', ')))) {
          (element as HTMLElement).style.backgroundColor = '#ffffff';
          (element as HTMLElement).style.color = '#333333';
        }
      });

      // Constrain blending sections width (also in MutationObserver)
      const mutationBlendingSections = wrapperRef.current.querySelectorAll('.side-panel-section');
      mutationBlendingSections.forEach(section => {
        const sectionText = section.textContent || '';
        
        // Target sections containing "Layer Blending" or "Map Overlay Blending"
        if (sectionText.includes('Layer Blending') || sectionText.includes('Map Overlay Blending')) {
          // Apply the same width constraints as the layer header section
          (section as HTMLElement).style.marginLeft = '16px';
          (section as HTMLElement).style.marginRight = '16px';
          (section as HTMLElement).style.width = 'calc(100% - 32px)';
          (section as HTMLElement).style.boxSizing = 'border-box';
          (section as HTMLElement).style.maxWidth = 'calc(100% - 32px)';
          (section as HTMLElement).style.paddingLeft = '0';
          (section as HTMLElement).style.paddingRight = '0';
        }
      });

      // Target blending dropdown menus in MutationObserver
      const mutationBlendingDropdowns = wrapperRef.current.querySelectorAll(
        '[class*="DropdownList"], [class*="DropdownListWrapper"], [class*="DropdownListItem"], .dropdown-list__item'
      );
      
      mutationBlendingDropdowns.forEach(dropdown => {
        // Override dark backgrounds in blending dropdowns
        (dropdown as HTMLElement).style.backgroundColor = '#ffffff';
        (dropdown as HTMLElement).style.color = '#333333';
        (dropdown as HTMLElement).style.border = '1px solid #d3d8e0';
        
        // Add hover effects for dynamically created dropdowns
        dropdown.addEventListener('mouseenter', () => {
          if (dropdown.classList.contains('selected') || dropdown.className.includes('selected')) {
            (dropdown as HTMLElement).style.backgroundColor = '#e3f2fd';
            (dropdown as HTMLElement).style.color = '#1976d2';
          } else {
            (dropdown as HTMLElement).style.backgroundColor = '#f8f9fa';
            (dropdown as HTMLElement).style.color = '#333333';
          }
        });
        
        dropdown.addEventListener('mouseleave', () => {
          if (dropdown.classList.contains('selected') || dropdown.className.includes('selected')) {
            (dropdown as HTMLElement).style.backgroundColor = '#e3f2fd';
            (dropdown as HTMLElement).style.color = '#1976d2';
          } else {
            (dropdown as HTMLElement).style.backgroundColor = '#ffffff';
            (dropdown as HTMLElement).style.color = '#333333';
          }
        });
      });

      // Target ItemSelector components in blending sections (MutationObserver)
      const mutationItemSelectors = wrapperRef.current.querySelectorAll('.side-panel-section .item-selector');
      mutationItemSelectors.forEach(selector => {
        // Target the dropdown button
        const dropdownButton = selector.querySelector('.item-selector__dropdown');
        if (dropdownButton) {
          (dropdownButton as HTMLElement).style.backgroundColor = '#f7f7f7';
          (dropdownButton as HTMLElement).style.border = '1px solid #d3d8e0';
          (dropdownButton as HTMLElement).style.color = '#333333';
        }

        // Target the dropdown list
        const dropdownList = selector.querySelector('.list-selector');
        if (dropdownList) {
          (dropdownList as HTMLElement).style.backgroundColor = '#ffffff';
          (dropdownList as HTMLElement).style.borderTop = '1px solid #d3d8e0';
          (dropdownList as HTMLElement).style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          
          // Target list items
          const listItems = dropdownList.querySelectorAll('.list__item');
          listItems.forEach(item => {
            (item as HTMLElement).style.backgroundColor = '#ffffff';
            (item as HTMLElement).style.color = '#333333';
            (item as HTMLElement).style.borderBottom = '1px solid #f0f0f0';
            
            // Target anchor tags
            const anchor = item.querySelector('.list__item__anchor');
            if (anchor) {
              (anchor as HTMLElement).style.color = '#333333';
            }
          });
        }
      });
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