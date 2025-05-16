import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import {
  authenticateUser,
  addWallet,
  getTokens as fetchTokens,
  getUserTokens,
  getRecentTokens as fetchRecentTokens,
  getTokenPrice,
  getOnChainUsdtBalance,
  getUserUsdtBalance,
  getUsdtJettonWallet,
  buyToken as apiBuyToken,
  sellToken as apiSellToken,
  withdrawUsdt as apiWithdrawUsdt,
  Token,
  UserToken,
  TransactionResult
} from '../utils';
import { getTonAddress } from '../utils/getTonAddress';

// Тип для токенов портфолио
interface PortfolioToken {
  token_mint: string;
  symbol: string;
  balance: number;
  price: number;
  logo_url: string | null;
  decimals: number;
  balanceUsd: number;
}

// Тип для упрощенного отображения токенов на страницах home и search
interface PublicToken {
  address: string;
  symbol: string;
  logo_url: string | null;
  price: number;
  decimals: number;
  balance?: number; // Опциональное поле, всегда будет 0 для публичных токенов
  balanceUsd?: number; // Опциональное поле, всегда будет 0 для публичных токенов
}

interface TonWalletContextType {
  wallet: any; // Тип из useTonWallet
  isConnected: boolean;
  isLoading: boolean;
  isTokensLoading: boolean; // Новое поле для отслеживания загрузки токенов
  isInitialLoadingCompleted: boolean; // Флаг завершения первичной загрузки
  error: string | null;
  tokens: Token[]; // Доступные токены
  userTokens: UserToken[]; // Токены пользователя (raw баланс)
  allTokens: Token[]; // Комбинированный список токенов (сначала пользователя, потом все)
  publicTokens: PublicToken[]; // Токены для отображения на главной странице (без пользовательских)
  portfolioTokens: PortfolioToken[]; // Токены для портфолио с учетом decimals (включая USDT)
  recentTokens: string[]; // Недавние токены
  usdtBalance: number; // Баланс USDT в протоколе (с учетом decimals)
  onChainUsdtBalance: number; // Баланс USDT в сети (с учетом decimals)
  jettonWalletInfo: any; // Информация о Jetton кошельке
  jwtToken: string | null; // JWT токен
  initData: string | null; // Данные инициализации Telegram
  userBalance: number; // Баланс пользователя в USDT в протоколе (с учетом decimals)
  formattedUserBalance: number; // Баланс пользователя в USDT с учетом decimals
  portfolioTotal: number; // Общая стоимость портфеля в USD с учетом decimals
  shouldRedirectToDeposit: boolean; // Флаг для перенаправления на страницу депозита
  setRedirectShown: () => void; // Метод для обозначения что редирект был показан
  connectWallet: () => void;
  disconnectWallet: () => void;
  sendTransaction: (params: any) => Promise<void>;
  getTokens: () => Promise<Token[]>;
  getRecentTokens: () => Promise<string[]>;
  searchTokens: (query: string) => Promise<PublicToken[]>;
  buyToken: (tokenMint: string, amount: string) => Promise<TransactionResult>;
  sellToken: (tokenMint: string, amount: string) => Promise<TransactionResult>;
  depositFunds: (amount: string) => Promise<TransactionResult>;
  withdrawFunds: (amount: string) => Promise<TransactionResult>;
  refreshData: () => Promise<void>;
  canSellToken: (tokenMint: string) => boolean; // Проверка возможности продажи токена
  getMaxBuyAmount: (tokenMint: string) => number; // Получение максимальной суммы для покупки с учетом decimals
  getMaxSellAmount: (tokenMint: string) => number; // Получение максимальной суммы для продажи с учетом decimals
  getMaxDepositAmount: () => number; // Получение максимальной суммы для депозита (onChain баланс)
  getMaxWithdrawAmount: () => number; // Получение максимальной суммы для вывода (protocolBalance)
  formatUsdtBalance: (rawBalance: number) => number; // Форматирование USDT баланса с учетом decimals
}

export const TonWalletContext = createContext<TonWalletContextType | undefined>(undefined);

export const TonWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokensLoading, setIsTokensLoading] = useState(true); // Устанавливаем в true по умолчанию для первичной загрузки
  const [isInitialLoadingCompleted, setIsInitialLoadingCompleted] = useState(false); // Флаг завершения начальной загрузки
  const [error, setError] = useState<string | null>(null);
  const [isWalletSaved, setIsWalletSaved] = useState(false); // Флаг, указывающий, что кошелек уже сохранен
  const [shouldRedirectToDeposit, setShouldRedirectToDeposit] = useState(false); // Флаг для перенаправления
  const [redirectToDepositShown, setRedirectToDepositShown] = useState(false); // Флаг, отслеживающий, был ли уже показан редирект

  // API данные
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);
  const [recentTokens, setRecentTokens] = useState<string[]>([]);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [onChainUsdtBalance, setOnChainUsdtBalance] = useState(0);
  const [jettonWalletInfo, setJettonWalletInfo] = useState<any>(null);

    // Получение данных из Telegram WebApp
    useEffect(() => {
      const telegramWebApp = (window as any).Telegram?.WebApp;
      if (telegramWebApp) {
        telegramWebApp.expand();
        telegramWebApp.disableVerticalSwipes();
        telegramWebApp.setBackgroundColor("#121212");
        const telegramData = telegramWebApp.initDataUnsafe;
        if (telegramData?.user?.id) {
  
          const webAppInitData = telegramWebApp.initData;
          setInitData(webAppInitData);
          
          // Авторизация пользователя и получение JWT
          if (webAppInitData) {
            authenticateUser(webAppInitData)
              .then(result => {
                if (result.success) {
                  setJwtToken(result.token);
                } else {
                  setError('Not authorized');
                }
              })
              .catch(err => {
                setError('Not authorized');
              });
          }
        }
      }
    }, []);

  // Создаем список всех токенов для страницы home и search
  const publicTokens = useMemo(() => {
    // Возвращаем все токены, не фильтруя их
    return tokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      logo_url: token.logo_url,
      price: token.price || 0,
      decimals: token.decimals,
      balance: 0, // Устанавливаем баланс в 0 для публичного отображения
      balanceUsd: 0 // Устанавливаем стоимость в 0 для публичного отображения
    }));
  }, [tokens]);

  // Создаем отсортированный список токенов: сначала пользовательские, потом все остальные
  const allTokens = useMemo(() => {
    // Создаем Set адресов токенов пользователя для быстрого поиска
    const userTokenAddresses = new Set(userTokens.map(token => token.token_mint));
    
    // Фильтруем общие токены, исключая те, что уже есть у пользователя
    const otherTokens = tokens.filter(token => !userTokenAddresses.has(token.address));
    
    // Преобразуем пользовательские токены в формат Token для отображения в списке
    const userTokensForList = userTokens.map(userToken => {
      // Находим полную информацию о токене из общего списка
      const tokenInfo = tokens.find(t => t.address === userToken.token_mint);
      
      // Получаем количество decimals и рассчитываем реальный баланс
      const decimals = tokenInfo?.decimals || 9;
      const realBalance = parseFloat(userToken.amount) / Math.pow(10, decimals);
      
      return {
        ...tokenInfo,
        address: userToken.token_mint,
        symbol: tokenInfo?.symbol || '',
        balance: realBalance,
        price: tokenInfo?.price || 0
      } as Token;
    });
    
    // Объединяем списки
    return [...userTokensForList, ...otherTokens];
  }, [tokens, userTokens]);

  // Создаем список токенов для портфолио (включая USDT, если есть баланс)
  const portfolioTokens = useMemo(() => {
    // Создаем массив для хранения токенов портфолио
    const portfolioItems: PortfolioToken[] = [];
    
    // Проходим по токенам пользователя
    userTokens.forEach(userToken => {
      // Находим полную информацию о токене из общего списка
      const tokenInfo = tokens.find(t => t.address === userToken.token_mint);
      
      if (tokenInfo) {
        // Получаем количество decimals для токена
        const decimals = tokenInfo.decimals || 9;
        // Конвертируем raw баланс в реальный с учетом decimals
        const realBalance = parseFloat(userToken.amount) / Math.pow(10, decimals);
        
        // Добавляем токен с полной информацией и балансом пользователя
        portfolioItems.push({
          token_mint: userToken.token_mint,
          symbol: tokenInfo.symbol || '',
          balance: realBalance,
          price: tokenInfo.price || 0,
          logo_url: tokenInfo.logo_url,
          decimals: decimals,
          balanceUsd: realBalance * (tokenInfo.price || 0)
        });
      }
    });
    
    // Если есть баланс USDT в протоколе, добавляем его как токен
    if (usdtBalance > 0) {
      // Находим USDT в списке токенов (если есть)
      const usdtToken = tokens.find(t => t.symbol === 'USDT');
      
      if (usdtToken) {
        const decimals = usdtToken.decimals || 6;
        // USDT баланс тоже нужно конвертировать с учетом decimals
        const realBalance = usdtBalance / Math.pow(10, decimals);
        
        portfolioItems.push({
          token_mint: usdtToken.address,
          symbol: 'USDT',
          balance: realBalance,
          price: 1, // USDT всегда по цене 1
          logo_url: usdtToken.logo_url,
          decimals: decimals,
          balanceUsd: realBalance // Для USDT баланс в USD равен самому балансу
        });
      } else {
        // Если USDT не найден в списке токенов, создаем его
        const decimals = 6; // USDT обычно имеет 6 decimals
        const realBalance = usdtBalance / Math.pow(10, decimals);
        
        portfolioItems.push({
          token_mint: 'usdt',
          symbol: 'USDT',
          balance: realBalance,
          price: 1,
          logo_url: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661',
          decimals: decimals,
          balanceUsd: realBalance
        });
      }
    }
    
    // Сортируем по убыванию стоимости в USD
    return portfolioItems.sort((a, b) => 
      (b.balance * b.price) - (a.balance * a.price)
    );
  }, [userTokens, usdtBalance, tokens]);

  // Вычисляем общую стоимость портфеля
  const portfolioTotal = useMemo(() => {
    return portfolioTokens.reduce((total, token) => {
      return total + (token.balance * token.price);
    }, 0);
  }, [portfolioTokens]);

  // Функция для форматирования USDT баланса с учетом decimals
  const formatUsdtBalance = useCallback((rawBalance: number): number => {
    // Находим USDT в списке токенов для получения decimals
    const usdtToken = tokens.find(t => t.symbol === 'USDT');
    const usdtDecimals = usdtToken?.decimals || 6;
    
    // Возвращаем реальный баланс с учетом decimals
    return rawBalance / Math.pow(10, usdtDecimals);
  }, [tokens]);

  // Форматированный баланс пользователя
  const formattedUserBalance = useMemo(() => {
    return formatUsdtBalance(usdtBalance);
  }, [usdtBalance, formatUsdtBalance]);

  // Форматированный on-chain баланс пользователя
  const formattedOnChainUsdtBalance = useMemo(() => {
    return formatUsdtBalance(onChainUsdtBalance);
  }, [onChainUsdtBalance, formatUsdtBalance]);

  // Сохранение кошелька TON в базу данных
  const saveWalletToDatabase = useCallback(async () => {
    if (!wallet || !wallet.account || !jwtToken || !initData || isWalletSaved) return;
    
    try {
      const walletAddress = getTonAddress({ address: wallet.account.address, bounce: false });
      const success = await addWallet(walletAddress, jwtToken, initData);
      
      if (success) {
        setIsWalletSaved(true); // Устанавливаем флаг, что кошелек сохранен
      } 
    } catch (err) {
    }
  }, [wallet, jwtToken, initData, isWalletSaved]);

  // Загрузка данных о токенах
  const loadTokensData = useCallback(async () => {
    if (!jwtToken || !initData) return;
    
    try {
      // setIsTokensLoading(true); // Убираем эту строку, так как isTokensLoading уже true по умолчанию
      
      // Получаем список всех токенов
      const tokensData = await fetchTokens(jwtToken, initData);
      
      // Для каждого токена получаем цену
      const tokensWithPrices = await Promise.all(
        tokensData.map(async (token) => {
          try {
            const price = await getTokenPrice(token.address, jwtToken, initData);
            return {
              ...token,
              price
            };
          } catch (error) {
            return {
              ...token,
              price: 0
            };
          }
        })
      );
      
      setTokens(tokensWithPrices);

      // Не устанавливаем здесь isTokensLoading в false
      // Это будет сделано только после загрузки пользовательских данных
      // setIsTokensLoading(false);
      
      // Не устанавливаем здесь setIsInitialLoadingCompleted и не снимаем флаг загрузки
      // Это будет сделано после загрузки всех данных
    } catch (err) {
      setError('Error loading token data');
      setIsInitialLoadingCompleted(true);
      setIsTokensLoading(false);
    }
  }, [jwtToken, initData]);

  // Загрузка данных пользователя
  const loadUserData = useCallback(async () => {
    if (!wallet || !wallet.account || !jwtToken || !initData) return;
    
    try {
      const walletAddress = wallet.account.address;
      
      // Получаем токены пользователя
      const userTokensData = await getUserTokens(walletAddress, jwtToken, initData);
      setUserTokens(userTokensData);
      
      // Получаем недавние токены
      const recentTokensData = await fetchRecentTokens(walletAddress, jwtToken, initData);
      setRecentTokens(recentTokensData);
      
      // Получаем баланс USDT в протоколе
      const usdtBalanceData = await getUserUsdtBalance(walletAddress, jwtToken, initData);
      setUsdtBalance(usdtBalanceData);
      
      // Получаем баланс USDT в сети
      const onChainUsdtBalanceData = await getOnChainUsdtBalance(walletAddress, jwtToken, initData);
      setOnChainUsdtBalance(onChainUsdtBalanceData);
      
      // Получаем информацию о Jetton кошельке
      const jettonWalletData = await getUsdtJettonWallet(walletAddress, jwtToken, initData);
      setJettonWalletInfo(jettonWalletData);
      
      // Если у пользователя нет токенов и баланс USDT равен 0, устанавливаем флаг для перенаправления
      // только если редирект еще не был показан
      if (userTokensData.length === 0 && usdtBalanceData === 0 && !redirectToDepositShown) {
        setShouldRedirectToDeposit(true);
      } else {
        setShouldRedirectToDeposit(false);
      }
      
      // Теперь в конце загрузки данных пользователя устанавливаем флаг завершения и снимаем флаг загрузки
      setIsInitialLoadingCompleted(true);
      setIsTokensLoading(false); // Устанавливаем isTokensLoading в false только здесь
    } catch (err) {
      setError('Error loading user data');
      setIsInitialLoadingCompleted(true);
      setIsTokensLoading(false);
    }
  }, [wallet, jwtToken, initData, redirectToDepositShown]);

  // Обновление только цен токенов
  const refreshTokenPrices = useCallback(async () => {
    if (!jwtToken || !initData || !tokens.length || !isInitialLoadingCompleted) return;
    
    try {
      
      // Обновляем цены для текущих токенов
      const tokensWithPrices = await Promise.all(
        tokens.map(async (token) => {
          try {
            const price = await getTokenPrice(token.address, jwtToken, initData);
            return {
              ...token,
              price
            };
          } catch (error) {
            return {
              ...token,
              price: token.price || 0 // Сохраняем текущую цену при ошибке
            };
          }
        })
      );
      
      setTokens(tokensWithPrices);
    } catch (err) {
    }
  }, [jwtToken, initData, tokens, isInitialLoadingCompleted]);

  // Обновление данных пользователя без установки флага первичной загрузки
  const refreshUserData = useCallback(async () => {
    if (!wallet || !wallet.account || !jwtToken || !initData || !isInitialLoadingCompleted) return;
    
    try {
      const walletAddress = wallet.account.address;
      
      // Получаем токены пользователя
      const userTokensData = await getUserTokens(walletAddress, jwtToken, initData);
      setUserTokens(userTokensData);
      
      // Получаем недавние токены
      const recentTokensData = await fetchRecentTokens(walletAddress, jwtToken, initData);
      setRecentTokens(recentTokensData);
      
      // Получаем баланс USDT в протоколе
      const usdtBalanceData = await getUserUsdtBalance(walletAddress, jwtToken, initData);
      setUsdtBalance(usdtBalanceData);
      
      // Получаем баланс USDT в сети
      const onChainUsdtBalanceData = await getOnChainUsdtBalance(walletAddress, jwtToken, initData);
      setOnChainUsdtBalance(onChainUsdtBalanceData);
      
      // Получаем информацию о Jetton кошельке
      const jettonWalletData = await getUsdtJettonWallet(walletAddress, jwtToken, initData);
      setJettonWalletInfo(jettonWalletData);
      
      // Если у пользователя нет токенов и баланс USDT равен 0, устанавливаем флаг для перенаправления
      // только если редирект еще не был показан
      if (userTokensData.length === 0 && usdtBalanceData === 0 && !redirectToDepositShown) {
        setShouldRedirectToDeposit(true);
      } else {
        setShouldRedirectToDeposit(false);
      }
      
      setIsTokensLoading(false); // Устанавливаем флаг isTokensLoading в false после обновления данных
    } catch (err) {
      setError('Error updating user data');
      setIsTokensLoading(false); // Устанавливаем флаг isTokensLoading в false в случае ошибки
    }
  }, [wallet, jwtToken, initData, isInitialLoadingCompleted, redirectToDepositShown]);

  // Обновление всех данных
  const refreshData = useCallback(async () => {
    if (!jwtToken || !initData) return;
    
    setIsTokensLoading(true); // Устанавливаем флаг загрузки перед обновлением данных
    
    await loadTokensData(); // Загружаем все токены с ценами
    
    if (wallet && wallet.account) {
      await refreshUserData(); // Обновляем данные пользователя
    } else {
      // Если кошелек не подключен, завершаем загрузку после получения токенов
      setIsTokensLoading(false);
      setIsInitialLoadingCompleted(true);
    }
  }, [jwtToken, initData, wallet, loadTokensData, refreshUserData]);

  // Загрузка данных для аутентифицированного пользователя
  useEffect(() => {
    if (jwtToken && initData) {
      loadTokensData()
        .then(() => {
          // Если нет кошелька, считаем загрузку завершенной после загрузки токенов
          if (!wallet || !wallet.account) {
            setIsInitialLoadingCompleted(true);
            setIsTokensLoading(false); // Добавляем установку флага isTokensLoading в false
          }
        });
    }
  }, [jwtToken, initData, loadTokensData, wallet]);

  // Загрузка данных после подключения кошелька
  useEffect(() => {
    if (wallet && wallet.account && jwtToken && initData) {
      // Сохраняем кошелек TON в базе данных
      saveWalletToDatabase();
      
      // Получаем данные пользователя
      loadUserData();
    }
  }, [wallet, jwtToken, initData, loadUserData, saveWalletToDatabase]);

  // Периодическое обновление данных
  useEffect(() => {
    if (jwtToken && initData) {
      // Обновление цен токенов каждую минуту
      const pricesInterval = setInterval(() => {
        refreshTokenPrices();
      }, 20000); // 20 секунд
      
      // Обновление данных пользователя каждые 30 секунд
      const userDataInterval = setInterval(() => {
        refreshUserData();
      }, 3000); // 3 секунды
      
      return () => {
        clearInterval(pricesInterval);
        clearInterval(userDataInterval);
      };
    }
  }, [jwtToken, initData, refreshTokenPrices, refreshUserData]);

  const connectWallet = () => {
    if (wallet) return;

    setIsLoading(true);
    setError(null);

    tonConnectUI.openModal()
      .catch(err => {
        setError('Failed to connect wallet');
        setIsLoading(false);
      });

    // Reset loading state after 3 seconds if connection doesn't happen
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  // Add effect to track failed connection attempts
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  useEffect(() => {
    // Increase connection attempt counter when connectWallet is called
    if (isLoading) {
      setConnectionAttempt(prev => prev + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    // If there was a connection attempt, but the wallet didn't connect and is not loading
    if (connectionAttempt > 0 && !wallet && !isLoading) {
      setError('Failed to connect wallet');
    }
  }, [connectionAttempt, wallet, isLoading]);

  const disconnectWallet = () => {
    if (!wallet) return;
    tonConnectUI.disconnect();
  };

  const sendTransaction = async (params: any) => {
    try {
      if (!wallet) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      await tonConnectUI.sendTransaction(params);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Получение списка токенов
  const getTokens = async (): Promise<Token[]> => {
    if (!jwtToken || !initData) return [];
    
    try {
      return await fetchTokens(jwtToken, initData);
    } catch (error) {
      return [];
    }
  };

  // Получение недавних токенов
  const getRecentTokens = async (): Promise<string[]> => {
    if (!wallet || !wallet.account || !jwtToken || !initData) return [];
    
    try {
      const walletAddress = wallet.account.address;
      return await fetchRecentTokens(walletAddress, jwtToken, initData);
    } catch (error) {
      return [];
    }
  };

  // Поиск токенов по запросу
  const searchTokens = async (query: string): Promise<PublicToken[]> => {
    if (!query.trim()) return publicTokens; // Используем публичный список токенов

    return publicTokens.filter(token =>
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.address.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Проверка возможности продажи токена
  const canSellToken = (tokenMint: string): boolean => {
    // Находим токен пользователя по адресу
    const userToken = userTokens.find(token => token.token_mint === tokenMint);
    
    // Если токена нет или баланс нулевой, продать нельзя
    return !!userToken && parseFloat(userToken.amount) > 0;
  };

  // Получение максимальной суммы для покупки
  const getMaxBuyAmount = (tokenMint: string): number => {
    // Используем уже имеющуюся функцию форматирования
    return formatUsdtBalance(usdtBalance);
  };

  // Получение максимальной суммы для продажи
  const getMaxSellAmount = (tokenMint: string): number => {
    // Находим токен пользователя по адресу
    const userToken = userTokens.find(token => token.token_mint === tokenMint);
    
    // Если токена нет, вернуть 0
    if (!userToken) return 0;
    
    // Находим информацию о токене из общего списка для получения decimals
    const tokenInfo = tokens.find(t => t.address === tokenMint);
    const decimals = tokenInfo?.decimals || 9;
    
    // Конвертируем raw баланс в реальный с учетом decimals
    const realBalance = parseFloat(userToken.amount) / Math.pow(10, decimals);
    
    // Вернуть доступный баланс
    return realBalance;
  };

  // Получение максимальной суммы для депозита (on-chain баланс)
  const getMaxDepositAmount = () => {
    return formattedOnChainUsdtBalance;
  };

  // Получение максимальной суммы для вывода (баланс в протоколе)
  const getMaxWithdrawAmount = () => {
    return formattedUserBalance;
  };

  // Покупка токена (USDT -> Token)
  const buyToken = async (tokenMint: string, amount: string): Promise<TransactionResult> => {
    if (!wallet || !wallet.account || !jwtToken || !initData) {
      return {
        success: false,
        message: 'Кошелек не подключен'
      };
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Передаем raw amount напрямую в API без дополнительных проверок
      const walletAddress = wallet.account.address;
      
      const result = await apiBuyToken(walletAddress, tokenMint, amount, jwtToken, initData);
      
      // После успешной транзакции обновляем данные
      if (result.success) {
        await refreshData();
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error buying token');
      return {
        success: false,
        message: err.message || 'Error buying token'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Продажа токена (Token -> USDT)
  const sellToken = async (tokenMint: string, amount: string): Promise<TransactionResult> => {
    if (!wallet || !wallet.account || !jwtToken || !initData) {
      return {
        success: false,
        message: 'Кошелек не подключен'
      };
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Передаем raw amount напрямую в API без дополнительных проверок
      const walletAddress = wallet.account.address;
      
      const result = await apiSellToken(walletAddress, tokenMint, amount, jwtToken, initData);
      
      // После успешной транзакции обновляем данные
      if (result.success) {
        await refreshData();
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error selling token');
      return {
        success: false,
        message: err.message || 'Error selling token'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для депозита (заглушка, так как в API нет такого метода)
  const depositFunds = async (amount: string): Promise<TransactionResult> => {
    // Здесь должна быть реализация функции депозита
    // Но в бэкенде нет соответствующего эндпоинта
    
    return {
      success: false,
      message: 'Функция депозита не реализована в API'
    };
  };

  // Функция для вывода средств
  const withdrawFunds = async (amount: string): Promise<TransactionResult> => {
    if (!wallet || !wallet.account || !jwtToken || !initData) {
      return {
        success: false,
        message: 'Кошелек не подключен'
      };
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Передаем raw amount напрямую в API без дополнительных проверок
      const walletAddress = wallet.account.address;
      
      const result = await apiWithdrawUsdt(walletAddress, amount, jwtToken, initData);
      
      // После успешной транзакции обновляем данные
      if (result.success) {
        await refreshData();
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error withdrawing funds');
      return {
        success: false,
        message: err.message || 'Error withdrawing funds'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Сбрасываем ошибку при изменении статуса кошелька
  useEffect(() => {
    setError(null);
  }, [wallet]);

  const value = {
    wallet,
    isConnected: !!wallet,
    isLoading,
    isTokensLoading, // Состояние загрузки токенов
    isInitialLoadingCompleted, // Добавляем флаг завершения первичной загрузки
    error,
    tokens,
    userTokens,
    allTokens, // Комбинированный список
    publicTokens, // Публичные токены для страницы home
    portfolioTokens, // Токены для портфолио
    recentTokens,
    usdtBalance: formattedUserBalance, // Баланс USDT в протоколе с учетом decimals
    onChainUsdtBalance: formattedOnChainUsdtBalance, // Баланс USDT в сети с учетом decimals
    jettonWalletInfo,
    jwtToken,
    initData,
    userBalance: formattedUserBalance, // Баланс пользователя в USDT в протоколе с учетом decimals
    formattedUserBalance, // Поддерживаем обратную совместимость
    portfolioTotal, // Общая стоимость портфеля в USD с учетом decimals
    shouldRedirectToDeposit, // Добавляем флаг в контекст
    setRedirectShown: () => setRedirectToDepositShown(true),
    connectWallet,
    disconnectWallet,
    sendTransaction,
    getTokens,
    getRecentTokens,
    searchTokens,
    buyToken,
    sellToken,
    depositFunds,
    withdrawFunds,
    refreshData,
    canSellToken, // Проверка возможности продажи
    getMaxBuyAmount, // Максимальная сумма покупки с учетом decimals
    getMaxSellAmount, // Максимальная сумма продажи с учетом decimals
    getMaxDepositAmount, // Максимальная сумма для депозита (onChain баланс)
    getMaxWithdrawAmount, // Максимальная сумма для вывода (protocolBalance)
    formatUsdtBalance // Экспортируем функцию форматирования
  };

  return (
    <TonWalletContext.Provider value={value}>
      {children}
    </TonWalletContext.Provider>
  );
};

export const useTonWalletContext = () => {
  const context = useContext(TonWalletContext);
  if (context === undefined) {
    throw new Error('useTonWalletContext must be used within TonWalletProvider');
  }
  return context;
}; 