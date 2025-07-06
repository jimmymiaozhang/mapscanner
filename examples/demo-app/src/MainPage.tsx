// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';

// Placeholder components
import Navbar from './components/Navbar';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import MapArea from './components/MapArea';

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;
  background-color: #f5f5f5;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px); /* Subtract navbar height */
  overflow: hidden; /* Prevent scrollbars during animation */
`;

const MainPage: React.FC = () => {
  // State for controlling sidebar visibility
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible(!leftSidebarVisible);
  };

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);
  };

  return (
    <MainContainer>
      <Navbar />
      <ContentContainer>
        <SidebarLeft 
          onToggle={toggleLeftSidebar} 
          isVisible={leftSidebarVisible}
        />
        <MapArea
          leftSidebarVisible={leftSidebarVisible}
          rightSidebarVisible={rightSidebarVisible}
          onToggleLeft={toggleLeftSidebar}
          onToggleRight={toggleRightSidebar}
        />
        <SidebarRight 
          onToggle={toggleRightSidebar} 
          isVisible={rightSidebarVisible}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default MainPage; 