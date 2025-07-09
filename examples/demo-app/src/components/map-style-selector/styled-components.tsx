// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled, { css } from 'styled-components';
import { RGBColor } from '@kepler.gl/types';

export const MapStyleContainer = styled.div`
  margin-bottom: 20px;
`;

// Map Style Dropdown (exact replica of original)
export const MapStyleLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme?.labelColor || '#6A7485'};
  margin-bottom: 6px;
  letter-spacing: 0.2px;
`;

export const StyledMapDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isCollapsed', '$isSelected', '$hasCallout'].includes(prop)
})<{$isCollapsed: boolean; $isSelected: boolean; $hasCallout: boolean}>`
  display: ${props => props.$isCollapsed ? 'none' : 'flex'};
  height: 48px;
  margin-bottom: 5px;
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }

  ${props => props.$isSelected && `
    background-color: #f8f9fa;
    border-color: #3A414C;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  `}

  .map-title-block {
    display: flex;
    align-items: center;
    
    img {
      margin-right: 12px;
      border-radius: 3px;
      height: 30px;
      width: 40px;
    }
  }

  .map-preview-name {
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme?.textColor || '#3A414C'};
  }

  /* Show callout dot for custom styles */
  ${props => props.$hasCallout && `
    &:after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: ${props.theme?.subtextColor || '#6A7485'};
      border-radius: 50%;
      top: 12px;
      left: 15px;
    }
  `}
`;

export const AddMapStyleItem = styled.div`
  display: flex;
  height: 48px;
  margin-bottom: 5px;
  position: relative;
  background-color: #ffffff;
  border: 1px dashed #6A7485;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  cursor: pointer;
  color: #6A7485;
  font-size: 12px;
  font-weight: 500;
  gap: 8px;
  
  &:hover {
    background-color: #f8f9fa;
    border-style: solid;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ArrowButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme?.subtextColor || '#6A7485'};
  }
`;

// Map Layers Section
export const LayerGroupContainer = styled.div`
  padding-bottom: 12px;
  margin-top: 16px;
`;

export const LayerGroupHeader = styled.div`
  margin-bottom: 12px;
`;

export const LayerGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme?.labelColor || '#6A7485'};
  margin: 0;
  letter-spacing: 0.2px;
`;

export const LayerGroupItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const LayerLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LayerLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$active'
})<{$active: boolean}>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$active ? (props.theme?.textColor || '#3A414C') : (props.theme?.labelColor || '#6A7485')};
  margin-left: 8px;
`;

export const LayerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$active', '$disabled', '$onTop'].includes(prop)
})<{$active?: boolean; $disabled?: boolean; $onTop?: boolean}>`
  background: transparent;
  border: none;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  padding: 4px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$disabled ? '0.3' : '1'};
  
  &:hover {
    background-color: ${props => props.$disabled ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => {
      if (props.$onTop) return '#1A1A1A'; // Very dark gray/black for on-top state
      if (props.$active) return props.theme?.textColor || '#3A414C'; // Dark gray for active state
      return props.theme?.subtextColor || '#6A7485'; // Light gray for inactive state
    }};
    opacity: ${props => {
      if (props.$onTop) return '1'; // Full opacity for on-top state
      if (props.$active) return '1'; // Full opacity for active state
      return '0.7'; // Reduced opacity for inactive state
    }};
  }
`;

export const LayerColorBlock = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$color', '$disabled'].includes(prop)
})<{$color: RGBColor; $disabled?: boolean}>`
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background-color: rgb(${props => props.$color.join(', ')});
  border: 2px solid #d0d0d0;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? '0.3' : '1'};
  margin-right: 8px;
  
  &:hover {
    border-color: ${props => props.$disabled ? '#d0d0d0' : '#3A414C'};
    box-shadow: ${props => props.$disabled ? 'none' : '0 0 0 1px rgba(0, 0, 0, 0.1)'};
  }
`;

export const ColorPickerWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'disabled'
})<{disabled?: boolean}>`
  margin-right: 24px;
  cursor: pointer;
  ${props =>
    props.disabled &&
    css`
      cursor: none;
      pointer-events: none;
      opacity: 0.3;
    `}
`;

// Special Background Layer Styling
export const BackgroundLayerItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isVisible'].includes(prop)
})<{$isVisible: boolean}>`
  display: flex;
  height: 48px;
  margin-bottom: 5px;
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  
  ${props => props.$isVisible && `
    border-color: #3A414C;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  `}
`;

export const BackgroundLayerLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isVisible'].includes(prop)
})<{$isVisible: boolean}>`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isVisible ? '#3A414C' : '#6A7485'};
`;

export const BackgroundLayerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LoadingMessage = styled.div`
  color: ${props => props.theme?.subtextColor || '#6A7485'};
  font-size: 12px;
  font-style: italic;
  padding: 20px;
  text-align: center;
`; 