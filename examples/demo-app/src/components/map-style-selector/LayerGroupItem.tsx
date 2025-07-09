// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import { EyeSeen, EyeUnseen } from '@kepler.gl/components/src/common/icons';
import { Upload } from '@kepler.gl/cloud-providers';
import { Portaled } from '@kepler.gl/components';
import CustomPicker from '@kepler.gl/components/src/side-panel/layer-panel/custom-picker';
import { rgbToHex } from '@kepler.gl/utils';

import { LayerGroupItemProps } from './types';
import {
  LayerGroupItem,
  LayerLabelWrapper,
  LayerLabel,
  LayerActions,
  IconButton,
  LayerColorBlock,
  ColorPickerWrapper
} from './styled-components';

const LayerGroupItemComponent: React.FC<LayerGroupItemProps> = ({
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
}) => {
  const { slug, isVisibilityToggleAvailable = true, isMoveToTopAvailable = true } = layer;

  return (
    <LayerGroupItem>
      <LayerLabelWrapper>
        {isVisibilityToggleAvailable && (
          <IconButton
            $active={isVisible}
            onClick={() => onLayerVisibilityToggle(slug, visibleLayerGroups)}
            title={isVisible ? 'Hide layer' : 'Show layer'}
          >
            {isVisible ? <EyeSeen /> : <EyeUnseen />}
          </IconButton>
        )}
        <LayerLabel $active={isVisible}>
          {getLayerDisplayName(slug)}
        </LayerLabel>
      </LayerLabelWrapper>
      
      <LayerActions>
        {shouldShowColorPicker && (
          <ColorPickerWrapper>
            <LayerColorBlock
              $color={layerColor!}
              $disabled={isVisibilityToggleAvailable && !isVisible}
              onClick={() => {
                if (colorChangeHandler && (!isVisibilityToggleAvailable || isVisible)) {
                  onLayerColorBlockClick(slug);
                }
              }}
              title="Change color"
            />
            <Portaled
              isOpened={displayLayerColorPicker === slug}
              left={110}
              top={-50}
              onClose={onLayerColorPickerClose}
            >
              <CustomPicker 
                color={rgbToHex(layerColor!)} 
                onChange={(newColor) => onLayerCustomPickerChange(slug, newColor)} 
              />
            </Portaled>
          </ColorPickerWrapper>
        )}
        
        {isMoveToTopAvailable && (
          <IconButton
            $active={isVisible}
            $onTop={isOnTop}
            $disabled={!isVisible}
            onClick={() => onLayerMoveToTop(slug, topLayerGroups)}
            title="Move to top"
          >
            <Upload />
          </IconButton>
        )}
      </LayerActions>
    </LayerGroupItem>
  );
};

export default LayerGroupItemComponent; 