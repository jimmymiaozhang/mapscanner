// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import AppEmbedded from '../AppEmbedded';

const MapContainer = styled.div`
  flex: 1;
  background-color: #e8f4f8;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease-in-out;
  z-index: 10;
  box-shadow: -6px 0 12px rgba(0, 0, 0, 0.35), 6px 0 12px rgba(0, 0, 0, 0.35);
`;

const MapMenuButtons = styled.div`
  height: 50px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 10px;
  justify-content: center;
  position: relative;
`;

const MenuButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const MenuButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  
  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
  
  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

const MapContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  position: relative;
  
  /* Remove the gradient background when kepler.gl is loaded */
  &.kepler-loaded {
    background: none;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10;
  
  &:hover {
    background-color: white;
    color: #333;
  }
`;

const LeftToggleButton = styled(ToggleButton)<{ leftVisible: boolean }>`
  left: 10px;
`;

const RightToggleButton = styled(ToggleButton)<{ rightVisible: boolean }>`
  right: 10px;
`;

const PlaceholderText = styled.div`
  max-width: 400px;
  line-height: 1.6;
`;

// CSS Isolation Container to prevent kepler.gl layout conflicts with our sidebars
const KeplerIsolationContainer = styled.div`
  width: 100%;
  height: 100%;
  contain: layout style;
  overflow: hidden;
  position: relative;
  
  /* Isolate kepler.gl styles from affecting our custom layout */
  /* Keep all kepler.gl functionality visible for now */
  .kepler-gl {
    width: 100% !important;
    height: 100% !important;
    position: relative !important;
    /* Don't hide anything yet - we want full kepler.gl functionality visible */
  }
  
  /* Ensure proper rendering */
  .mapboxgl-map {
    width: 100% !important;
    height: 100% !important;
  }
  
  /* Prevent kepler.gl styles from leaking out to affect our sidebars */
  * {
    box-sizing: border-box;
  }
`;

interface MapAreaProps {
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const MapArea: React.FC<MapAreaProps> = ({ 
  leftSidebarVisible, 
  rightSidebarVisible, 
  onToggleLeft, 
  onToggleRight 
}) => {
  return (
    <MapContainer>
      <MapMenuButtons>
        <LeftToggleButton 
          leftVisible={leftSidebarVisible} 
          onClick={onToggleLeft}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5"/>
            {leftSidebarVisible && <rect x="2" y="2" width="6" height="16" rx="2" fill="currentColor" opacity="0.3"/>}
          </svg>
        </LeftToggleButton>
        
        <MenuButtonGroup>
          <MenuButton className="active">Map</MenuButton>
          <MenuButton>3D</MenuButton>
          <MenuButton>Satellite</MenuButton>
        </MenuButtonGroup>
        <MenuButtonGroup>
          <MenuButton>Zoom In</MenuButton>
          <MenuButton>Zoom Out</MenuButton>
          <MenuButton>Reset</MenuButton>
        </MenuButtonGroup>
        
        <RightToggleButton 
          rightVisible={rightSidebarVisible} 
          onClick={onToggleRight}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <line x1="12" y1="2" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5"/>
            {rightSidebarVisible && <rect x="12" y="2" width="6" height="16" rx="2" fill="currentColor" opacity="0.3"/>}
          </svg>
        </RightToggleButton>
      </MapMenuButtons>
      
      <MapContent className="kepler-loaded">
        <KeplerIsolationContainer>
          <AutoSizer>
            {({height, width}) => (
              <div style={{width, height}}>
                <AppEmbedded />
              </div>
            )}
          </AutoSizer>
        </KeplerIsolationContainer>
      </MapContent>
    </MapContainer>
  );
};

export default MapArea; 