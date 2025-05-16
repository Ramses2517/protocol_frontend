import React from 'react';
import { css } from '@emotion/css';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ErrorIcon } from './icons/ErrorIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface TonConnectCustomButtonProps {
  fullWidth?: boolean;
  className?: string;
}

export const TonConnectCustomButton: React.FC<TonConnectCustomButtonProps> = ({
  fullWidth = true,
  className = '',
}) => {
  const { wallet, isConnected, isLoading, error, connectWallet, disconnectWallet } = useTonWalletContext();

  const walletAddressStyles = css`
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #999999;
  `;

  const connectedContainerStyles = css`
    display: flex;
    align-items: center;
    justify-content: ${fullWidth ? 'space-between' : 'flex-end'};
    width: ${fullWidth ? '100%' : 'auto'};
  `;

  const errorContainerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: ${fullWidth ? '100%' : 'auto'};
  `;

  const errorMessageStyles = css`
    color: #FF6D6F;
    text-align: left;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    gap: 12px;
  `;

  const errorIconContainerStyles = css`
    width: 24px;
    height: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(255, 109, 111, 0.16);
  `;

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && wallet) {
    return (
      <div className={connectedContainerStyles}>
        {wallet.account.address && (
          <div className={walletAddressStyles}>
            {formatAddress(wallet.account.address)}
          </div>
        )}
        <Button
          variant="secondary"
          onClick={disconnectWallet}
          fullWidth={false}
          className={className}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={errorContainerStyles}>
        <div className={errorMessageStyles}>
          <div className={errorIconContainerStyles}>
            <ErrorIcon color="#FF5252" />
          </div>
          Failed to connect wallet
        </div>
        <Button
          variant="primary"
          onClick={connectWallet}
          fullWidth={fullWidth}
          className={className}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={connectWallet}
      disabled={isLoading}
      fullWidth={fullWidth}
      className={className}
      leftIcon={isLoading ? <SpinnerIcon /> : undefined}
      isLoading={isLoading}
    >
      {isLoading ? '' : 'Connect TON wallet'}
    </Button>
  );
}; 