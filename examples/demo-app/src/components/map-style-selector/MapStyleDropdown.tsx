// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import { NO_BASEMAP_ICON } from '@kepler.gl/constants';
import { Add, ArrowDown } from '@kepler.gl/components/src/common/icons';

import { MapStyleDropdownProps } from './types';
import {
  StyledMapDropdown,
  AddMapStyleItem,
  ArrowButton
} from './styled-components';

const MapStyleDropdown: React.FC<MapStyleDropdownProps> = ({
  isSelecting,
  mapStyles,
  styleType,
  cdnUrl,
  onToggleSelecting,
  onSelectStyle,
  onAddMapStyle
}) => {
  if (isSelecting) {
    // Show all styles when selecting + Add Map Style button
    return (
      <>
        {Object.values(mapStyles).map((style: any) => {
          const {id, custom, icon = `${cdnUrl}/${NO_BASEMAP_ICON}`, label = 'Untitled'} = style;
          const isCurrentStyle = id === styleType;
          
          return (
            <StyledMapDropdown
              key={id}
              $isCollapsed={false}
              $isSelected={isCurrentStyle}
              $hasCallout={Boolean(custom)}
              onClick={() => onSelectStyle(id)}
            >
              <div className="map-title-block">
                <img src={icon} alt={label} />
                <div className="map-preview-name">{label}</div>
              </div>
            </StyledMapDropdown>
          );
        })}
        
        {/* Add Map Style Button - only shown when dropdown is expanded */}
        <AddMapStyleItem onClick={onAddMapStyle}>
          <Add />
          Add Map Style
        </AddMapStyleItem>
      </>
    );
  }

  // Show only current style when not selecting
  const currentStyle = mapStyles[styleType];
  if (!currentStyle) return null;
  
  const {id, custom, icon = `${cdnUrl}/${NO_BASEMAP_ICON}`, label = 'Untitled'} = currentStyle;
  
  return (
    <StyledMapDropdown
      key={id}
      $isCollapsed={false}
      $isSelected={false}
      $hasCallout={Boolean(custom)}
      onClick={onToggleSelecting}
    >
      <div className="map-title-block">
        <img src={icon} alt={label} />
        <div className="map-preview-name">{label}</div>
      </div>
      <ArrowButton onClick={(e) => { e.stopPropagation(); onToggleSelecting(); }}>
        <ArrowDown />
      </ArrowButton>
    </StyledMapDropdown>
  );
};

export default MapStyleDropdown; 