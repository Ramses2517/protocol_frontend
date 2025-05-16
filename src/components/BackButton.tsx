import React from 'react';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    /** Если задан, то будет переход на указанный маршрут вместо истории браузера */
    to?: string;
}

/**
 * Кнопка "Назад", использующая историю браузера или указанный маршрут
 */
export const BackButton: React.FC<BackButtonProps> = ({ to }) => {
    const navigate = useNavigate();

    const backButtonStyles = css`
    position: absolute;
    top: 24px;
    left: 24px;
    font-size: 24px;
    cursor: pointer;
    color: #FFFFFF;
    background: none;
    border: none;
    padding: 4px;
    z-index: 10;
  `;

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            // Возвращаемся на предыдущую страницу в истории браузера
            navigate(-1);
        }
    };

    return (
        <button className={backButtonStyles} onClick={handleBack}>
            ←
        </button>
    );
}; 