// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import { RGBColor } from '@kepler.gl/types';

export interface MapStyleSelectorProps {
  keplerGlId?: string;
  backgroundColor: RGBColor;
  onBackgroundColorChange: (color: RGBColor) => void;
}

export interface MapStyleDropdownProps {
  keplerGlId?: string;
  mapStyles: any;
  styleType: string;
  isSelecting: boolean;
  onToggleSelecting: () => void;
  onSelectStyle: (styleId: string) => void;
  onAddMapStyle: () => void;
  cdnUrl: string;
}

export interface LayerGroupListProps {
  keplerGlId?: string;
  layerGroups: any[];
  visibleLayerGroups: any;
  topLayerGroups: any;
  threeDBuildingColor: RGBColor;
  backgroundColor: RGBColor;
  onLayerVisibilityToggle: (slug: string) => void;
  onLayerMoveToTop: (slug: string) => void;
  onThreeDBuildingColorChange: (color: RGBColor) => void;
  onBackgroundColorChange: (color: RGBColor) => void;
}

export interface LayerGroupItemProps {
  layer: any;
  isVisible: boolean;
  isOnTop: boolean;
  layerColor?: RGBColor;
  onVisibilityToggle: () => void;
  onMoveToTop: () => void;
  onColorChange?: (color: RGBColor) => void;
  displayLayerColorPicker: string | null;
  onLayerColorBlockClick: (slug: string) => void;
  onLayerColorPickerClose: () => void;
}

export interface BackgroundLayerItemProps {
  layer: any;
  isVisible: boolean;
  isOnTop: boolean;
  layerColor?: RGBColor;
  onVisibilityToggle: () => void;
  onMoveToTop: () => void;
  onColorChange?: (color: RGBColor) => void;
  displayLayerColorPicker: string | null;
  onLayerColorBlockClick: (slug: string) => void;
  onLayerColorPickerClose: () => void;
}

export interface ColorPickerProps {
  slug: string;
  color: RGBColor;
  isVisible: boolean;
  isDisabled?: boolean;
  isColorPickerOpen: boolean;
  onColorBlockClick: () => void;
  onColorPickerClose: () => void;
  onColorChange: (color: RGBColor) => void;
} 