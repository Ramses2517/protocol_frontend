import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { SearchBar } from '../components/SearchBar';
import { SortOptions, SortOption } from '../components/SortOptions';
import { TokensList, Token as UIToken } from '../components/TokensList';

export const SearchTokens: React.FC = () => {
    const navigate = useNavigate();
    const { publicTokens, searchTokens, getRecentTokens, isConnected, isTokensLoading, isInitialLoadingCompleted } = useTonWalletContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UIToken[]>([]);
    const [recentTokens, setRecentTokens] = useState<UIToken[]>([]);
    const [sortedTokens, setSortedTokens] = useState<UIToken[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState<SortOption>('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Преобразуем API токены в формат UI токенов
    const convertToUIToken = (token: any): UIToken => ({
        id: token.address,
        symbol: token.symbol,
        price: token.price || 0,
        balance: 0, // Для публичных токенов баланс всегда 0
        balanceUsd: 0, // Для публичных токенов стоимость всегда 0
        icon: token.logo_url || ''
    });

    // Преобразуем строковые идентификаторы токенов в UI токены
    const convertRecentTokenIdsToUITokens = (recentIds: string[]): UIToken[] => {
        return recentIds
            .map(id => {
                const token = publicTokens.find(t => t.address === id);
                if (!token) return null;
                return convertToUIToken(token);
            })
            .filter((token): token is UIToken => token !== null);
    };

    // Загрузка списков токенов при монтировании компонента
    useEffect(() => {
        const loadData = async () => {
            try {
                // Загрузка недавних токенов из API
                const recentIds = await getRecentTokens();
                const uiRecentTokens = convertRecentTokenIdsToUITokens(recentIds);
                setRecentTokens(uiRecentTokens);
                
                // Инициализация отсортированных токенов
                const uiTokens = publicTokens.map(convertToUIToken);
                setSortedTokens(uiTokens);
            } catch (error) {
                setRecentTokens([]);
            }
        };

        loadData();
    }, [getRecentTokens, publicTokens]);

    // Обработка поиска токенов при изменении searchQuery
    useEffect(() => {
        const doSearch = async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const results = await searchTokens(searchQuery);
                    const uiResults = results.map(convertToUIToken);
                    setSearchResults(uiResults);
                } catch (error) {
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        };

        doSearch();
    }, [searchQuery, searchTokens]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleCancel = () => {
        navigate(-1); // Возврат на предыдущую страницу
    };

    const handleTokenClick = (tokenId: string) => {
        // Проверяем, авторизован ли пользователь
        if (isConnected) {
            navigate(`/trade/${tokenId}`);
        } else {
            // Если пользователь не авторизован, показываем сообщение или перенаправляем на страницу авторизации
            navigate('/', { state: { redirectTo: `/trade/${tokenId}` } });
        }
    };

    // Обработка изменения сортировки
    const handleSortChange = (option: SortOption) => {
        setSelectedSortOption(option);

        if (searchQuery) {
            // Если есть поисковый запрос, сортируем только результаты поиска
            let sortedResults = [...searchResults];

            switch (option) {
                case 'high-low':
                    sortedResults.sort((a, b) => (b.price || 0) - (a.price || 0));
                    break;
                case 'low-high':
                    sortedResults.sort((a, b) => (a.price || 0) - (b.price || 0));
                    break;
                default:
                    // По умолчанию не сортируем
                    break;
            }

            setSearchResults(sortedResults);
        } else {
            // Если нет поискового запроса, сортируем оба списка
            let sortedAllTokens = [...sortedTokens];
            let sortedRecentTokens = [...recentTokens];

            switch (option) {
                case 'high-low':
                    sortedAllTokens.sort((a, b) => (b.price || 0) - (a.price || 0));
                    sortedRecentTokens.sort((a, b) => (b.price || 0) - (a.price || 0));
                    break;
                case 'low-high':
                    sortedAllTokens.sort((a, b) => (a.price || 0) - (b.price || 0));
                    sortedRecentTokens.sort((a, b) => (a.price || 0) - (b.price || 0));
                    break;
                default:
                    // По умолчанию не сортируем
                    break;
            }

            // Обновляем оба списка
            setRecentTokens(sortedRecentTokens);
            // Обновляем локальное состояние отсортированных токенов
            setSortedTokens(sortedAllTokens);
        }
    };

    // Стили
    const containerStyles = css`
        display: flex;
        flex-direction: column;
        padding: 16px 16px 40px 16px;
    `;

    const searchBarContainerStyles = css`
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        gap: 16px;
    `;

    const searchBarWrapperStyles = css`
        flex: 1;
    `;

    const dividerLineStyles = css`
        border-top: 1px solid var(--Stroke-Primary, #323232);
        margin: 16px -16px 16px -16px;
        width: calc(100% + 32px);
    `;

    const cancelButtonStyles = css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        cursor: pointer;  
        color: #17E585;
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px; /* 125% */   

    `;

    const sectionTitleStyles = css`
        font-family: "DM Sans"; 
        color: #F4F4F4A3;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 16px; /* 133.333% */  
        margin-top: 16px;
        margin-bottom: 16px;
    `;

    const loadingStyles = css`
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-top: 70%;
    `;

    const emptyStateContainerStyles = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30% 0;
        text-align: center;
    `;

    const emptyStateIconStyles = css`
        margin-bottom: 16px;
    `;

    const emptyStateMessageStyles = css`
        overflow: hidden;
        color: #FFFFFF;
        font-family: "Chakra Petch";
        font-size: 26px;
        font-style: normal;
        font-weight: 600;
        line-height: 34px; 
    `;

    const renderContent = () => {

        return (
            <>
                {!searchQuery && sortedTokens.length > 0 && (
                    <SortOptions
                        selectedOption={selectedSortOption}
                        onSortChange={handleSortChange}
                    />
                )}

                {!searchQuery && recentTokens.length > 0 && (
                    <>
                        <div className={sectionTitleStyles}>Recent</div>
                        <TokensList
                            tokens={recentTokens}
                            onTokenClick={handleTokenClick}
                            isPublic={true}
                        />
                    </>
                )}

                {!searchQuery && (
                    <>
                        {sortedTokens.length > 0 && <div className={sectionTitleStyles}>All tokens</div>}
                        <TokensList
                            tokens={sortedTokens}
                            onTokenClick={handleTokenClick}
                            emptyMessage="No assets"
                            isPublic={true}
                        />
                    </>
                )}

                {searchQuery && (
                    <TokensList
                        tokens={searchResults}
                        onTokenClick={handleTokenClick}
                        isPublic={true}
                    />
                )}
            </>
        );
    };


    return (
        <div className={containerStyles}>
            <div className={searchBarContainerStyles}>
                <div className={searchBarWrapperStyles}>
                    <SearchBar
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClear={handleClearSearch}
                    />
                </div>
                <div className={cancelButtonStyles} onClick={handleCancel}>
                    Cancel
                </div>
            </div>

            {/* Разделительная линия */}
            <div className={dividerLineStyles}></div>

            {renderContent()}
        </div>
    );
}; 