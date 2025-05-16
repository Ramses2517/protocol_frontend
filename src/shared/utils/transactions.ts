import { API_URL } from "../constants/urls";

/**
 * Интерфейс для транзакции
 */
export interface Transaction {
  tx_hash: string;
  user_wallet: string;
  token_mint: string;
  tx_type: string;
  amount: string; // Raw amount
  timestamp: number;
}

/**
 * Интерфейс для результата транзакции
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  message?: string;
}

/**
 * Функция для покупки токена (USDT -> Token)
 * @param wallet - адрес кошелька
 * @param outputMint - адрес токена, который покупается
 * @param usdtAmount - количество USDT
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function buyToken(
  wallet: string,
  outputMint: string,
  usdtAmount: string,
  token: string,
  initData: string
): Promise<TransactionResult> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      },
      body: JSON.stringify({
        wallet,
        output_mint: outputMint,
        usdt_amount: usdtAmount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error buying token');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.result) {
      return {
        success: true,
        txHash: data.result.tx_hash || '',
        message: 'Токен успешно куплен'
      };
    }

    return {
      success: false,
      message: 'Unknown error during token purchase'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during token purchase'
    };
  }
}

/**
 * Функция для продажи токена (Token -> USDT)
 * @param wallet - адрес кошелька
 * @param inputMint - адрес токена, который продается
 * @param tokenAmount - количество токена
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function sellToken(
  wallet: string,
  inputMint: string,
  tokenAmount: string,
  token: string,
  initData: string
): Promise<TransactionResult> {
  try {
            const response = await fetch(`${API_URL}/protocol/api/v1/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      },
      body: JSON.stringify({
        wallet,
        input_mint: inputMint,
        token_amount: tokenAmount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error selling token');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.result) {
      return {
        success: true,
        txHash: data.result.tx_hash || '',
        message: 'Токен успешно продан'
      };
    }

    return {
      success: false,
      message: 'Unknown error during token sale'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during token sale'
    };
  }
}

/**
 * Функция для вывода USDT
 * @param wallet - адрес кошелька
 * @param amount - количество USDT для вывода
 * @param token - JWT токен
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function withdrawUsdt(
  wallet: string,
  amount: string,
  token: string,
  initData: string
): Promise<TransactionResult> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'web-tg-code': initData
      },
      body: JSON.stringify({
        wallet,
        amount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error withdrawing USDT');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.result) {
      return {
        success: true,
        txHash: "",
        message: 'USDT успешно выведены'
      };
    }

    return {
      success: false,
      message: 'Unknown error during USDT withdrawal'
    };
  } catch (error) {
      return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during USDT withdrawal'
    };
  }
} 