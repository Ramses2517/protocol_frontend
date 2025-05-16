import { ApiResponse, Token, Transaction, WalletInfo } from '../types';

const API_URL = 'https://api.frogprotocol.com'; // Replace with your actual API URL

// Mock data
const mockTokens: Token[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        logo: 'bitcoin.png',
        price: 40000,
        priceChange: 2.5,
        balance: 0.005
    },
    {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        logo: 'ethereum.png',
        price: 2500,
        priceChange: 1.8,
        balance: 0.08
    },
    {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        logo: 'solana.png',
        price: 80,
        priceChange: 5.2,
        balance: 2.5
    },
    {
        id: 'bnb',
        name: 'Binance Coin',
        symbol: 'BNB',
        logo: 'binance.png',
        price: 350,
        priceChange: -0.7,
        balance: 1.2
    },
    {
        id: 'usdt',
        name: 'Tether',
        symbol: 'USDT',
        logo: 'tether.png',
        price: 1,
        priceChange: 0.01,
        balance: 100
    }
];

const mockWalletInfo: WalletInfo = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: 1000,
    connected: false
};

// Functions for working with API
export const connectWallet = async (): Promise<ApiResponse<WalletInfo>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/wallet/connect`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Wallet connection error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        return {
            success: true,
            data: { ...mockWalletInfo, connected: true }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to connect wallet'
        };
    }
};

export const disconnectWallet = async (): Promise<ApiResponse<boolean>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/wallet/disconnect`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Wallet disconnection error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        return {
            success: true,
            data: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to disconnect wallet'
        };
    }
};

export const getTokens = async (): Promise<ApiResponse<Token[]>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/tokens`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Error getting token list');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        return {
            success: true,
            data: mockTokens
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch tokens'
        };
    }
};

export const deposit = async (amount: number, token: string): Promise<ApiResponse<Transaction>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/deposit`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ amount, token })
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Deposit error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        const selectedToken = mockTokens.find(t => t.id === token) || mockTokens[0];

        return {
            success: true,
            data: {
                id: `tx-${Date.now()}`,
                type: 'deposit',
                amount,
                token: selectedToken,
                status: 'success',
                timestamp: Date.now()
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to deposit'
        };
    }
};

export const withdraw = async (amount: number, token: string): Promise<ApiResponse<Transaction>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/withdraw`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ amount, token })
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Withdrawal error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        const selectedToken = mockTokens.find(t => t.id === token) || mockTokens[0];

        return {
            success: true,
            data: {
                id: `tx-${Date.now()}`,
                type: 'withdraw',
                amount,
                token: selectedToken,
                status: 'success',
                timestamp: Date.now()
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to withdraw'
        };
    }
};

export const buyToken = async (amount: number, token: string): Promise<ApiResponse<Transaction>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/buy`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ amount, token })
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Token purchase error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        const selectedToken = mockTokens.find(t => t.id === token) || mockTokens[0];

        return {
            success: true,
            data: {
                id: `tx-${Date.now()}`,
                type: 'buy',
                amount,
                token: selectedToken,
                status: 'success',
                timestamp: Date.now()
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to buy token'
        };
    }
};

export const sellToken = async (amount: number, token: string): Promise<ApiResponse<Transaction>> => {
    try {
        // Here will be a real API request
        // const response = await fetch(`${API_URL}/sell`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ amount, token })
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Token sale error');
        // }
        // 
        // const data = await response.json();
        // return data;

        // Mock response
        const selectedToken = mockTokens.find(t => t.id === token) || mockTokens[0];

        return {
            success: true,
            data: {
                id: `tx-${Date.now()}`,
                type: 'sell',
                amount,
                token: selectedToken,
                status: 'success',
                timestamp: Date.now()
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to sell token'
        };
    }
}; 