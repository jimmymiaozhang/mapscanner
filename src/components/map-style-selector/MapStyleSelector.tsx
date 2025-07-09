// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RGBColor } from '@kepler.gl/types';

// Import kepler.gl actions and constants
import {
  mapStyleChange,
  mapConfigChange,
  set3dBuildingColor,
  setBackgroundColor,
  toggleModal
} from '@kepler.gl/actions';
import { ADD_MAP_STYLE_ID } from '@kepler.gl/constants';
import { getApplicationConfig } from '@kepler.gl/utils';

// Import styled components and sub-components
import { MapStyleContainer, LoadingMessage } from './styled-components';
import MapStyleDropdown from './MapStyleDropdown';
import LayerGroupList from './LayerGroupList';
import LayerGroupItem from './LayerGroupItem';
import BackgroundLayerItem from './BackgroundLayerItem';
import { MapStyleSelectorProps } from './types';

const MapStyleSelector: React.FC<MapStyleSelectorProps> = ({
  keplerGlId = 'map',
  backgroundColor,
  onBackgroundColorChange
}) => {
  const dispatch = useDispatch();
  
  // State management
  const [isSelecting, setIsSelecting] = useState(false);
  const [displayLayerColorPicker, setDisplayLayerColorPicker] = useState<string | null>(null);
  
  // Redux selector
  const mapStyle = useSelector((state: any) => {
    return state?.demo?.keplerGl?.[keplerGlId]?.mapStyle || 
           state?.keplerGl?.[keplerGlId]?.mapStyle || 
           null;
  });

  // Callback functions
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

  const handleLayerVisibilityToggle = useCallback((slug: string) => {
    const visibleLayerGroups = mapStyle?.visibleLayerGroups || {};
    dispatch(mapConfigChange({
      visibleLayerGroups: {
        ...visibleLayerGroups,
        [slug]: !visibleLayerGroups[slug]
      }
    }));
  }, [dispatch, mapStyle?.visibleLayerGroups]);

  const handleLayerMoveToTop = useCallback((slug: string) => {
    const topLayerGroups = mapStyle?.topLayerGroups || {};
    dispatch(mapConfigChange({
      topLayerGroups: {
        ...topLayerGroups,
        [slug]: !topLayerGroups[slug]
      }
    }));
  }, [dispatch, mapStyle?.topLayerGroups]);

  const handleThreeDBuildingColorChange = useCallback((color: RGBColor) => {
    dispatch(set3dBuildingColor(color));
  }, [dispatch]);

  const handleBackgroundColorChange = useCallback((color: RGBColor) => {
    dispatch(setBackgroundColor(color));
  }, [dispatch]);

  const onLayerColorBlockClick = useCallback((slug: string) => {
    setDisplayLayerColorPicker(displayLayerColorPicker === slug ? null : slug);
  }, [displayLayerColorPicker]);

  const onLayerColorPickerClose = useCallback(() => {
    setDisplayLayerColorPicker(null);
  }, []);

  const cdnUrl = useMemo(() => {
    try {
      const appConfig = getApplicationConfig();
      return (appConfig as any)?.cdnUrl || 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    } catch (error) {
      return 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    }
  }, []);

  // Early returns for loading states
  if (!mapStyle) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Loading map styles...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const { mapStyles, styleType, visibleLayerGroups, topLayerGroups, threeDBuildingColor, backgroundColor: mapStyleBackgroundColor } = mapStyle;
  
  if (!mapStyles || !styleType) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Map styles not available...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const currentStyle = mapStyles[styleType] || {};
  const editableLayers = currentStyle.layerGroups || [];

  return (
    <MapStyleContainer>
      <div style={{ padding: '0 16px' }}>
        <MapStyleDropdown
          keplerGlId={keplerGlId}
          mapStyles={mapStyles}
          styleType={styleType}
          isSelecting={isSelecting}
          onToggleSelecting={toggleSelecting}
          onSelectStyle={selectStyle}
          onAddMapStyle={handleAddMapStyle}
          cdnUrl={cdnUrl}
        />

        {editableLayers.length > 0 && (
          <LayerGroupContainer>
            <LayerGroupHeader>
              <LayerGroupTitle>Map Layers</LayerGroupTitle>
            </LayerGroupHeader>
            
            {editableLayers.map((layer: any) => {
              const { slug } = layer;
              const isVisible = visibleLayerGroups?.[slug] !== false;
              const isOnTop = topLayerGroups?.[slug] || false;
              
              // Helper functions
              const getLayerColor = (slug: string) => {
                if (slug === '3d building') return threeDBuildingColor || [128, 128, 128];
                if (slug === 'Background') return mapStyleBackgroundColor || [255, 255, 255];
                return null;
              };

              const getLayerColorChangeHandler = (slug: string) => {
                if (slug === '3d building') return handleThreeDBuildingColorChange;
                if (slug === 'Background') return handleBackgroundColorChange;
                return null;
              };

              const layerColor = getLayerColor(slug);
              const colorChangeHandler = getLayerColorChangeHandler(slug);

              const handleVisibilityToggle = () => handleLayerVisibilityToggle(slug);
              const handleMoveToTop = () => handleLayerMoveToTop(slug);

              // Special styling for Background layer
              if (slug === 'Background') {
                return (
                  <BackgroundLayerItem
                    key={slug}
                    layer={layer}
                    isVisible={isVisible}
                    isOnTop={isOnTop}
                    layerColor={layerColor || undefined}
                    onVisibilityToggle={handleVisibilityToggle}
                    onMoveToTop={handleMoveToTop}
                    onColorChange={colorChangeHandler || undefined}
                    displayLayerColorPicker={displayLayerColorPicker}
                    onLayerColorBlockClick={onLayerColorBlockClick}
                    onLayerColorPickerClose={onLayerColorPickerClose}
                  />
                );
              }

              // Regular styling for other layers
              return (
                <LayerGroupItem
                  key={slug}
                  layer={layer}
                  isVisible={isVisible}
                  isOnTop={isOnTop}
                  layerColor={layerColor || undefined}
                  onVisibilityToggle={handleVisibilityToggle}
                  onMoveToTop={handleMoveToTop}
                  onColorChange={colorChangeHandler || undefined}
                  displayLayerColorPicker={displayLayerColorPicker}
                  onLayerColorBlockClick={onLayerColorBlockClick}
                  onLayerColorPickerClose={onLayerColorPickerClose}
                />
              );
            })}
          </LayerGroupContainer>
        )}
      </div>
    </MapStyleContainer>
  );
};

// We need to import these here since we're inlining the layer logic
import { LayerGroupContainer, LayerGroupHeader, LayerGroupTitle } from './styled-components';

export default MapStyleSelector; 