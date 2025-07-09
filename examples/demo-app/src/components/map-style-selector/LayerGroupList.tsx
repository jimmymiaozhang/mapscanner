// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useCallback } from 'react';
import { RGBColor } from '@kepler.gl/types';

import { LayerGroupListProps } from './types';
import {
  LayerGroupContainer,
  LayerGroupHeader,
  LayerGroupTitle
} from './styled-components';
import LayerGroupItemComponent from './LayerGroupItem';
import BackgroundLayerItemComponent from './BackgroundLayerItem';

const LayerGroupList: React.FC<LayerGroupListProps> = ({
  layersToShow,
  visibleLayerGroups,
  topLayerGroups,
  threeDBuildingColor,
  backgroundColor,
  displayLayerColorPicker,
  onLayerVisibilityToggle,
  onLayerMoveToTop,
  onLayerColorBlockClick,
  onLayerColorPickerClose,
  onLayerCustomPickerChange
}) => {
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
    // Return a placeholder function - the actual color change will be handled 
    // by the parent through onLayerCustomPickerChange
    if (slug === '3d building' || slug === 'Background') {
      return () => {}; // Placeholder function to indicate color picker should be available
    }
    return null;
  }, []);

  if (layersToShow.length === 0) {
    return null;
  }

  return (
    <LayerGroupContainer>
      <LayerGroupHeader>
        <LayerGroupTitle>
          Map Layers
        </LayerGroupTitle>
      </LayerGroupHeader>
      
      {layersToShow.map((layer: any) => {
        const { slug, isVisibilityToggleAvailable = true, isMoveToTopAvailable = true, isColorPickerAvailable } = layer;
        const isVisible = visibleLayerGroups?.[slug] !== false;
        const isOnTop = topLayerGroups?.[slug] || false;
        const layerColor = getLayerColor(slug, threeDBuildingColor, backgroundColor);
        const colorChangeHandler = getLayerColorChangeHandler(slug);
        
        // Determine if color picker should be available based on layer type and if we have a color
        const shouldShowColorPicker = isColorPickerAvailable !== false && layerColor && colorChangeHandler;
        
        const commonProps = {
          layer,
          isVisible,
          isOnTop,
          layerColor,
          colorChangeHandler,
          shouldShowColorPicker,
          displayLayerColorPicker,
          onLayerVisibilityToggle,
          onLayerMoveToTop,
          onLayerColorBlockClick,
          onLayerColorPickerClose,
          onLayerCustomPickerChange,
          getLayerDisplayName,
          visibleLayerGroups,
          topLayerGroups
        };

        // Special styling for Background layer
        if (slug === 'Background') {
          return (
            <BackgroundLayerItemComponent
              key={slug}
              {...commonProps}
            />
          );
        }

        // Regular styling for other layers
        return (
          <LayerGroupItemComponent
            key={slug}
            {...commonProps}
          />
        );
      })}
    </LayerGroupContainer>
  );
};

export default LayerGroupList; 