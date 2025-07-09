// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useCallback } from 'react';
import { rgbToHex } from '@kepler.gl/utils';
import { Portaled } from '@kepler.gl/components';
import CustomPicker from '@kepler.gl/components/src/side-panel/layer-panel/custom-picker';
import { ColorPickerWrapper, LayerColorBlock } from './styled-components';
import { ColorPickerProps } from './types';

const ColorPicker: React.FC<ColorPickerProps> = ({
  slug,
  color,
  isVisible,
  isDisabled = false,
  isColorPickerOpen,
  onColorBlockClick,
  onColorPickerClose,
  onColorChange
}) => {
  const handleCustomPickerChange = useCallback(
    (newColor: any) => {
      onColorChange([newColor.rgb.r, newColor.rgb.g, newColor.rgb.b]);
    },
    [onColorChange]
  );

  return (
    <ColorPickerWrapper disabled={isDisabled}>
      <LayerColorBlock
        $color={color}
        $disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            onColorBlockClick();
          }
        }}
        title="Change color"
      />
      <Portaled
        isOpened={isColorPickerOpen}
        left={110}
        top={-50}
        onClose={onColorPickerClose}
      >
        <CustomPicker 
          color={rgbToHex(color)} 
          onChange={handleCustomPickerChange} 
        />
      </Portaled>
    </ColorPickerWrapper>
  );
};

export default ColorPicker; 