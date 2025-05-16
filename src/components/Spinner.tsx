import React from 'react';
import { css, keyframes } from '@emotion/css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#FFFFFF'
}) => {
  const spinAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

  const getSizeInPx = () => {
    switch (size) {
      case 'small': return '16px';
      case 'large': return '24px';
      case 'medium':
      default: return '20px';
    }
  };

  const spinnerStyles = css`
    display: inline-block;
    width: ${getSizeInPx()};
    height: ${getSizeInPx()};
    border: 2px solid ${color};
    border-radius: 50%;
    border-top-color: transparent;
    animation: ${spinAnimation} 0.8s linear infinite;
  `;

  return <div className={spinnerStyles} />;
}; 