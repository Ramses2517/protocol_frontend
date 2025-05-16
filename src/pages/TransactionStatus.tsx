import React, { useEffect } from 'react';
import { css, keyframes } from '@emotion/css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { TxSuccessIcon, TxFailedIcon } from '../components/icons';

type TransactionStatus = 'success' | 'failed' | 'pending';
type TransactionType = 'buy' | 'sell' | 'withdraw' | 'deposit';

interface TransactionStatusPageProps { }

export const TransactionStatus: React.FC<TransactionStatusPageProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as {
        status: TransactionStatus;
        type: TransactionType;
        errorMessage?: string;
    };

    const transactionStatus = state?.status || 'success';
    const transactionType = state?.type || 'buy';
    const errorMessage =  'Transaction failed';

    useEffect(() => {
        // If no transaction data, redirect to home page
        if (!state) {
            navigate('/home');
        }
    }, [state, navigate]);

    const handleGoHome = () => {
        navigate('/home');
    };

    const handleRetry = () => {
        // Go back to previous page to retry
        navigate(-1);
    };

    const getTitle = () => {
        if (transactionStatus === 'failed') {
            return 'Transaction Failed';
        }

        if (transactionStatus === 'pending') {
            return 'Transaction Processing';
        }

        switch (transactionType) {
            case 'buy':
                return 'Purchase Completed!';
            case 'sell':
                return 'Sale Completed!';
            case 'withdraw':
                return 'Withdrawal Completed!';
            case 'deposit':
                return 'Deposit Completed!';
            default:
                return 'Transaction Completed!';
        }
    };

    const getMessage = () => {
        if (transactionStatus === 'failed') {
            return errorMessage;
        }

        if (transactionStatus === 'pending') {
            return 'Your transaction is being processed. This may take a few minutes.';
        }

        switch (transactionType) {
            case 'buy':
                return 'Your purchase has been successfully completed';
            case 'sell':
                return 'Your sale has been successfully completed';
            case 'withdraw':
                return 'Your withdrawal has been successfully completed. Please note that withdrawals may take up to 24 hours to process.';
            case 'deposit':
                return 'Your deposit has been successfully completed. Please note that deposits may take a few minutes to appear in your balance.';
            default:
                return 'The transaction was processed successfully';
        }
    };

    // Animation for the icon
    const bounceAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  `;

    const spinAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

    const containerStyles = css`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    min-height: calc(100vh);
    padding: 32px;
    position: relative;
    
  `;

    const contentContainerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
  `;

    const iconContainerStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    animation: ${transactionStatus === 'success'
            ? bounceAnimation
            : transactionStatus === 'pending'
                ? spinAnimation
                : 'none'} ${transactionStatus === 'pending' ? '1.5s linear infinite' : '1s ease-out'};
  `;

    const titleStyles = css`
overflow: hidden;
color: #FFFFFF
text-align: center;
text-overflow: ellipsis;
    font-family: "Chakra Petch";
    font-size: 26px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px;
  `;

    const messageStyles = css`
        font-family: "DM Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        color: #F4F4F4A3;
        text-align: center;
        margin-top: 12px;
        padding: 0 24px;
    `;

    const buttonContainerStyles = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    gap: 16px;
    position: absolute;
    padding-left: 16px;
    padding-right: 16px;
    bottom: 40px;
  `;

    return (
        <div className={containerStyles}>
            <div className={contentContainerStyles}>
                <div className={iconContainerStyles}>
                    {transactionStatus === 'success' ? (
                        <TxSuccessIcon />
                    ) : (
                        <TxFailedIcon />
                    )}
                </div>

                <span className={titleStyles}>
                    {transactionStatus === 'success' ? 'Transaction successful' : 'Transaction error'}
                </span>

                <div className={messageStyles}>
                    {getMessage()}
                </div>
            </div>

            <div className={buttonContainerStyles}>
                {transactionStatus === 'failed' ? (
                    <Button
                        variant="primary"
                        onClick={handleRetry}
                        fullWidth
                    >
                        Try again
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleGoHome}
                        fullWidth
                    >
                        Back to buying tokens!
                    </Button>
                )}
            </div>
        </div>
    );
}; 