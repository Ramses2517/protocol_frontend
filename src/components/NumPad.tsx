import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { BackspaceIcon } from './icons';

interface NumPadProps {
    onChange?: (value: string) => void;
    initialValue?: string;
    maxDecimals?: number;
    showPresets?: boolean;
    token?: string;
    usdValue?: string;
    mode?: string;
    maxAmount?: number;
}

export const NumPad: React.FC<NumPadProps> = ({
    onChange,
    initialValue = '0',
    maxDecimals = 6,
    showPresets = true,
    token,
    usdValue = "$0",
    mode = '',
    maxAmount = 0
}) => {
    const [value, setValue] = useState(initialValue);
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    
    // Флаг для режима покупки
    const isBuyMode = mode === 'buy';
    
    // Отображаемое значение с учетом режима (для buy добавляем $)
    const displayValue = isBuyMode ? `$${value}` : value;

    // Проверка usdValue на NaN и отображение корректного значения
    const displayUsdValue = usdValue === 'NaN' || usdValue === undefined ? '$0' : usdValue;

    // Отправляем значение в родительский компонент
    useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    // Сбрасываем значение при изменении режима
    useEffect(() => {
        setValue('0');
        setSelectedPreset(null);
    }, [mode]);

    const handleButtonClick = (digit: string) => {
        if (digit === 'delete') {
            setValue(prev => {
                if (prev.length <= 1) {
                    return '0';
                }
                return prev.slice(0, -1);
            });
            return;
        }

        if (digit === '.') {
            if (value.includes('.')) return;
            setValue(prev => prev + '.');
            return;
        }

        setValue(prev => {
            if (prev === '0' && digit !== '.') {
                return digit;
            }
            
            const parts = prev.split('.');
            if (parts.length > 1 && parts[1].length >= maxDecimals) {
                return prev;
            }
            
            return prev + digit;
        });

        setSelectedPreset(null);
    };

    const handlePresetClick = (percentage: number) => {
        if (maxAmount <= 0) {
            setValue(`${0}`);
        } else {
            const calculatedValue = (maxAmount * percentage) / 100;
            
            const formattedValue = calculatedValue.toFixed(maxDecimals).replace(/\.?0+$/, '');
            
            setValue(formattedValue);
        }
        
        setSelectedPreset(percentage);
    };

    const containerStyles = css`
        width: 100%;
    `;

    const displayStyles = css`
        font-family: "Chakra Petch";
        text-align: center;
        font-size: 52px;
        font-style: normal;
        font-weight: 600;
        line-height: 68px; /* 130.769% */
        color: #FFFFFF;
        margin-bottom: 4px;
    `;
    
    const usdValueStyles = css`
        color: #F4F4F4A3;
        text-align: center;
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        margin-bottom: 5%;
    `;

    const tokenDisplayStyles = css`
        font-size: 16px;
        color: #999999;
        text-align: center;
        margin-bottom: 16px;
        font-family: "DM Sans";
    `;

    const numpadRowStyles = css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #FFFFFF;
        margin-bottom: 4vh;
    `;

    const numpadButtonStyles = css`
        font-family: "Chakra Petch";
        font-size: 5vh;
        font-style: normal;
        flex: 1 0 0;
        font-weight: 600;
        line-height: 42px; /* 131.25% */
        color: #FFFFFF;
    `;

    const presetsStyles = css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2vh;
        gap: 8px;
    `;

    const presetButtonStyles = css`
        background-color: #17E58529;
        color: #17E585;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
        font-family: "DM Sans";
        border: none;
        flex: 1;
        display: flex;
        padding: 4px 12px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        font-family: "Chakra Petch";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 24px; /* 150% */
        flex: 1 0 0;
    `;

    return (
        <div className={containerStyles}>
            <div className={displayStyles}>
                {displayValue}
            </div>
            <div className={usdValueStyles}>
            ≈{displayUsdValue}
            </div>

            {showPresets && (
                <div className={presetsStyles}>
                    <button 
                        className={`${presetButtonStyles} ${selectedPreset === 10 ? 'active' : ''}`}
                        onClick={() => handlePresetClick(10)}
                    >
                        10%
                    </button>
                    <button 
                        className={`${presetButtonStyles} ${selectedPreset === 25 ? 'active' : ''}`}
                        onClick={() => handlePresetClick(25)}
                    >
                        25%
                    </button>
                    <button 
                        className={`${presetButtonStyles} ${selectedPreset === 50 ? 'active' : ''}`}
                        onClick={() => handlePresetClick(50)}
                    >
                        50%
                    </button>
                    <button 
                        className={`${presetButtonStyles} ${selectedPreset === 100 ? 'active' : ''}`}
                        onClick={() => handlePresetClick(100)}
                    >
                        100%
                    </button>
                </div>
            )}

            <div>
                <div className={numpadRowStyles}>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('1')}>1</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('2')}>2</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('3')}>3</button>
                </div>
                <div className={numpadRowStyles}>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('4')}>4</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('5')}>5</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('6')}>6</button>
                </div>
                <div className={numpadRowStyles}>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('7')}>7</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('8')}>8</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('9')}>9</button>
                </div>
                <div className={numpadRowStyles}>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('.')}>.</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('0')}>0</button>
                    <button className={numpadButtonStyles} onClick={() => handleButtonClick('delete')}><BackspaceIcon /></button>
                </div>
            </div>
        </div>
    );
}; 