import { API_URL } from "../constants/urls";

/**
 * Функция для добавления кошелька пользователя
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function addWallet(wallet: string, token: string, initData: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      },
      body: JSON.stringify({ wallet })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error adding wallet');
    }

    const data = await response.json();
    
    return data.status === 200 && data.result?.success === true;
  } catch (error) {
    return false;
  }
}

/**
 * Функция для получения баланса USDT в сети TON
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getOnChainUsdtBalance(wallet: string, token: string, initData: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/usdt_onchain_balance/${wallet}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting USDT balance');
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

/**
 * Функция для получения информации о Jetton кошельке USDT
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getUsdtJettonWallet(wallet: string, token: string, initData: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/ton_jetton_wallet/${wallet}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting Jetton wallet information');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.result) {
      return data.result;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Функция для получения баланса USDT пользователя в протоколе
 * @param wallet - адрес кошелька
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function getUserUsdtBalance(wallet: string, token: string, initData: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/user_usdt/${wallet}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting USDT balance');
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