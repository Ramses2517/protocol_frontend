import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@emotion/css';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [status, autoClose, autoCloseTime, onClose]);

  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const fadeOut = keyframes`
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  `;

  const spinAnimation = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  const statusContainerStyles = css`
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1A1A1A;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: ${isVisible ? fadeIn : fadeOut} 0.3s ease forwards;
    align-items: center;
  `;

  const iconContainerStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 16px;
    background-color: ${status === 'success' ? 'rgba(23, 229, 133, 0.1)' :
      status === 'error' ? 'rgba(255, 82, 82, 0.1)' :
        'rgba(33, 150, 243, 0.1)'};
  `;

  const iconStyles = css`
    font-size: 32px;
    color: ${status === 'success' ? '#17E585' :
      status === 'error' ? '#FF5252' :
        '#2196F3'};
    
    ${status === 'pending' && `
      animation: ${spinAnimation} 1.5s linear infinite;
    `}
  `;

  const messageStyles = css`
    text-align: center;
    color: #FFFFFF;
    font-size: 16px;
    margin-bottom: 16px;
  `;

  const closeButtonStyles = css`
    background-color: transparent;
    border: 1px solid #333333;
    color: #FFFFFF;
    padding: 4px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `;

  if (!isVisible) return null;

  return (
    <div className={statusContainerStyles}>
      <div className={iconContainerStyles}>
        <div className={iconStyles}>
          {status === 'success' ? '✓' :
            status === 'error' ? '✕' :
              '⟳'}
        </div>
      </div>
      <div className={messageStyles}>
        {message}
      </div>
      {(status === 'success' || status === 'error') && onClose && (
        <button className={closeButtonStyles} onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
}; 