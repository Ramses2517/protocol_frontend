import React from 'react';
import { css } from '@emotion/css';

interface SpinnerIconProps {
    width?: number;
    height?: number;
    className?: string;
}

export const SpinnerIcon: React.FC<SpinnerIconProps> = ({
    width = 20,
    height = 20,
    className = '',
}) => {
    const spinnerStyles = css`
    width: ${width}px;
    height: ${height}px;
    aspect-ratio: 1/1;
    animation: rotate 1.5s linear infinite;
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

    return (
        <svg
            className={`${spinnerStyles} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 24"
            fill="none"
        >
            <path
                d="M16.1 2.67048C17.3251 3.14317 18.4452 3.85255 19.3963 4.75812C20.3473 5.66369 21.1107 6.74771 21.6428 7.9483C22.1749 9.14889 22.4653 10.4425 22.4975 11.7553C22.5296 13.0682 22.3029 14.3745 21.8302 15.5997C21.3575 16.8249 20.6481 17.945 19.7426 18.896C18.837 19.8471 17.753 20.6104 16.5524 21.1425C15.3518 21.6746 14.0582 21.9651 12.7453 21.9972C11.4325 22.0294 10.1262 21.8026 8.90102 21.3299C7.67582 20.8572 6.55572 20.1479 5.60468 19.2423C4.65363 18.3367 3.89027 17.2527 3.35816 16.0521C2.82606 14.8515 2.53564 13.5579 2.50348 12.2451C2.47133 10.9322 2.69807 9.62594 3.17076 8.40074C3.64345 7.17554 4.35283 6.05544 5.2584 5.1044C6.16397 4.15336 7.24799 3.38999 8.44858 2.85789C9.64917 2.32578 10.9428 2.03536 12.2556 2.00321C13.5685 1.97105 14.8748 2.19779 16.1 2.67048L16.1 2.67048Z"
                stroke="#F4F4F4"
                strokeOpacity="0.64"
                strokeWidth="3.33333"
            />
            <path
                d="M16.1 2.67048C18.0702 3.43061 19.7492 4.79497 20.8964 6.56801C22.0436 8.34105 22.6 10.4318 22.4859 12.5405"
                stroke="#111312"
                strokeWidth="3.33333"
                strokeLinecap="round"
            />
        </svg>
    );
}; 