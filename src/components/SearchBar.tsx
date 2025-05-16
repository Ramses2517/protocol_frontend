import React from 'react';
import { css } from '@emotion/css';
import { SearchIcon, CloseIcon } from './icons';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    onClear?: () => void;
    readOnly?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search',
    value = '',
    onChange,
    onClick,
    onClear,
    readOnly = false
}) => {
    const searchContainerStyles = css`
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    background: var(--Background-Floor-1, #323232);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25) inset;
    align-items: center;
    gap: 8px;
    cursor: ${onClick ? 'pointer' : 'text'};
    padding: 12px 16px;
  `;

    const searchIconStyles = css`
    padding-top: 4px;
  `;

    const searchInputStyles = css`
    flex: 1;
    background: transparent;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 125% */
    color: #F4F4F4A3;
    border: none;
    outline: none;
    
    &::placeholder {
      color: #F4F4F4A3;
    }
  `;

    const clearButtonStyles = css`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  `;

    const handleContainerClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClear) {
            onClear();
        }
    };

    return (
        <div
            className={searchContainerStyles}
            onClick={handleContainerClick}
        >
            <div className={searchIconStyles}>
                <SearchIcon />
            </div>
            {onClick && readOnly ? (
                <div className={searchInputStyles}>
                    {placeholder}
                </div>
            ) : (
                <input
                    type="text"
                    className={searchInputStyles}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            )}
            {value && onClear && (
                <button className={clearButtonStyles} onClick={handleClear}>
                    <CloseIcon />
                </button>
            )}
        </div>
    );
}; 