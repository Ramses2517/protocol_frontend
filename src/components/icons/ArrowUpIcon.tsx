import React from 'react';

interface ArrowUpIconProps {
    color?: string;
}

export const ArrowUpIcon: React.FC<ArrowUpIconProps> = ({ color = '#F4F4F4A3' }) => {
    return (
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="arrow-up">
                <path id="Icon" d="M10.75 2C11.0152 2 11.2696 2.10536 11.4571 2.29289L17.4571 8.29289C17.8476 8.68342 17.8476 9.31658 17.4571 9.70711C17.0666 10.0976 16.4334 10.0976 16.0429 9.70711L11.75 5.41421L11.75 17C11.75 17.5523 11.3023 18 10.75 18C10.1977 18 9.75 17.5523 9.75 17L9.75 5.41421L5.45711 9.70711C5.06658 10.0976 4.43342 10.0976 4.04289 9.70711C3.65237 9.31658 3.65237 8.68342 4.04289 8.29289L10.0429 2.29289C10.2304 2.10536 10.4848 2 10.75 2Z" fill={color}/>
            </g>
        </svg>
    );
}; 