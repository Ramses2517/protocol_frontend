import React from 'react';
import { css } from '@emotion/css';
import { EmptyStateIcon } from './icons';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No assets' 
}) => {
  const containerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20% 0;
    text-align: center;
  `;

  const iconStyles = css`
    margin-bottom: 16px;
  `;

  const messageStyles = css`
    overflow: hidden;
    color: #FFFFFF;
    font-family: "Chakra Petch";
    font-size: 26px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px; 
  `;

  const loadingStyles = css`
    display: flex;
    flex-direction: column;
    text-align: center;
  `;

  const loadingTextStyles = css`
    color: #FFFFFF;
    font-family: "Chakra Petch";
    font-size: 26px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px; 
    text-align: center;
    margin-top: 10px;
  `;


  return (
    <div className={containerStyles}>
      <div className={iconStyles}>
        <EmptyStateIcon />
      </div>
      <div className={messageStyles}>
        {message}
      </div>
    </div>
  );
}; 