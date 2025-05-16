import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { Button } from '../components/Button';
import { NumPad } from '../components/NumPad';
import { UsdtSmallIcon } from '../components/icons';
import { getFormattedValue } from '../shared/utils/getFormattedValue';

// Цена USDT в долларах
const USDT_PRICE = 1.0;

export const Withdraw: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        isConnected, 
        withdrawFunds, 
        wallet, 
        userBalance, 
        getMaxWithdrawAmount,
        tokens
    } = useTonWalletContext();

    const [amount, setAmount] = useState<string>('0');
    const [usdValue, setUsdValue] = useState<string>('$0');
    const [loading, setLoading] = useState(false);

    // Получаем максимальную сумму для вывода
    const maxWithdrawAmount = getMaxWithdrawAmount();

    // Обновляем USD значение при изменении суммы
    useEffect(() => {
        const numValue = parseFloat(amount);
        if (!isNaN(numValue)) {
            // Используем getFormattedValue для форматирования
            setUsdValue(getFormattedValue(numValue, true));
        } else {
            setUsdValue('$0');
        }
    }, [amount]);
    
    // Проверяем подключение кошелька
    useEffect(() => {
        if (!isConnected) {
            navigate('/');
        }
    }, [isConnected, navigate]);

    const handleConfirm = async () => {
        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            return;
        }

        if (!wallet?.account?.address) {
            return;
        }

        // Проверяем, не превышает ли сумма максимально доступную
        if (withdrawAmount > maxWithdrawAmount) {
            return;
        }

        setLoading(true);

        try {
            // Находим USDT в списке токенов для получения decimals
            const usdtToken = tokens.find(t => t.symbol === 'USDT');
            const usdtDecimals = usdtToken?.decimals || 6;
            
            // Преобразуем human-readable сумму в raw формат
            const rawAmount = (withdrawAmount * Math.pow(10, usdtDecimals)).toString();
            
            // Запрос на вывод средств с использованием raw суммы
            const result = await withdrawFunds(rawAmount);
            if (!result.success) {
                throw new Error(result.message || 'Error withdrawing funds');
            }
            // Перенаправляем на страницу статуса транзакции
            navigate('/transaction/status', {
                state: {
                    status: 'success',
                    type: 'withdraw',
                    amount,
                    tokenSymbol: 'USDT',
                    txHash: result.txHash || ''
                }
            });
        } catch (error: any) {

            navigate('/transaction/status', {
                state: {
                    status: 'failed',
                    type: 'withdraw',
                    amount,
                    tokenSymbol: 'USDT',
                    errorMessage: error.message || 'Error withdrawing funds'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToPortfolio = () => {
        navigate('/portfolio');
    };

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

    const numpadContainerStyles = css`
        width: 100%;
    `;

    const buttonsContainerStyles = css`
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 12px;
    `;

    // Проверяем, введено ли количество и не превышает ли оно доступный баланс
    const amountValue = parseFloat(amount);
    const isAmountValid = !isNaN(amountValue) && amountValue > 0 && amountValue <= maxWithdrawAmount;

    return (
        <div className={containerStyles}>
            <span className={titleStyles}>Withdraw</span>  
            
            <div className={balanceContainerStyles}>
                <UsdtSmallIcon />
                <div className={balanceTextStyles}>
                    Balance: {getFormattedValue(userBalance, false)} USDT
                </div>
            </div>

            <div className={numpadContainerStyles}>
                <NumPad
                    initialValue={amount}
                    onChange={setAmount}
                    showPresets={true}
                    usdValue={usdValue}
                    mode="withdraw"
                    maxAmount={maxWithdrawAmount}
                />
            </div>

            <div className={buttonsContainerStyles}>
                <Button
                    variant="primary"
                    fullWidth
                    size="large"
                    onClick={handleConfirm}
                    disabled={!isAmountValid || loading}
                    isLoading={loading}
                >
                    Withdraw
                </Button>
                <Button
                    variant="secondary"
                    fullWidth
                    size="large"
                    onClick={handleBackToPortfolio}
                >
                    Back
                </Button>
            </div>
        </div>
    );
}; 