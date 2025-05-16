import React from 'react';
import { css } from '@emotion/css';
import { ActionType } from './ActionTabs';

interface TransactionDetailsProps {
  mode: ActionType;
  tokenSymbol: string;
  tokenPrice: number;
  estimatedPrice: number;
  isConnected: boolean;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  mode,
  tokenSymbol,
  tokenPrice,
  estimatedPrice,
  isConnected
}) => {
  const containerStyles = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    background-color: #1E1E1E;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  `;

  const rowStyles = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 8px;
  `;

  const labelStyles = css`
    color: #999999;
  `;

  const valueStyles = css`
    color: #FFFFFF;
    font-weight: 600;
  `;

  const headerStyles = css`
    color: #FFFFFF;
    font-weight: 700;
    margin-bottom: 16px;
  `;

  const getDetailsTitle = () => {
    return mode === 'buy' ? 'Purchase Details' : 'Sale Details';
  };

  return (
    <div className={containerStyles}>
      <div className={headerStyles}>{getDetailsTitle()}</div>
      <div className={rowStyles}>
        <div className={labelStyles}>Price {tokenSymbol}</div>
        <div className={valueStyles}>${tokenPrice.toLocaleString()}</div>
      </div>
      <div className={rowStyles}>
        <div className={labelStyles}>Total Cost</div>
        <div className={valueStyles}>${estimatedPrice.toLocaleString()}</div>
      </div>
      <div className={rowStyles}>
        <div className={labelStyles}>Balance</div>
        <div className={valueStyles}>
          {mode === 'buy' ?
            isConnected ? '$100.00 USDT' : '$0.00 USDT' :
            isConnected ? `0.01 ${tokenSymbol}` : `0.00 ${tokenSymbol}`}
        </div>
      </div>
    </div>
  );
}; 