// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import { RGBColor } from '@kepler.gl/types';

export interface MapStyleSelectorProps {
  keplerGlId?: string;
  backgroundColor: RGBColor;
  onBackgroundColorChange: (color: RGBColor) => void;
}

export interface MapStyleDropdownProps {
  isSelecting: boolean;
  mapStyles: any;
  styleType: string;
  cdnUrl: string;
  onToggleSelecting: () => void;
  onSelectStyle: (styleId: string) => void;
  onAddMapStyle: () => void;
}

export interface LayerGroupListProps {
  layersToShow: any[];
  visibleLayerGroups: any;
  topLayerGroups: any;
  threeDBuildingColor: RGBColor;
  backgroundColor: RGBColor;
  displayLayerColorPicker: string | null;
  onLayerVisibilityToggle: (slug: string, visibleLayerGroups: any) => void;
  onLayerMoveToTop: (slug: string, topLayerGroups: any) => void;
  onLayerColorBlockClick: (slug: string) => void;
  onLayerColorPickerClose: () => void;
  onLayerCustomPickerChange: (slug: string, newColor: any) => void;
}

export interface LayerGroupItemProps {
  layer: any;
  isVisible: boolean;
  isOnTop: boolean;
  layerColor: RGBColor | null;
  colorChangeHandler: ((color: RGBColor) => void) | null;
  shouldShowColorPicker: boolean;
  displayLayerColorPicker: string | null;
  onLayerVisibilityToggle: (slug: string, visibleLayerGroups: any) => void;
  onLayerMoveToTop: (slug: string, topLayerGroups: any) => void;
  onLayerColorBlockClick: (slug: string) => void;
  onLayerColorPickerClose: () => void;
  onLayerCustomPickerChange: (slug: string, newColor: any) => void;
  getLayerDisplayName: (slug: string) => string;
  visibleLayerGroups: any;
  topLayerGroups: any;
}

export interface BackgroundLayerItemProps {
  layer: any;
  isVisible: boolean;
  isOnTop: boolean;
  layerColor: RGBColor | null;
  colorChangeHandler: ((color: RGBColor) => void) | null;
  shouldShowColorPicker: boolean;
  displayLayerColorPicker: string | null;
  onLayerVisibilityToggle: (slug: string, visibleLayerGroups: any) => void;
  onLayerMoveToTop: (slug: string, topLayerGroups: any) => void;
  onLayerColorBlockClick: (slug: string) => void;
  onLayerColorPickerClose: () => void;
  onLayerCustomPickerChange: (slug: string, newColor: any) => void;
  getLayerDisplayName: (slug: string) => string;
  visibleLayerGroups: any;
  topLayerGroups: any;
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