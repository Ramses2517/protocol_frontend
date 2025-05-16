export interface Token {
    id: string;
    name: string;
    symbol: string;
    logo: string;
    price: number;
    priceChange: number;
    balance?: number;
}

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'buy' | 'sell';
    amount: number;
    token: Token;
    status: 'pending' | 'success' | 'error';
    timestamp: number;
}

export interface WalletInfo {
    address: string;
    balance: number;
    connected: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
} 