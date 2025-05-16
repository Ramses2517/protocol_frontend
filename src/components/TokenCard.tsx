import React, { useState } from 'react';
import { css } from '@emotion/css';
import { NoPic } from './icons';
import { Token } from './TokensList';
import { getFormattedValue } from '../shared/utils/getFormattedValue';

interface TokenCardProps {
  token: Token;
  onClick?: (tokenId: string) => void;
  selected?: boolean;
  isPublic?: boolean;
  isClickable?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onClick,
  selected = false,
  isPublic = false,
  isClickable = true
}) => {
  const [imageError, setImageError] = useState(false);

  const tokenCardStyles = css`
    border-radius: 8px;
    cursor: ${isClickable ? 'pointer' : 'default'};
    transition: all 0.2s ease;
    border: 1px solid ${selected ? '#17E585' : 'transparent'};
  `;

  const tokenInfoStyles = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
  `;

  const tokenNameStyles = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  `;

  const nameContainerStyles = css`
    min-width: 0;
    flex: 1;
  `;

  const logoStyles = css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `;

  const symbolStyles = css`
    overflow: hidden;
    color: #FFF;
    text-overflow: ellipsis;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600; 
    line-height: 20px; 
  `;

  const priceContainerStyles = css`
    text-align: right;
    flex-shrink: 0;
  `;

  const priceStyles = css`
    font-family: "DM Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; 
    color: #F4F4F4A3;
  `;

  const balanceStyles = css`
    overflow: hidden;
    color: #FFF;
    text-overflow: ellipsis;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; 
  `;

  const quantityStyles = css`
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; 
    color: #F4F4F4A3;
  `;



  const handleClick = () => {
    if (onClick && isClickable) {
      onClick(token.id);
    }
  };

  // Processing image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate the token balance in USD
  const balanceInUsd = token.balance && token.price
    ? (token.balance * token.price)
    : 0;

  return (
    <div className={tokenCardStyles} onClick={handleClick}>
      <div className={tokenInfoStyles}>
        <div className={tokenNameStyles}>
          <div className={logoStyles}>
            {!token.icon || imageError ? (
              <NoPic />
            ) : (
              <img
                src={token.icon}
                alt={token.symbol}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={handleImageError}
              />
            )}
          </div>
          <div className={nameContainerStyles}>
            <div className={symbolStyles}>{token.symbol}</div>
            <div className={priceStyles}>{getFormattedValue(token.price, true)}</div>
          </div>
        </div>
        {!isPublic && (
          <div className={priceContainerStyles}>
            <div className={balanceStyles}>
              {token.balance ? getFormattedValue(token.balance, false) : 0}
            </div>
            <div className={quantityStyles}>
              {getFormattedValue(balanceInUsd, true)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 