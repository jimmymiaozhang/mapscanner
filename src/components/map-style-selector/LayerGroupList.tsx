// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useCallback } from 'react';
import { 
  LayerGroupContainer, 
  LayerGroupHeader, 
  LayerGroupTitle 
} from './styled-components';
import LayerGroupItem from './LayerGroupItem';
import BackgroundLayerItem from './BackgroundLayerItem';
import { LayerGroupListProps } from './types';

const LayerGroupList: React.FC<LayerGroupListProps> = ({
  keplerGlId,
  layerGroups,
  visibleLayerGroups,
  topLayerGroups,
  threeDBuildingColor,
  backgroundColor,
  onLayerVisibilityToggle,
  onLayerMoveToTop,
  onThreeDBuildingColorChange,
  onBackgroundColorChange
}) => {
  const getLayerColor = useCallback((slug: string) => {
    if (slug === '3d building') return threeDBuildingColor || [128, 128, 128];
    if (slug === 'Background') return backgroundColor || [255, 255, 255];
    return null;
  }, [threeDBuildingColor, backgroundColor]);

  const getLayerColorChangeHandler = useCallback((slug: string) => {
    if (slug === '3d building') return onThreeDBuildingColorChange;
    if (slug === 'Background') return onBackgroundColorChange;
    return null;
  }, [onThreeDBuildingColorChange, onBackgroundColorChange]);

  if (!layerGroups.length) {
    return null;
  }

  return (
    <LayerGroupContainer>
      <LayerGroupHeader>
        <LayerGroupTitle>Map Layers</LayerGroupTitle>
      </LayerGroupHeader>
      
      {layerGroups.map((layer: any) => {
        const { slug } = layer;
        const isVisible = visibleLayerGroups?.[slug] !== false;
        const isOnTop = topLayerGroups?.[slug] || false;
        const layerColor = getLayerColor(slug);
        const colorChangeHandler = getLayerColorChangeHandler(slug);

        const handleVisibilityToggle = () => onLayerVisibilityToggle(slug);
        const handleMoveToTop = () => onLayerMoveToTop(slug);

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
              displayLayerColorPicker={null} // This will be managed by parent
              onLayerColorBlockClick={() => {}} // This will be managed by parent
              onLayerColorPickerClose={() => {}} // This will be managed by parent
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
            displayLayerColorPicker={null} // This will be managed by parent
            onLayerColorBlockClick={() => {}} // This will be managed by parent
            onLayerColorPickerClose={() => {}} // This will be managed by parent
          />
        );
      })}
    </LayerGroupContainer>
  );
};

export default LayerGroupList; 