import { API_URL } from "../constants/urls";

/**
 * Интерфейс для токена
 */
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  logo_url: string | null;
  price?: number;
  balance?: number;
  balanceUsd?: number;
}

/**
 * Интерфейс для пользовательского токена
 */
export interface UserToken {
  wallet: string;
  token_mint: string;
  amount: string; // Raw amount
}

/**
 * Функция для получения списка всех токенов
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getTokens(token: string, initData: string): Promise<Token[]> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/tokens`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting token list');
    }

    const data = await response.json();

    
    if (data.status === 200 && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Функция для получения списка токенов пользователя
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getUserTokens(wallet: string, token: string, initData: string): Promise<UserToken[]> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/user_tokens/${wallet}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting user tokens');
    }

    const data = await response.json();
    
    if (data.status === 200 && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Функция для получения недавних токенов пользователя
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getRecentTokens(wallet: string, token: string, initData: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/recent_tokens/${wallet}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting recent tokens');
    }

    const data = await response.json();
    
    if (data.status === 200 && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Функция для получения цены токена
 * @param tokenMint - адрес токена
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getTokenPrice(tokenMint: string, token: string, initData: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/token_price/${tokenMint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting token price');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.result !== undefined) {
      return Number(data.result);
    }

    return 0;
  } catch (error) {
    return 0;
  }
} 