import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { Button } from '../components/Button';
import { TokensList, Token as UIToken } from '../components/TokensList';
import { SortOptions, SortOption } from '../components/SortOptions';
import { WalletHeader } from '../components/WalletHeader';
import { DepositArrowIcon, WithdrawArrowIcon } from '../components/icons';
import { getFormattedValue } from '../shared/utils/getFormattedValue';
export const Portfolio: React.FC = () => {
    const navigate = useNavigate();
    const {
        portfolioTotal,
        portfolioTokens,
        isConnected,
        shouldRedirectToDeposit,
        isTokensLoading,
        setRedirectShown
    } = useTonWalletContext();

    // Перенаправляем на страницу депозита только если пользователь пришел со страницы StartPage,
    // подключил кошелек и у него нет токенов в протоколе
    useEffect(() => {
        if (shouldRedirectToDeposit && isConnected && portfolioTokens.length === 0) {
            setRedirectShown(); // Отмечаем, что редирект был показан
            navigate('/deposit', { state: { newUser: true } });
        }
    }, [shouldRedirectToDeposit, isConnected, portfolioTokens, navigate, setRedirectShown]);

    // States for filtering and sorting
    const [filteredTokens, setFilteredTokens] = useState<UIToken[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<SortOption>('');

    // Convert API tokens to UI tokens and update filtered tokens when token list changes
    useEffect(() => {
        const uiTokens = portfolioTokens.map(token => ({
            id: token.token_mint, // Используем token_mint как ID
            symbol: token.symbol,
            price: token.price || 0,
            balance: token.balance || 0,
            balanceUsd: token.balanceUsd || 0,
            icon: token.logo_url || ''
        }));
        setFilteredTokens(uiTokens);
    }, [portfolioTokens]);

    // Applying filter for sorting
    const handleSortChange = (option: SortOption) => {
        setSelectedFilter(option === selectedFilter ? '' : option);

        let sortedTokens = [...filteredTokens];

        switch (option) {
            case 'high-low':
                sortedTokens.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'low-high':
                sortedTokens.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            default:
                // By default, sort by balance
                sortedTokens.sort((a, b) => {
                    const balanceA = a.balance || 0;
                    const balanceB = b.balance || 0;
                    return balanceB - balanceA;
                });
                break;
        }

        setFilteredTokens(sortedTokens);
    };

    // Styles for the page
    const portfolioStyles = css`
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-bottom: 24px;
        height: 100vh;
        overflow: hidden;
    `;

    const contentContainerStyles = css`
        display: flex;
        width: 100%;
        flex-direction: column;
        max-width: 1200px;
        margin: 0 auto;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        overflow-y: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE и Edge */
        &::-webkit-scrollbar {
            display: none; /* Chrome, Safari и Opera */
        }
        flex: 1;
    `;

    const headerStyles = css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    `;

    const balanceCardStyles = css`
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-bottom: 16px;
    `;

    const balanceLabelStyles = css`
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        color: #F4F4F4A3;
    `;

    const totalBalanceStyles = css`
        color: #FFFFFF;
        text-align: center;
        font-family: "Chakra Petch";
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: 42px;
        margin-bottom: 28px;
    `;

    const actionsStyles = css`
        display: flex;
        flex-direction: row;
        gap: 12px;
    `;

    const buttonStyles = css`
        flex: 1;
        display: flex;
        
        & > button {
            height: 44px;
        }
    `;

    const sectionTitleStyles = css`
        font-size: 18px;
        font-weight: bold;
        margin: 16px 0;
    `;

    const tokensListStyles = css`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;

    const sortingStyles = css`
        margin-bottom: 20px;
    `;
    
    const horizontalLineStyles = css`
        height: 1px;
        background-color: #323232;
        width: calc(100% + 32px);
        margin: 0 -16px 16px -16px;
    `;

    const tokensContainerStyles = css`
        overflow-y: visible;
        margin-bottom: 20vh;
    `;

    // Button handlers
    const handleDeposit = () => {
        navigate('/deposit', { state: { from: 'portfolio' } });
    };

    const handleWithdraw = () => {
        navigate('/withdraw');
    };

    // Wallet connection check
    if (!isConnected) {
        return (
            <div className={contentContainerStyles}>
                <div className={balanceCardStyles}>
                    <p>You need to connect your wallet to access the portfolio.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={portfolioStyles}>
            {/* Wallet header with address and TON balance */}
            <WalletHeader />

            <div className={contentContainerStyles}>
                {/* Card with total balance in protocol */}
                <div className={balanceCardStyles}>
                    <div className={balanceLabelStyles}>Total in Frog Protocol</div>
                    <div className={totalBalanceStyles}>{getFormattedValue(portfolioTotal, true)}</div>

                    {/* Action buttons */}
                    <div className={actionsStyles}>
                        <div className={buttonStyles}>
                            <Button
                                leftIcon={<DepositArrowIcon />}
                                onClick={handleDeposit}
                                variant="primary"
                                fullWidth
                            >
                                Deposit
                            </Button>
                        </div>
                        <div className={buttonStyles}>
                            <Button
                                leftIcon={<WithdrawArrowIcon />}
                                onClick={handleWithdraw}
                                variant="action"
                                fullWidth
                            >
                                Withdraw
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Горизонтальная линия, игнорирующая паддинги */}
                <div className={horizontalLineStyles}></div>

                {/* Sorting component - показываем только если есть токены */}
                {filteredTokens.length > 0 && (
                    <div className={sortingStyles}>
                        <SortOptions
                            selectedOption={selectedFilter}
                            onSortChange={handleSortChange}
                        />
                    </div>
                )}

                {/* Portfolio token list */}
                <div className={tokensContainerStyles}>
                    <TokensList
                        tokens={filteredTokens}
                        onTokenClick={(tokenId) => navigate(`/trade/${tokenId}`)}
                        title="Your assets"
                        emptyMessage="You don't have any assets yet"
                        nonClickableTokens={['usdt']}
                    />
                </div>
            </div>
        </div>
    );
};