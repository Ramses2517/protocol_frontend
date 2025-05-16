import { API_URL } from "../constants/urls";

/**
 * Функция для авторизации пользователя через Telegram WebApp
 * @param initData - данные инициализации из Telegram WebApp
 */
export async function authenticateUser(initData: string): Promise<{ success: boolean; token: string }> {
  try {
    const response = await fetch(`${API_URL}/protocol/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'web-tg-code': initData
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error during authorization');
    }

    const data = await response.json();
    
    if (data.status === 200 && data.token) {
      return {
        success: true,
        token: data.token
      };
    }

    throw new Error('Error getting token');
  } catch (error) {
    return {
      success: false,
      token: ''
    };
  }
} 