import React from 'react';
import { css } from '@emotion/css';

export const WithdrawArrowIcon = () => {
    const iconStyles = css`
        padding-top: 4px;
    `;

    return (
        <div className={iconStyles}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M8.5 7C8.5 6.44772 8.94772 6 9.5 6L17.5 6C18.0523 6 18.5 6.44772 18.5 7V15C18.5 15.5523 18.0523 16 17.5 16C16.9477 16 16.5 15.5523 16.5 15V9.41421L8.20711 17.7071C7.81658 18.0976 7.18342 18.0976 6.79289 17.7071C6.40237 17.3166 6.40237 16.6834 6.79289 16.2929L15.0858 8L9.5 8C8.94772 8 8.5 7.55228 8.5 7Z" fill="#17E585"/>
            </svg>
        </div>
    );
};  

