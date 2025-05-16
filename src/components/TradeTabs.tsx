import React from 'react';
import { css } from '@emotion/css';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

type TabMode = 'buy' | 'sell';

interface TradeTabsProps {
    mode: TabMode;
    onChangeMode: (mode: TabMode) => void;
}

export const TradeTabs: React.FC<TradeTabsProps> = ({ mode, onChangeMode }) => {
    // Styles for tabs
    const tabsContainerStyles = css`
        display: flex;
        width: 100%;
        padding: 4px;
        align-items: center;
        border-radius: 12px;
        border: 1px solid #323232;
    `;

    const tabStyles = css`
        display: flex;
        padding: 8px 16px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex: 1 0 0;
        cursor: pointer;
        border-radius: 8px;
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; 

    `;

    const buyTabStyles = css`
        ${tabStyles}
        color: ${mode === 'buy' ? '#17E585' : '#F4F4F4A3'};
        background: ${mode === 'buy' ? '#323232' : 'transparent'};
    `;

    const sellTabStyles = css`
        ${tabStyles}
        color: ${mode === 'sell' ? '#FF6D6F' : '#F4F4F4A3'};
        background: ${mode === 'sell' ? '#323232' : 'transparent'};
    `;

    return (
        <div className={tabsContainerStyles}>
            <div
                className={buyTabStyles}
                onClick={() => onChangeMode('buy')}
            >
                <ArrowUpIcon color={mode === 'buy' ? '#17E585' : '#F4F4F4A3'} /> Buy
            </div>
            <div
                className={sellTabStyles}
                onClick={() => onChangeMode('sell')}
            >
                <ArrowDownIcon color={mode === 'sell' ? '#FF6D6F' : '#F4F4F4A3'} /> Sell
            </div>
        </div>
    );
}; 