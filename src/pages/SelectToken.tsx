import React from 'react';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { TokensList } from '../components/TokensList';
import { BackButton } from '../components/BackButton';

/**
 * Token selection page for buying or selling
 */
export const SelectToken: React.FC = () => {
    const navigate = useNavigate();

    const containerStyles = css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding: 24px;
        gap: 16px;
    `;

    // Approximate list of tokens (in a real application, it would be loaded from an API)
    const tokens = [
        {
            id: 'ton',
            symbol: 'TON',
            name: 'Toncoin',
            price: 6.85,
            icon: 'https://ton.org/download/ton_symbol.png'
        },
        {
            id: 'jton',
            symbol: 'jTON',
            name: 'Jetton TON',
            price: 6.84,
            icon: 'https://ton.org/download/ton_symbol.png'
        },
        {
            id: 'usdt',
            symbol: 'USDT',
            name: 'Tether USD',
            price: 1.00,
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
        },
    ];

    return (
        <div className={containerStyles}>
            <BackButton />

            <TokensList
                tokens={tokens}
                onTokenClick={(tokenId) => navigate(`/trade/${tokenId}`)}
                title="Available tokens"
            />
        </div>
    );
}; 