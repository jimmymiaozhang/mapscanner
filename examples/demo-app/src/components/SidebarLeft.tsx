// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

interface SidebarContainerProps {
  isVisible: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
  width: ${props => props.isVisible ? '320px' : '0px'};
  min-width: ${props => props.isVisible ? '320px' : '0px'};
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  
  .sidebar-content {
    width: 320px;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(-100%)'};
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

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const PlaceholderContent = styled.div`
  color: #666;
  font-style: italic;
  margin-top: 20px;
`;

interface SidebarLeftProps {
  onToggle: () => void;
  isVisible: boolean;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onToggle, isVisible }) => {
  return (
    <SidebarContainer isVisible={isVisible}>
      <div className="sidebar-content">
        <MenuButtons>
          <MenuButton className="active">Layers</MenuButton>
          <MenuButton>Filters</MenuButton>
          <MenuButton>Data</MenuButton>
        </MenuButtons>
        <ContentArea>
          <h3>Left Sidebar</h3>
          <PlaceholderContent>
            This is the left sidebar content area. 
            This will eventually contain layer controls, 
            data management, and filtering options.
          </PlaceholderContent>
        </ContentArea>
      </div>
    </SidebarContainer>
  );
};

export default SidebarLeft; 