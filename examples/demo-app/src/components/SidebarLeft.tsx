// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import {wrapTo, setBackgroundColor} from '@kepler.gl/actions';
import {RGBColor} from '@kepler.gl/types';
import CustomMapStyleSelector from './CustomMapStyleSelector';

interface SidebarContainerProps {
  $isVisible: boolean;
}

const SidebarContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isVisible'
})<SidebarContainerProps>`
  width: ${props => props.$isVisible ? '320px' : '0px'};
  min-width: ${props => props.$isVisible ? '320px' : '0px'};
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  z-index: 1;
  
  .sidebar-content {
    width: 320px;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
  }
`;

const MenuButtons = styled.div`
  height: 50px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 10px;
`;

const MenuButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isActive'
})<{$isActive?: boolean}>`
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
  
  ${props => props.$isActive && `
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  `}
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const TabContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isVisible'
})<{$isVisible: boolean}>`
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const PlaceholderContent = styled.div`
  color: #666;
  font-style: italic;
  margin-top: 20px;
`;

interface SidebarLeftProps {
  onToggle: () => void;
  isVisible: boolean;
  keplerGlId?: string;
}

// Define the available tabs
type TabType = 'styles' | 'layers' | 'filters' | 'data';

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onToggle, isVisible, keplerGlId = 'map' }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('styles');

  // Get backgroundColor from kepler.gl state
  const backgroundColor = useSelector((state: any) => 
    state.keplerGl?.[keplerGlId]?.mapStyle?.backgroundColor || [0, 0, 0]
  );

  // Handle background color change
  const handleBackgroundColorChange = useCallback((color: RGBColor) => {
    dispatch(wrapTo(keplerGlId, setBackgroundColor(color)));
  }, [dispatch, keplerGlId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'styles':
        return (
          <TabContent $isVisible={true}>
            <CustomMapStyleSelector 
              keplerGlId={keplerGlId}
              backgroundColor={backgroundColor}
              onBackgroundColorChange={handleBackgroundColorChange}
            />
          </TabContent>
        );
      case 'layers':
        return (
          <TabContent $isVisible={true}>
            <h3>Layers</h3>
            <PlaceholderContent>
              Layer controls and management will be implemented here.
            </PlaceholderContent>
          </TabContent>
        );
      case 'filters':
        return (
          <TabContent $isVisible={true}>
            <h3>Filters</h3>
            <PlaceholderContent>
              Data filtering options will be available here.
            </PlaceholderContent>
          </TabContent>
        );
      case 'data':
        return (
          <TabContent $isVisible={true}>
            <h3>Data</h3>
            <PlaceholderContent>
              Data import and management features will be located here.
            </PlaceholderContent>
          </TabContent>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarContainer $isVisible={isVisible}>
      <div className="sidebar-content">
        <MenuButtons>
          <MenuButton 
            $isActive={activeTab === 'styles'}
            onClick={() => setActiveTab('styles')}
          >
            Styles
          </MenuButton>
          <MenuButton 
            $isActive={activeTab === 'layers'}
            onClick={() => setActiveTab('layers')}
          >
            Layers
          </MenuButton>
          <MenuButton 
            $isActive={activeTab === 'filters'}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </MenuButton>
          <MenuButton 
            $isActive={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
          >
            Data
          </MenuButton>
        </MenuButtons>
        <ContentArea>
          {renderTabContent()}
        </ContentArea>
      </div>
    </SidebarContainer>
  );
};

export default SidebarLeft; 