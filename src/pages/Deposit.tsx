import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { Button } from '../components/Button';
import { NumPad } from '../components/NumPad';
import { Address, beginCell, toNano } from '@ton/ton';
import { UsdtSmallIcon } from '../components/icons';
import { getFormattedValue } from '../shared/utils/getFormattedValue';

// Адрес приложения для приёма USDT
const APP_RECEIVER_ADDRESS = 'UQCdJbInvqKlaiBSyyN_gtRWNPB7VwYy9yKWMdzxMA_v2R9t';

export const Deposit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        isConnected, 
        depositFunds, 
        wallet, 
        sendTransaction, 
        onChainUsdtBalance, 
        jettonWalletInfo,
        getMaxDepositAmount,
        formatUsdtBalance
    } = useTonWalletContext();

    const [amount, setAmount] = useState<string>('0');
    const [usdValue, setUsdValue] = useState<string>('$0');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [showStatus, setShowStatus] = useState(false);

    // Получаем адрес jetton-кошелька из jettonWalletInfo
    const jettonWalletAddress = jettonWalletInfo;
    
    // Получаем максимальную сумму для депозита
    const maxDepositAmount = getMaxDepositAmount();

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

    // Определяем, пришёл пользователь из портфолио или это новый пользователь
    const isFromPortfolio = location.state?.from === 'portfolio';
    const isNewUser = location.state?.newUser === true;

    // Проверяем подключение кошелька
    useEffect(() => {
        if (!isConnected) {
            navigate('/');
        }
    }, [isConnected, navigate]);

    // Создаем jetton transfer сообщение с комментарием
    const createJettonTransferWithComment = (amount: string, destinationAddress: string, senderAddress: string) => {
        try {
            // Находим USDT в списке токенов для получения decimals
            const decimals = 6; // USDT обычно имеет 6 decimals

            // Преобразуем сумму с учетом decimals (из human-readable в raw)
            const rawAmount = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

            // Create comment as forward payload
            const forwardPayload = beginCell()
                .storeUint(0, 32) // opcode 0 means comment
                .storeStringTail('Deposit to Frog Protocol') // comment text
                .endCell();

            // Create Jetton-Transfer message body
            const body = beginCell()
                .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer
                .storeUint(0, 64) // query id
                .storeCoins(rawAmount) // USDT amount в raw формате
                .storeAddress(Address.parse(destinationAddress)) // recipient address
                .storeAddress(Address.parse(senderAddress)) // address for returning excess (should be sender address)
                .storeBit(0) // no custom payload
                .storeCoins(toNano('0.02')) // forward amount for notification
                .storeBit(1) // saving forward payload as reference
                .storeRef(forwardPayload) // reference to the comment cell
                .endCell();

            return body.toBoc().toString('base64');
        } catch (error) {
            throw error;
        }
    };

    const handleConfirm = async () => {
        const depositAmount = parseFloat(amount);

        if (isNaN(depositAmount) || depositAmount <= 0) {
            return;
        }

        if (!wallet?.account?.address) {
            return;
        }

        if (!jettonWalletAddress) {
            return;
        }

        // Проверяем, не превышает ли сумма максимально доступную
        if (depositAmount > maxDepositAmount) {
            return;
        }

        setLoading(true);

        try {
            const senderAddress = wallet.account.address;

            // Create message for Jetton Transfer with comment
            const payload = createJettonTransferWithComment(
                amount,
                APP_RECEIVER_ADDRESS,
                senderAddress
            );

            // Form transaction
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360, // valid for 6 minutes
                messages: [
                    {
                        address: jettonWalletAddress,
                        amount: toNano('0.1').toString(),
                        payload: payload,
                    }
                ]
            };

            // Send transaction
            await sendTransaction(transaction);

            // Call deposit method from context to update UI state
            const result = await depositFunds(amount);

            // Redirect to transaction status page
            navigate('/transaction/status', {
                state: {
                    status: 'success',
                    type: 'deposit',
                    amount,
                    tokenSymbol: 'USDT',
                    txHash: result.txHash || ''
                }
            });
        } catch (error: any) {

            navigate('/transaction/status', {
                state: {
                    status: 'failed',
                    type: 'deposit',
                    amount,
                    tokenSymbol: 'USDT',
                    errorMessage: error.message || 'Error performing deposit'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/home');
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
    const isAmountValid = !isNaN(amountValue) && amountValue > 0 && amountValue <= maxDepositAmount;

    return (
        <div className={containerStyles}>
            <span className={titleStyles}>Deposit</span>  
            
            <div className={balanceContainerStyles}>
                <UsdtSmallIcon />
                <div className={balanceTextStyles}>
                    Balance: {getFormattedValue(onChainUsdtBalance, false)} USDT
                </div>
            </div>

            <div className={numpadContainerStyles}>
                <NumPad
                    initialValue={amount}
                    onChange={setAmount}
                    showPresets={true}
                    usdValue={usdValue}
                    mode="deposit"
                    maxAmount={maxDepositAmount}
                />
            </div>

            <div className={buttonsContainerStyles}>
            <Button
                    onClick={handleConfirm}
                    variant="primary"
                    disabled={!isAmountValid || loading}
                    isLoading={loading}
                    fullWidth
                >
                    Deposit
                </Button>
                <Button
                    onClick={isFromPortfolio ? handleBackToPortfolio : handleSkip}
                    variant="secondary"
                    fullWidth
                >
                    {isFromPortfolio ? 'Back' : 'Skip'}
                </Button>
            </div>
        </div>
    );
};