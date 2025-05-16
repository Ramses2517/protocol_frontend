import React from 'react';


export type ActionType = 'buy' | 'sell';


export const ActionTabs: React.FC<{
    activeTab: ActionType;
    onTabChange: (tab: ActionType) => void;
}> = ({ activeTab, onTabChange }) => {
    return (
        <div>
            <button onClick={() => onTabChange('buy')} disabled={activeTab === 'buy'}>
                Buy
            </button>
            <button onClick={() => onTabChange('sell')} disabled={activeTab === 'sell'}>
                Sell
            </button>
        </div>
    );
}; 