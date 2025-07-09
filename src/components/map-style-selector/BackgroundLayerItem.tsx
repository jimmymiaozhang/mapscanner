// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import { EyeSeen, EyeUnseen } from '@kepler.gl/components/src/common/icons';
import { Upload } from '@kepler.gl/cloud-providers';
import { 
  BackgroundLayerItem as StyledBackgroundLayerItem,
  BackgroundLayerLabel, 
  BackgroundLayerActions, 
  IconButton 
} from './styled-components';
import ColorPicker from './ColorPicker';
import { BackgroundLayerItemProps } from './types';

const BackgroundLayerItem: React.FC<BackgroundLayerItemProps> = ({
  layer,
  isVisible,
  isOnTop,
  layerColor,
  onVisibilityToggle,
  onMoveToTop,
  onColorChange,
  displayLayerColorPicker,
  onLayerColorBlockClick,
  onLayerColorPickerClose
}) => {
  const { slug, isVisibilityToggleAvailable = true, isMoveToTopAvailable = true, isColorPickerAvailable } = layer;
  
  const getLayerDisplayName = (slug: string) => {
    const nameMap: Record<string, string> = {
      'label': 'Label',
      'road': 'Road',
      'border': 'Border',
      'building': 'Building',
      'water': 'Water',
      'land': 'Land',
      '3d building': '3d Building',
      'Background': 'Background'
    };
    return nameMap[slug] || slug;
  };

  const shouldShowColorPicker = isColorPickerAvailable !== false && layerColor && onColorChange;

  return (
    <StyledBackgroundLayerItem $isVisible={isVisible}>
      <BackgroundLayerLabel $isVisible={isVisible}>
        {isVisibilityToggleAvailable && (
          <IconButton
            $active={isVisible}
            onClick={onVisibilityToggle}
            title={isVisible ? 'Hide layer' : 'Show layer'}
          >
            {isVisible ? <EyeSeen /> : <EyeUnseen />}
          </IconButton>
        )}
        <span style={{marginLeft: '8px'}}>{getLayerDisplayName(slug)}</span>
      </BackgroundLayerLabel>
      
      <BackgroundLayerActions>
        {shouldShowColorPicker && (
          <ColorPicker
            slug={slug}
            color={layerColor!}
            isVisible={isVisible}
            isDisabled={isVisibilityToggleAvailable && !isVisible}
            isColorPickerOpen={displayLayerColorPicker === slug}
            onColorBlockClick={() => onLayerColorBlockClick(slug)}
            onColorPickerClose={onLayerColorPickerClose}
            onColorChange={onColorChange!}
          />
        )}
        
        {isMoveToTopAvailable && (
          <IconButton
            $active={isVisible}
            $onTop={isOnTop}
            $disabled={!isVisible}
            onClick={onMoveToTop}
            title="Move to top"
          >
            <Upload />
          </IconButton>
        )}
      </BackgroundLayerActions>
    </StyledBackgroundLayerItem>
  );
};

export default BackgroundLayerItem; 