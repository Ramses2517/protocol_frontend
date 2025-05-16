import React from 'react';
import { css } from '@emotion/css';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { AvatarIcon, UsdtSmallIcon, ScanLinkIcon, DisconnectIcon } from './icons';
import { getTonAddress } from '../shared/utils/getTonAddress';
import { getFormattedValue } from '../shared/utils/getFormattedValue';
export const WalletHeader: React.FC = () => {
    const { wallet, isConnected, onChainUsdtBalance, disconnectWallet } = useTonWalletContext();

    const formatWalletAddress = (address: string) => {
        const start = address.substring(0, 4);
        const end = address.substring(address.length - 4);
        return `${start}...${end}`;
    };

    const openInTonscan = () => {
        if (!wallet?.account?.address) return;

        const tonscanUrl = `https://tonscan.org/address/${wallet.account.address}`;
        window.open(tonscanUrl, '_blank');
    };

    const hasPositiveBalance = onChainUsdtBalance > 0;

    const containerStyles = css`
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 0px;
        padding-left: 16px;
        padding-right: 16px;
    `;

    const headerStyles = css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    `;

    const walletInfoStyles = css`
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    const walletDataStyles = css`
        display: flex;
        flex-direction: row;
        align-items: center;
    `;

    const addressStyles = css`
        color: #FFFFFF;
        text-align: center;
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px; 
    `;

    const walletActionsStyles = css`
        margin-left: 8px;
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
    `;

    const actionIconStyles = css`
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
        
    `;

    const tonscanIconStyles = css`
        ${actionIconStyles}
        background-color: #323232;
    `;

    const disconnectIconStyles = css`
        ${actionIconStyles}
        background-color: #FF6D6F29;
    
    `;

    const dividerStyles = css`
        height: 20px;
        width: 1px;
        background-color: #323232;
    `;

    const balanceStyles = css`
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    const balanceValueStyles = css`
        color: #FFFFFF;
        text-align: center;
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
    `;

    const notificationStyles = css`
        display: flex;
        padding: 12px;
        align-items: center;
        gap: 12px;
        align-self: stretch;
        border-radius: 8px;
        background: #323232;
        color: #FFFFFF;
        text-align: center;
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        justify-content: center;
        margin-top: 16px;

    `;
    
    const horizontalLineStyles = css`
        height: 1px;
        background-color: #323232;
        width: calc(100% + 32px);
        margin: 0 -16px;
        margin-top: 16px;
    `;

    const usdtStyles = css`
        color: #F4F4F4A3
    `;

    if (!isConnected) return null;

    return (
        <div className={containerStyles}>
            <div className={headerStyles}>
                <div className={walletDataStyles}>
                    <div className={walletInfoStyles}>
                        <AvatarIcon />
                        <div className={addressStyles}>
                            {formatWalletAddress(getTonAddress({ address: wallet?.account?.address || '', bounce: false }))}
                        </div>
                    </div>
                    
                    <div className={walletActionsStyles}>
                        <div className={tonscanIconStyles} onClick={openInTonscan} title="View on TONscan">
                            <ScanLinkIcon />
                        </div>
                        <div className={disconnectIconStyles} onClick={disconnectWallet} title="Disconnect wallet">
                            <DisconnectIcon />
                        </div>
                    </div>
                </div>
                
                <div className={dividerStyles} />
                
                <div className={balanceStyles}>
                    <UsdtSmallIcon />
                    <div className={balanceValueStyles}>
                        {getFormattedValue(onChainUsdtBalance, false)} <span className={usdtStyles}>USDT</span>
                    </div>
                </div>
            </div>
            
            {hasPositiveBalance && (
                <div className={notificationStyles}>
                    🔥 You have free USDT – start earning!
                </div>
            )}
            
            <div className={horizontalLineStyles} />
        </div>
    );
}; 