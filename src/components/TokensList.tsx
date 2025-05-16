import React from 'react';
import { css } from '@emotion/css';
import { TokenCard } from './TokenCard';
import { EmptyState } from './EmptyState';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';

export interface Token {
    id: string;
    symbol: string;
    name?: string;
    price: number;
    balance?: number;
    balanceUsd?: number;
    icon?: string;
    clickable?: boolean;
}

interface TokensListProps {
    tokens: Token[];
    onTokenClick?: (tokenId: string) => void;
    title?: string;
    emptyMessage?: string;
    selectedTokenId?: string;
    isPublic?: boolean;
    nonClickableTokens?: string[];
}

export const TokensList: React.FC<TokensListProps> = ({
    tokens,
    onTokenClick,
    title,
    emptyMessage = 'No assets',
    selectedTokenId,
    isPublic = false,
    nonClickableTokens = [],
}) => {

    const {
        isTokensLoading
    } = useTonWalletContext();

    
    const tokensListStyles = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;
  `;

    const titleStyles = css`
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
  `;

    const handleTokenClick = (tokenId: string) => {
        if (nonClickableTokens.includes(tokenId) || tokens.find(t => t.id === tokenId)?.clickable === false) {
            return;
        }
        
        if (onTokenClick) {
            onTokenClick(tokenId);
        }
    };

    if (isTokensLoading) {
        return (
            <span>Loading...</span>
        );
    }

    return (
        <div className={tokensListStyles}>
            {tokens.length === 0 && !isTokensLoading ? (
                <EmptyState message={emptyMessage} />
            ) : (
                tokens.map(token => {
                    const isClickable = !nonClickableTokens.includes(token.id) && token.clickable !== false;
                    
                    return (
                        <TokenCard
                            key={token.id}
                            token={token}
                            onClick={() => handleTokenClick(token.id)}
                            selected={selectedTokenId === token.id}
                            isPublic={isPublic}
                            isClickable={isClickable}
                        />
                    );
                })
            )}
        </div>
    );
}; 