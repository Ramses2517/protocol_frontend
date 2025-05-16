import React from 'react';

interface ErrorIconProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ErrorIcon: React.FC<ErrorIconProps> = ({
    width = 16,
    height = 16,
    color = '#FF5252'
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="8" cy="8" r="7.5" stroke={color} />
            <path d="M8 4.5V9.5" stroke={color} strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.5" fill={color} />
        </svg>
    );
}; 