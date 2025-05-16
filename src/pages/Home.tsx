import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { TokensList, Token as UIToken } from '../components/TokensList';
import { Button } from '../components/Button';
import { TonConnectCustomButton } from '../components/TonConnectCustomButton';
import { SearchBar } from '../components/SearchBar';
import { BalanceArrow } from '../components/icons';
import { SortOptions, SortOption } from '../components/SortOptions';
import { getFormattedValue } from '../shared/utils/getFormattedValue';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { publicTokens, searchTokens, isConnected, usdtBalance, isTokensLoading } = useTonWalletContext();

    // Состояния для поиска и фильтрации
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTokens, setFilteredTokens] = useState<UIToken[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<SortOption>('');

    // Обработка изменения строки поиска
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Очистка поля поиска
    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
    };

    // Выполнение поиска при изменении запроса
    useEffect(() => {
        const performSearch = async () => {
            if (searchQuery.trim()) {
                const results = await searchTokens(searchQuery);
                const uiTokens = results.map(token => ({
                    id: token.address,
                    symbol: token.symbol,
                    price: token.price || 0,
                    balance: 0, // Для публичных токенов баланс всегда 0
                    balanceUsd: 0, // Для публичных токенов стоимость всегда 0
                    icon: token.logo_url || ''
                }));
                setFilteredTokens(uiTokens);
            } else {
                const uiTokens = publicTokens.map(token => ({
                    id: token.address,
                    symbol: token.symbol,
                    price: token.price || 0,
                    balance: 0, // Для публичных токенов баланс всегда 0
                    balanceUsd: 0, // Для публичных токенов стоимость всегда 0
                    icon: token.logo_url || ''
                }));
                setFilteredTokens(uiTokens);
            }
        };

        performSearch();
    }, [searchQuery, publicTokens, searchTokens]);

    // Применение фильтра
    const handleSortChange = (option: SortOption) => {
        setSelectedFilter(option);

        let sortedTokens = [...filteredTokens];

        switch (option) {
            case 'high-low':
                sortedTokens.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'low-high':
                sortedTokens.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            default:
                // По умолчанию не сортируем
                break;
        }

        setFilteredTokens(sortedTokens);
    };

    // Стили для страницы
    const homeStyles = css`
        display: flex;
        flex-direction: column;
        padding: 16px 16px 0 16px;
    `;

    const tokenListStyles = css`
        margin-bottom: ${isConnected ? '120px' : '200px'};
    `;

    // Стили для кнопки подключения кошелька
    const connectWalletContainerStyles = css`
        position: fixed;
        bottom: 84px;
        left: 0;
        right: 0;
        padding: 16px;
        display: flex;
        justify-content: center;
        background-color: #111312;
        border-top: 1px solid #323232;
        z-index: 10;
    `;

    const walletButtonContainerStyles = css`
        width: 100%;
    `;

    // Стили для отображения баланса USDT
    const balanceContainerStyles = css`
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
    `;

    const balanceLabelStyles = css`
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        color: #F4F4F4A3;
    `;

    const balanceValueContainerStyles = css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    `;

    const balanceValueStyles = css`
        font-family: "Chakra Petch";
        color: #FFFFFF;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: 42px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        cursor: pointer;
    `;

    const searchBarContainerStyles = css`
        margin-bottom: 16px;
    `;

    const dividerLineStyles = css`
        border-top: 1px solid var(--Stroke-Primary, #323232);
        margin: 0 -16px 16px -16px;
        width: calc(100% + 32px);
    `;

    const sortOptionsContainerStyles = css`
        margin-bottom: 20px;
    `;

    const loadingStyles = css`
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-top: 70%;
    `;

    // Function for navigating to token trading page
    const handleTokenClick = (tokenId: string) => {
        navigate(`/trade/${tokenId}`);
    };

    // Function for navigating to portfolio page
    const handleBalanceClick = () => {
        navigate('/portfolio');
    };

    // Добавляем обработчик для перехода на страницу поиска
    const handleSearchClick = () => {
        navigate('/search');
    };

    // Отображение результатов поиска или пустого состояния
    const renderTokenList = () => {
        return (
            <div className={tokenListStyles}>   
                <TokensList
                    tokens={filteredTokens}
                    emptyMessage="No assets"
                    onTokenClick={handleTokenClick}
                    isPublic={true} // Устанавливаем isPublic=true для всех токенов
                />
            </div>
        );
    };
    return (
        <div className={homeStyles}>
            {/* Поисковая строка */}
            <div className={searchBarContainerStyles}>
                <SearchBar
                    onClick={handleSearchClick}
                    readOnly={true}
                />
            </div>

            {isConnected && (
                <div className={balanceContainerStyles} onClick={handleBalanceClick}>
                    <div className={balanceLabelStyles}>
                        Balance
                    </div>
                    <div className={balanceValueStyles}>
                        {getFormattedValue(usdtBalance, true)}
                        <BalanceArrow />
                    </div>
                </div>
            )}

            {/* Разделительная линия */}
            <div className={dividerLineStyles}></div>

            {/* Компонент сортировки - показываем только если есть токены */}
            {filteredTokens.length > 0 && (
                <div className={sortOptionsContainerStyles}>
                    <SortOptions
                        selectedOption={selectedFilter}
                        onSortChange={handleSortChange}
                    />
                </div>
            )}

            {renderTokenList()}

            {/* Кнопка подключения кошелька */}
            {
                !isConnected && (
                    <div className={connectWalletContainerStyles}>
                        <div className={walletButtonContainerStyles}>
                            <TonConnectCustomButton fullWidth={true} />
                        </div>
                    </div>
                )
            }
        </div >
    );
}; 