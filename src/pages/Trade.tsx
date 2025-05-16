import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NumPad } from '../components/NumPad';
import { TokenInfo } from '../components/TokenInfo';
import { TradeTabs } from '../components/TradeTabs';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { getFormattedValue } from '../shared/utils/getFormattedValue';
import { UsdtSmallIcon } from '../components/icons';
import { NoPic } from '../components/icons';

type ActionMode = 'buy' | 'sell';

export const Trade: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const [amount, setAmount] = useState<string>('0');
    const [selectedToken, setSelectedToken] = useState<any | null>(null);
    const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [usdValue, setUsdValue] = useState<string>('$0');
    // Action mode: buy or sell
    const [mode, setMode] = useState<ActionMode>('buy');

    const navigate = useNavigate();
    const {
        isConnected,
        wallet,
        tokens,
        userTokens,
        userBalance, // USDT balance in the protocol with decimals
        buyToken,
        sellToken,
        getMaxBuyAmount,
        getMaxSellAmount
    } = useTonWalletContext();

    // Maximum amount for buying (USDT balance)
    const maxBuyAmount = selectedToken ? getMaxBuyAmount(selectedToken.address) : 0;
    
    // Maximum amount for selling (token balance)
    const maxSellAmount = selectedToken ? getMaxSellAmount(selectedToken.address) : 0;
    
    // Current maximum based on mode
    const currentMaxAmount = mode === 'buy' ? maxBuyAmount : maxSellAmount;

    useEffect(() => {
        // Find token from context
        if (!tokenId) return;

        const token = tokens.find(t => t.address === tokenId);
        if (token) {
            setSelectedToken(token);
        } else {
            setTimeout(() => {
                navigate('/home');
            }, 500);
        }
    }, [tokenId, navigate, tokens]);

    // Update USD value when amount changes
    useEffect(() => {
        const numValue = parseFloat(amount);
        if (!isNaN(numValue) && selectedToken) {
            if (mode === 'sell') {
                // For selling, USD value = token amount * price with 1% fee
                const usdAmount = numValue * selectedToken.price * 0.99;
                setUsdValue(`${getFormattedValue(usdAmount, true)} (including 1% fee)`);
            } else {
                // For buying, show how many tokens you can buy for the USD amount with 1% fee
                const tokenAmount = (numValue / selectedToken.price) * 0.99;
                setUsdValue(`${getFormattedValue(tokenAmount, false)} ${selectedToken.symbol} (including 1% fee)`);
            }
        } else {
            setUsdValue(mode === 'buy' ? `0 ${selectedToken?.symbol || ''}` : '$0');
        }
    }, [amount, selectedToken, mode]);

    const handleConfirm = async () => {
        const transactionAmount = parseFloat(amount);

        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            return;
        }

        if (!isConnected) {
            return;
        }

        if (!selectedToken) {
            return;
        }

        setLoading(true);

        try {
            // Get decimals for selected token
            const tokenDecimals = selectedToken.decimals || 9;
            
            if (mode === 'buy') {
                const rawAmount = Math.floor(transactionAmount * Math.pow(10, 6)).toString();
                
                // Send 99.9% of the amount
                const adjustedAmount = Math.floor(Number(rawAmount) * 0.998).toString();
                
                const result = await buyToken(selectedToken.address, adjustedAmount);
                
                if (!result.success) {
                    throw new Error(result.message || 'Error buying token');
                }
                
                // Navigate to result page
                navigate('/transaction/status', {
                    state: {
                        status: 'success',
                        type: 'buy',
                        amount: `$${amount}`,
                        tokenSymbol: selectedToken.symbol,
                        txHash: result.txHash || ''
                    }
                });
            } else {
                // For selling, user enters token amount
                // Convert this amount to raw format with decimals
                const rawAmount = Math.floor(transactionAmount * Math.pow(10, tokenDecimals)).toString();
                
                // Send 99.9% of the amount
                const adjustedAmount = Math.floor(Number(rawAmount) * 0.998).toString();
                
                // Send raw amount to API
                const result = await sellToken(selectedToken.address, adjustedAmount);
                
                if (!result.success) {
                    throw new Error(result.message || 'Error selling token');
                }
                
                // Navigate to result page
                navigate('/transaction/status', {
                    state: {
                        status: 'success',
                        type: 'sell',
                        amount: amount,
                        tokenSymbol: selectedToken.symbol,
                        txHash: result.txHash || ''
                    }
                });
            }
        } catch (error: any) {
            navigate('/transaction/status', {
                state: {
                    status: 'failed',
                    type: mode,
                    amount: mode === 'buy' ? `$${amount}` : amount,
                    tokenSymbol: selectedToken.symbol,
                    errorMessage: error.message || `Error while ${mode === 'buy' ? 'buying' : 'selling'} token`
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    // Check user balance
    const amountValue = parseFloat(amount);
    
    // Check if button is active
    const isButtonActive = 
        !isNaN(amountValue) && 
        amountValue > 0 && 
        amountValue <= currentMaxAmount && 
        !loading;

    // Page styles
    const containerStyles = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #111312;
        padding: 16px 16px 0 16px;
    `;

    const titleStyles = css`
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px; /* 125% */
        color: #FFFFFF;
        margin-bottom: 16px;
    `;

    const numpadContainerStyles = css`
        width: 100%;
    `;

    const buttonsContainerStyles = css`
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 12px;
    `;

    const tabsContainerStyles = css`
        width: 100%;
        margin-bottom: 16px;
    `;
    
    const balanceContainerStyles = css`
        display: flex;
        padding: 4px 12px 4px 4px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 16px;
        background: #323232;
        margin-bottom: 16px;
    `;

    const balanceTextStyles = css`
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px; /* 133.333% */
        color: #FFFFFF;
    `;

    const iconStyles = css`
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
    `;

    return (
        <div className={containerStyles}>
            <div className={tabsContainerStyles}>
                <TradeTabs 
                    mode={mode} 
                    onChangeMode={(newMode) => setMode(newMode)}
                />
            </div>
            
            {mode === 'buy' && (
                <div className={balanceContainerStyles}>
                    <UsdtSmallIcon />
                    <div className={balanceTextStyles}>
                        Balance: {getFormattedValue(userBalance, false)} USDT
                    </div>
                </div>
            )}
            
            {mode === 'sell' && selectedToken && (
                <TokenInfo 
                    symbol={selectedToken.symbol}
                    price={selectedToken.price}
                    icon={selectedToken.logo_url || undefined}
                    balance={maxSellAmount}
                />
            )}

            <div className={numpadContainerStyles}>
                <NumPad
                    initialValue={amount}
                    onChange={setAmount}
                    showPresets={true}
                    usdValue={usdValue}
                    mode={mode}
                    maxAmount={currentMaxAmount}
                />
            </div>

            <div className={buttonsContainerStyles}>
                <Button
                    variant="primary"
                    fullWidth
                    size="large"
                    onClick={handleConfirm}
                    disabled={!isButtonActive}
                    isLoading={loading}
                >
                    {mode === 'buy' ? 'Buy' : 'Sell'}
                </Button>
                <Button
                    variant="secondary"
                    fullWidth
                    size="large"
                    onClick={handleBackToHome}
                >
                    Back
                </Button>
            </div>
        </div>
    );
}; 