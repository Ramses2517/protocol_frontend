import React, { useEffect } from 'react';
import { css } from '@emotion/css';
import { useNavigate, useLocation } from 'react-router-dom';
import { TonConnectCustomButton } from '../components/TonConnectCustomButton';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { FrogIcon } from '../components/icons/FrogIcon';
import { Button } from '../components/Button';

export const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useTonWalletContext();

  useEffect(() => {
    if (isConnected) {
      const state = location.state as { redirectTo?: string } | null;
      const redirectTo = state?.redirectTo || '/portfolio';
      navigate(redirectTo);
    }
  }, [isConnected, navigate, location]);

  const pageContainerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px 40px 16px;
    min-height: 100vh;
  `;

  const contentContainerStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin: 0 auto;
  `;

  const titleStyles = css`
    font-size: 28px;
    width: 100%;
    font-family: "Chakra Petch";
    font-size: 26px;
    font-style: normal;
    font-weight: 600; 
    line-height: 34px;
    margin-bottom: 8px;
    color: #FFFFFF;
  `;

  const greenTextStyles = css`
    color: var(--Text-Success, #17E585)
  `;

  const subtitleStyles = css`
    color:rgba(244, 244, 244, 0.64);
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    margin-bottom: 24px;
    width: 100%;
  `;

  const stepContainerStyles = css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  const stepStyles = css`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
  `;

  const stepNumberStyles = css`
    color: var(--Text-Success, #17E585);
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border-radius: 8px;
    background: rgba(23, 229, 133, 0.16);
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;  
  `;

  const stepTextStyles = css`
    color: #FFFFFF;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  `;

  const buttonsContainerStyles = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const frogIconStyles = css`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    
    svg {
      width: 100%;
      height: auto;
    }
  `;

  return (
    <div className={pageContainerStyles}>
      <div className={contentContainerStyles}>
        <div className={frogIconStyles}>
          <FrogIcon />
        </div>

        <span className={titleStyles}>
          Welcome to <span className={greenTextStyles}>Frog Protocol</span>
        </span>
        <span className={subtitleStyles}>Buy and sell tokens in minutes. No hassle, just profit</span>


        <div className={stepContainerStyles}>
          <div className={stepStyles}>
            <div className={stepNumberStyles}>1</div>
            <div className={stepTextStyles}>Connect your TON wallet and deposit <span className={greenTextStyles}>USDT</span></div>
          </div>

          <div className={stepStyles}>
            <div className={stepNumberStyles}>2</div>
            <div className={stepTextStyles}>Buy meme coins on Solana via Frog Protocol</div>
          </div>

          <div className={stepStyles}>
            <div className={stepNumberStyles}>3</div>
            <div className={stepTextStyles}>Track your portfolio and manage your positions</div>
          </div>

          <div className={stepStyles}>
            <div className={stepNumberStyles}>4</div>
            <div className={stepTextStyles}>Withdraw funds anytime back to your TON wallet</div>
          </div>
        </div>
      </div>

      <div className={buttonsContainerStyles}>
        <TonConnectCustomButton />
        <Button variant="secondary" onClick={() => navigate('/home')}>
          Skip
        </Button>
      </div>
    </div>
  );
}; 