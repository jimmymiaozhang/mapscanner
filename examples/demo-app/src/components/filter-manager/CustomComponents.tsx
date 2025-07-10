// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Icons} from '@kepler.gl/components';

// Custom styled button
const CustomButton = styled.button`
  width: 90px !important;
  max-width: 90px !important;
  padding: 6px 8px !important;
  font-size: 11px !important;
  height: 28px !important;
  border-radius: 4px !important;
  border: 1px solid #ddd;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 12px !important;
    height: 12px !important;
  }
`;

// Custom Add Data Button
export const CustomAddDataButton = ({onClick}: {onClick: () => void}) => (
  <CustomButton onClick={onClick}>
    <Icons.Add height="12px" />
    <span>Add Data</span>
  </CustomButton>
);

// Custom Add Filter Button
export const CustomAddFilterButton = ({
  datasets, 
  onAdd, 
  disabled = false
}: {
  datasets: any;
  onAdd: (dataId: string) => void;
  disabled?: boolean;
}) => {
  const handleClick = () => {
    if (Object.keys(datasets).length === 1) {
      onAdd(Object.keys(datasets)[0]);
    }
  };

  return (
    <CustomButton 
      onClick={handleClick} 
      disabled={disabled || !Object.keys(datasets).length}
    >
      <Icons.Add height="12px" />
      <span>Add Filter</span>
    </CustomButton>
  );
};

// Custom Panel Title
export const CustomPanelTitle = ({
  title, 
  children
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
    color: '#666'
  }}>
    <span>{title}</span>
    {children}
  </div>
);

// Custom Dataset Count Display
export const CustomDatasetTitle = ({
  datasets
}: {
  datasets: any;
}) => {
  const count = Object.keys(datasets).length;
  return (
    <span>
      Datasets{count > 0 ? `(${count})` : ''}
    </span>
  );
}; 