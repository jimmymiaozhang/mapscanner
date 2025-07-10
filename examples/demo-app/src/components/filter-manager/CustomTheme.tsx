// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';

// Custom theme that extends kepler.gl's theme
export const customFilterTheme = {
  ...theme,
  
  // Override button styles
  primaryBtnBgd: '#007bff',
  primaryBtnColor: '#ffffff',
  primaryBtnBgdHover: '#0056b3',
  
  // Override text colors
  titleTextColor: '#333333',
  subtextColor: '#666666',
  subtextColorActive: '#007bff',
  
  // Override panel colors
  panelBackground: '#ffffff',
  panelBorderColor: '#e0e0e0',
  
  // Override button sizes (custom properties)
  customButtonWidth: '90px',
  customButtonHeight: '28px',
  customButtonPadding: '6px 8px',
  customButtonFontSize: '11px',
  
  // Override spacing
  sidePanelInnerPadding: '8px 12px',
  
  // Custom colors for our app
  customPrimary: '#007bff',
  customSecondary: '#6c757d',
  customSuccess: '#28a745',
  customDanger: '#dc3545',
  customWarning: '#ffc107',
  customInfo: '#17a2b8',
};

// Theme wrapper component
export const CustomThemeProvider = ({children}: {children: React.ReactNode}) => (
  <ThemeProvider theme={customFilterTheme}>
    {children}
  </ThemeProvider>
); 