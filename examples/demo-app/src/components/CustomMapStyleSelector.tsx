// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { FormattedMessage } from '@kepler.gl/localization';
import { RGBColor } from '@kepler.gl/types';
import { rgbToHex } from '@kepler.gl/utils';

// Import kepler.gl components and actions
import {
  mapStyleChange,
  mapConfigChange,
  set3dBuildingColor,
  setBackgroundColor,
  toggleModal
} from '@kepler.gl/actions';
import { NO_BASEMAP_ICON, ADD_MAP_STYLE_ID, NO_MAP_ID } from '@kepler.gl/constants';
import { getApplicationConfig } from '@kepler.gl/utils';

// Import icons
import { Add, ArrowDown, EyeSeen, EyeUnseen } from '@kepler.gl/components/src/common/icons';
import { Upload } from '@kepler.gl/cloud-providers';

// Import the color picker components from kepler.gl
import { Portaled } from '@kepler.gl/components';
import { Tooltip } from '@kepler.gl/components/src/common/styled-components';
import CustomPicker from '@kepler.gl/components/src/side-panel/layer-panel/custom-picker';
import { ColorBlock } from '@kepler.gl/components/src/side-panel/layer-panel/color-selector';

const MapStyleContainer = styled.div`
  margin-bottom: 20px;
`;

// Map Style Dropdown (exact replica of original)
const MapStyleLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme?.labelColor || '#6A7485'};
  margin-bottom: 6px;
  letter-spacing: 0.2px;
`;

const StyledMapDropdown = styled.div.withConfig({
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

const AddMapStyleItem = styled.div`
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

const ArrowButton = styled.button`
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

// Map Layers Section (exact replica of original)
const LayerGroupContainer = styled.div`
  padding-bottom: 12px;
  margin-top: 16px;
`;

const LayerGroupHeader = styled.div`
  margin-bottom: 12px;
`;

const LayerGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme?.labelColor || '#6A7485'};
  margin: 0;
  letter-spacing: 0.2px;
`;

const LayerGroupItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LayerLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LayerLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$active'
})<{$active: boolean}>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$active ? (props.theme?.textColor || '#3A414C') : (props.theme?.labelColor || '#6A7485')};
  margin-left: 8px;
`;

const LayerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button.withConfig({
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

const LayerColorBlock = styled.div.withConfig({
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

const LoadingMessage = styled.div`
  color: ${props => props.theme?.subtextColor || '#6A7485'};
  font-size: 12px;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

const ColorPickerWrapper = styled.div.withConfig({
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

const BackgroundSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: ${props => props.theme.panelBackgroundHover};
  border-radius: 4px;
`;

const BackgroundLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textColor};
  font-weight: 500;
`;

const BackgroundControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackgroundLayerItem = styled.div.withConfig({
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

const BackgroundLayerLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isVisible'].includes(prop)
})<{$isVisible: boolean}>`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isVisible ? '#3A414C' : '#6A7485'};
`;

const BackgroundLayerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface CustomMapStyleSelectorProps {
  keplerGlId?: string;
  backgroundColor: RGBColor;
  onBackgroundColorChange: (color: RGBColor) => void;
}

const CustomMapStyleSelector: React.FC<CustomMapStyleSelectorProps> = ({
  keplerGlId = 'map',
  backgroundColor,
  onBackgroundColorChange
}) => {
  const dispatch = useDispatch();
  
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const [isSelecting, setIsSelecting] = useState(false);
  const [displayLayerColorPicker, setDisplayLayerColorPicker] = useState<string | null>(null);
  
  // Get map style state from Redux
  const mapStyle = useSelector((state: any) => {
    return state?.demo?.keplerGl?.[keplerGlId]?.mapStyle || 
           state?.keplerGl?.[keplerGlId]?.mapStyle || 
           null;
  });

  // ALL CALLBACKS MUST BE DEFINED BEFORE CONDITIONAL RETURNS
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

  const handleLayerVisibilityToggle = useCallback((slug: string, visibleLayerGroups: any) => {
    dispatch(mapConfigChange({
      visibleLayerGroups: {
        ...visibleLayerGroups,
        [slug]: !visibleLayerGroups[slug]
      }
    }));
  }, [dispatch]);

  const handleLayerMoveToTop = useCallback((slug: string, topLayerGroups: any) => {
    dispatch(mapConfigChange({
      topLayerGroups: {
        ...topLayerGroups,
        [slug]: !topLayerGroups[slug]
      }
    }));
  }, [dispatch]);

  const handleThreeDBuildingColorChange = useCallback((color: RGBColor) => {
    dispatch(set3dBuildingColor(color));
  }, [dispatch]);

  const handleBackgroundColorChange = useCallback((color: RGBColor) => {
    dispatch(setBackgroundColor(color));
  }, [dispatch]);



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
    if (slug === '3d building') return handleThreeDBuildingColorChange;
    if (slug === 'Background') return handleBackgroundColorChange; // Note: capital B
    return null;
  }, [handleThreeDBuildingColorChange, handleBackgroundColorChange]);

  const onLayerColorBlockClick = useCallback((slug: string) => {
    setDisplayLayerColorPicker(displayLayerColorPicker === slug ? null : slug);
  }, [displayLayerColorPicker]);

  const onLayerColorPickerClose = useCallback(() => {
    setDisplayLayerColorPicker(null);
  }, []);

  const onLayerCustomPickerChange = useCallback(
    (slug: string, newColor: any) => {
      const colorChangeHandler = getLayerColorChangeHandler(slug);
      if (colorChangeHandler) {
        colorChangeHandler([newColor.rgb.r, newColor.rgb.g, newColor.rgb.b]);
      }
    },
    [getLayerColorChangeHandler]
  );

  // Memoized CDN URL
  const cdnUrl = useMemo(() => {
    try {
      const appConfig = getApplicationConfig();
      return (appConfig as any)?.cdnUrl || 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    } catch (error) {
      return 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
    }
  }, []);

  // NOW WE CAN DO CONDITIONAL RETURNS AFTER ALL HOOKS ARE CALLED
  if (!mapStyle) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Loading map styles...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const {mapStyles, styleType, visibleLayerGroups, topLayerGroups, threeDBuildingColor, backgroundColor: mapStyleBackgroundColor} = mapStyle;
  
  if (!mapStyles || !styleType) {
    return (
      <MapStyleContainer>
        <LoadingMessage>Map styles not available...</LoadingMessage>
      </MapStyleContainer>
    );
  }

  const currentStyle = mapStyles[styleType] || {};
  const editableLayers = currentStyle.layerGroups || [];

  // Use the actual editable layers from the map style
  // These come from the map style definition and have the correct isColorPickerAvailable settings
  const layersToShow = editableLayers;



  return (
    <MapStyleContainer>
      {/* Map Style Section */}
      <div style={{padding: '0 16px'}}>
        <MapStyleLabel>
          Base map
        </MapStyleLabel>

        {/* Map Style Dropdown - simplified to avoid invisible elements */}
        {isSelecting ? (
          // Show all styles when selecting + Add Map Style button
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
                  onClick={() => selectStyle(id)}
                >
                  <div className="map-title-block">
                    <img src={icon} alt={label} />
                    <div className="map-preview-name">{label}</div>
                  </div>
                </StyledMapDropdown>
              );
            })}
            
            {/* Add Map Style Button - only shown when dropdown is expanded */}
            <AddMapStyleItem onClick={handleAddMapStyle}>
              <Add />
              Add Map Style
            </AddMapStyleItem>
          </>
        ) : (
          // Show only current style when not selecting
          (() => {
            const currentStyle = mapStyles[styleType];
            if (!currentStyle) return null;
            
            const {id, custom, icon = `${cdnUrl}/${NO_BASEMAP_ICON}`, label = 'Untitled'} = currentStyle;
            
            return (
              <StyledMapDropdown
                key={id}
                $isCollapsed={false}
                $isSelected={false}
                $hasCallout={Boolean(custom)}
                onClick={toggleSelecting}
              >
                <div className="map-title-block">
                  <img src={icon} alt={label} />
                  <div className="map-preview-name">{label}</div>
                </div>
                <ArrowButton onClick={(e) => { e.stopPropagation(); toggleSelecting(); }}>
                  <ArrowDown />
                </ArrowButton>
              </StyledMapDropdown>
            );
          })()
        )}

        {/* Map Layers - exactly like original */}
        {layersToShow.length > 0 && (
          <LayerGroupContainer>
            <LayerGroupHeader>
              <LayerGroupTitle>
                Map Layers
              </LayerGroupTitle>
            </LayerGroupHeader>
            
            {layersToShow.map((layer: any) => {
              const {slug, isVisibilityToggleAvailable = true, isMoveToTopAvailable = true, isColorPickerAvailable} = layer;
              const isVisible = visibleLayerGroups?.[slug] !== false;
              const isOnTop = topLayerGroups?.[slug] || false;
              const layerColor = getLayerColor(slug, threeDBuildingColor, mapStyleBackgroundColor);
              const colorChangeHandler = getLayerColorChangeHandler(slug);
              
              // Determine if color picker should be available based on layer type and if we have a color
              const shouldShowColorPicker = isColorPickerAvailable !== false && layerColor && colorChangeHandler;
              
              // Special styling for Background layer
              if (slug === 'Background') {
                return (
                  <BackgroundLayerItem key={slug} $isVisible={isVisible}>
                    <BackgroundLayerLabel $isVisible={isVisible}>
                      {isVisibilityToggleAvailable && (
                        <IconButton
                          $active={isVisible}
                          onClick={() => handleLayerVisibilityToggle(slug, visibleLayerGroups)}
                          title={isVisible ? 'Hide layer' : 'Show layer'}
                        >
                          {isVisible ? <EyeSeen /> : <EyeUnseen />}
                        </IconButton>
                      )}
                      <span style={{marginLeft: '8px'}}>{getLayerDisplayName(slug)}</span>
                    </BackgroundLayerLabel>
                    
                    <BackgroundLayerActions>
                      {shouldShowColorPicker && (
                        <ColorPickerWrapper>
                          <LayerColorBlock
                            $color={layerColor}
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
                              color={rgbToHex(layerColor)} 
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
                          onClick={() => handleLayerMoveToTop(slug, topLayerGroups)}
                          title="Move to top"
                        >
                          <Upload />
                        </IconButton>
                      )}
                    </BackgroundLayerActions>
                  </BackgroundLayerItem>
                );
              }

              // Regular styling for other layers
              return (
                <LayerGroupItem key={slug}>
                  <LayerLabelWrapper>
                    {isVisibilityToggleAvailable && (
                      <IconButton
                        $active={isVisible}
                        onClick={() => handleLayerVisibilityToggle(slug, visibleLayerGroups)}
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
                          $color={layerColor}
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
                            color={rgbToHex(layerColor)} 
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
                        onClick={() => handleLayerMoveToTop(slug, topLayerGroups)}
                        title="Move to top"
                      >
                        <Upload />
                      </IconButton>
                    )}
                  </LayerActions>
                </LayerGroupItem>
              );
            })}
          </LayerGroupContainer>
        )}


      </div>
    </MapStyleContainer>
  );
};

export default CustomMapStyleSelector; 