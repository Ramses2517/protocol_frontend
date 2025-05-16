import React from 'react';
import { css } from '@emotion/css';
import { NoPic } from './icons';
import { getFormattedValue } from '../shared/utils/getFormattedValue';

interface TokenInfoProps {
  symbol: string;
  price: number;
  icon?: string;
  balance?: number;  // Баланс токена с учетом decimals 
  usdtBalance?: number; // Баланс USDT с учетом decimals (для режима покупки)
  isBuyMode?: boolean; // Режим покупки/продажи
}

/**
 * Component for displaying token information
 */
export const TokenInfo: React.FC<TokenInfoProps> = ({
  symbol,
  price,
  icon,
  balance = 0,
  usdtBalance = 0,
  isBuyMode = false
}) => {
  const containerStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 32px;
    background: #323232;
    padding: 4px 16px 4px 4px;
    margin-bottom: 16px;
  `;

  const contentContainerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;

  const symbolStyles = css`
    font-family: "DM Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; 
    color: #FFFFFF;
  `;
  
  const priceDisplayStyles = css`
    font-family: "DM Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: #F4F4F4A3;
  `;

  const balanceDisplayStyles = css`
    font-family: "DM Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: #F4F4F4A3;
  `;

  const iconStyles = css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  return (
    <div className={containerStyles}>
      <div className={iconStyles}>
        {icon ? (
          <img src={icon} alt={symbol} width="32" height="32" />
        ) : (
          <NoPic />
        )}
      </div>
      <div className={contentContainerStyles}>
        <div className={symbolStyles}>
          {getFormattedValue(balance, false)+' '+symbol}
        </div>
        <div className={priceDisplayStyles}>
          ${price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}; 