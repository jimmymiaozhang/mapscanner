// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RGBColor } from '@kepler.gl/types';

// Import kepler.gl components and actions
import {
  mapStyleChange,
  mapConfigChange,
  set3dBuildingColor,
  setBackgroundColor,
  toggleModal
} from '@kepler.gl/actions';
import { ADD_MAP_STYLE_ID } from '@kepler.gl/constants';
import { getApplicationConfig } from '@kepler.gl/utils';

import { MapStyleSelectorProps } from './types';
import {
  MapStyleContainer,
  MapStyleLabel,
  LoadingMessage
} from './styled-components';
import MapStyleDropdown from './MapStyleDropdown';
import LayerGroupList from './LayerGroupList';

const MapStyleSelector: React.FC<MapStyleSelectorProps> = ({
  keplerGlId = 'map',
  backgroundColor,
  onBackgroundColorChange
}) => {
  const dispatch = useDispatch();
  
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const [isSelecting, setIsSelecting] = useState(false);
  const [displayLayerColorPicker, setDisplayLayerColorPicker] = useState<string | null>(null);
  
  // Get map style state from Redux
  const mapStyle = useSelector((state: any) => {
    return state?.demo?.keplerGl?.[keplerGlId]?.mapStyle || 
           state?.keplerGl?.[keplerGlId]?.mapStyle || 
           null;
  });

  // ALL CALLBACKS MUST BE DEFINED BEFORE CONDITIONAL RETURNS
  const toggleSelecting = useCallback(() => {
    setIsSelecting(prev => !prev);
  }, []);

  const selectStyle = useCallback((styleId: string) => {
    dispatch(mapStyleChange(styleId));
    setIsSelecting(false);
  }, [dispatch]);

  const handleAddMapStyle = useCallback(() => {
    dispatch(toggleModal(ADD_MAP_STYLE_ID));
  }, [dispatch]);

  const handleLayerVisibilityToggle = useCallback((slug: string, visibleLayerGroups: any) => {
    dispatch(mapConfigChange({
      visibleLayerGroups: {
        ...visibleLayerGroups,
        [slug]: !visibleLayerGroups[slug]
      }
    }));
  }, [dispatch]);

  const handleLayerMoveToTop = useCallback((slug: string, topLayerGroups: any) => {
    dispatch(mapConfigChange({
      topLayerGroups: {
        ...topLayerGroups,
        [slug]: !topLayerGroups[slug]
      }
    }));
  }, [dispatch]);

  const handleThreeDBuildingColorChange = useCallback((color: RGBColor) => {
    dispatch(set3dBuildingColor(color));
  }, [dispatch]);

  const handleBackgroundColorChange = useCallback((color: RGBColor) => {
    dispatch(setBackgroundColor(color));
  }, [dispatch]);

  const getLayerDisplayName = useCallback((slug: string) => {
    const nameMap: Record<string, string> = {
      'label': 'Label',
      'road': 'Road',
      'border': 'Border',
      'building': 'Building',
      'water': 'Water',
      'land': 'Land',
      '3d building': '3d Building',
      'Background': 'Background' // Note: capital B to match BACKGROUND_LAYER_GROUP_SLUG
    };
    return nameMap[slug] || slug;
  }, []);

  const getLayerColor = useCallback((slug: string, threeDBuildingColor: any, backgroundColor: any) => {
    if (slug === '3d building') return threeDBuildingColor || [128, 128, 128]; // Default gray
    if (slug === 'Background') return backgroundColor || [255, 255, 255]; // Default white (note: capital B)
    return null;
  }, []);

  const getLayerColorChangeHandler = useCallback((slug: string) => {
    if (slug === '3d building') return handleThreeDBuildingColorChange;
    if (slug === 'Background') return handleBackgroundColorChange; // Note: capital B
    return null;
  }, [handleThreeDBuildingColorChange, handleBackgroundColorChange]);

  const onLayerColorBlockClick = useCallback((slug: string) => {
    setDisplayLayerColorPicker(displayLayerColorPicker === slug ? null : slug);
  }, [displayLayerColorPicker]);

  const onLayerColorPickerClose = useCallback(() => {
    setDisplayLayerColorPicker(null);
  }, []);

  const onLayerCustomPickerChange = useCallback(
    (slug: string, newColor: any) => {
      const colorChangeHandler = getLayerColorChangeHandler(slug);
      if (colorChangeHandler) {
        colorChangeHandler([newColor.rgb.r, newColor.rgb.g, newColor.rgb.b]);
      }
    },
    [getLayerColorChangeHandler]
  );

  // Memoized CDN URL
  const cdnUrl = useMemo(() => {
    try {
      const appConfig = getApplicationConfig();
      return (appConfig as any)?.cdnUrl || 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    } catch (error) {
      return 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    }
  }, []);

  // NOW WE CAN DO CONDITIONAL RETURNS AFTER ALL HOOKS ARE CALLED
  if (!mapStyle) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Loading map styles...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const {mapStyles, styleType, visibleLayerGroups, topLayerGroups, threeDBuildingColor, backgroundColor: mapStyleBackgroundColor} = mapStyle;
  
  if (!mapStyles || !styleType) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Map styles not available...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const currentStyle = mapStyles[styleType] || {};
  const editableLayers = currentStyle.layerGroups || [];

  // Use the actual editable layers from the map style
  // These come from the map style definition and have the correct isColorPickerAvailable settings
  const layersToShow = editableLayers;

  return (
    <MapStyleContainer>
      {/* Map Style Section */}
      <div style={{padding: '0 16px'}}>
        <MapStyleLabel>
          Basemap
        </MapStyleLabel>

        {/* Map Style Dropdown */}
        <MapStyleDropdown
          isSelecting={isSelecting}
          mapStyles={mapStyles}
          styleType={styleType}
          cdnUrl={cdnUrl}
          onToggleSelecting={toggleSelecting}
          onSelectStyle={selectStyle}
          onAddMapStyle={handleAddMapStyle}
        />

        {/* Map Layers */}
        <LayerGroupList
          layersToShow={layersToShow}
          visibleLayerGroups={visibleLayerGroups}
          topLayerGroups={topLayerGroups}
          threeDBuildingColor={threeDBuildingColor}
          backgroundColor={mapStyleBackgroundColor}
          displayLayerColorPicker={displayLayerColorPicker}
          onLayerVisibilityToggle={handleLayerVisibilityToggle}
          onLayerMoveToTop={handleLayerMoveToTop}
          onLayerColorBlockClick={onLayerColorBlockClick}
          onLayerColorPickerClose={onLayerColorPickerClose}
          onLayerCustomPickerChange={onLayerCustomPickerChange}
        />
      </div>
    </MapStyleContainer>
  );
};

export default MapStyleSelector; 