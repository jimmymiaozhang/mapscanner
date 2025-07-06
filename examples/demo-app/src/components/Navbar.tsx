// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Logo>MapScanner</Logo>
      <MenuContainer>
        <MenuButton>File</MenuButton>
        <MenuButton>View</MenuButton>
        <MenuButton>Tools</MenuButton>
        <MenuButton>Help</MenuButton>
      </MenuContainer>
    </NavbarContainer>
  );
};

export default Navbar; 