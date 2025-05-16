import React from 'react';
import { css } from '@emotion/css';
import { SpinnerIcon } from './icons';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'action';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  leftIcon,
  rightIcon,
  className = '',
  isLoading = false,
}) => {
  const baseButtonStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: ${disabled || isLoading ? 'not-allowed' : 'pointer'};
    opacity: ${disabled || isLoading ? 0.6 : 1};
    width: ${fullWidth ? '100%' : 'auto'};
    text-align: center;
    outline: none;
    border: none;
    gap: 4px;
    align-self: stretch;
  `;

  const variantStyles = {
    primary: css`
      background-color: #17E585;
      color: #111312;
      font-family: "DM Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 20px;
      padding: 12px 16px;
      &:hover {
        background-color: #6EFFBC;
      }
    `,
    secondary: css`
      background-color: #323232;
      display: flex;
      padding: 12px 16px;
      justify-content: center;
      align-items: center;
      gap: 4px;
      color: #17E585;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: "DM Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 20px;
      &:hover {
        background-color: #505050;
      }
    `,
    action: css`
      background-color: rgba(23, 229, 133, 0.16);
      color: #17E585;
      padding: 10px 16px;
      flex: 1 0 0;
      &:hover {
        background-color: rgba(23, 229, 133, 0.24);
      }
    `,
  };

  // Стили для разных размеров кнопок
  const sizeStyles = {
    small: css`
      font-size: 14px;
    `,
    medium: css`
      font-size: 16px;
    `,
    large: css`
      font-size: 18px;
    `,
  };

  const buttonStyles = `${baseButtonStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading ? (
        <div className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        `}>
          <SpinnerIcon width={24} height={24} />
        </div>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}; 