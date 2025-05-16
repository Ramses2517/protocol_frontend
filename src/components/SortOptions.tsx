import React from 'react';
import { css } from '@emotion/css';

export type SortOption = 'high-low' | 'low-high' | '';

interface SortOptionsProps {
    selectedOption: SortOption;
    onSortChange: (option: SortOption) => void;
}

export const SortOptions: React.FC<SortOptionsProps> = ({ selectedOption, onSortChange }) => {
    const sortOptionsStyles = css`
        display: flex;
        flex-direction: row;
        gap: 8px;
        overflow-x: auto;
        
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            display: none;
        }
        
    `;

    const buttonBaseStyles = css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 16px;

    `;

    const activeButtonStyles = css`
        ${buttonBaseStyles}
        color: #FFFFFF;
        background-color: #323232;
        border: 1px solid #323232;
        
    `;

    const inactiveButtonStyles = css`
        ${buttonBaseStyles}
        color: #F4F4F4A3;
        background-color: transparent;
        border: 1px solid #323232;
    `;

    return (
        <div className={sortOptionsStyles}>
            <button
                className={selectedOption === 'high-low' ? activeButtonStyles : inactiveButtonStyles}
                onClick={() => onSortChange('high-low')}
            >
                ↑ From high to low
            </button>

            <button
                className={selectedOption === 'low-high' ? activeButtonStyles : inactiveButtonStyles}
                onClick={() => onSortChange('low-high')}
            >
                ↓ From low to high
            </button>
        </div>
    );
}; 