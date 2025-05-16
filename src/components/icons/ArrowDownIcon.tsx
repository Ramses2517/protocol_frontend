import React from 'react';

interface ArrowDownIconProps {
    color?: string;
}

export const ArrowDownIcon: React.FC<ArrowDownIconProps> = ({ color = '#F4F4F4A3' }) => {
    return (
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="arrow-down">
                <path id="Icon" d="M10.75 2C11.3023 2 11.75 2.44772 11.75 3V14.5858L16.0429 10.2929C16.4334 9.90237 17.0666 9.90237 17.4571 10.2929C17.8476 10.6834 17.8476 11.3166 17.4571 11.7071L11.4571 17.7071C11.0666 18.0976 10.4334 18.0976 10.0429 17.7071L4.04289 11.7071C3.65237 11.3166 3.65237 10.6834 4.04289 10.2929C4.43342 9.90237 5.06658 9.90237 5.45711 10.2929L9.75 14.5858V3C9.75 2.44772 10.1977 2 10.75 2Z" fill={color}/>
            </g>
        </svg>
    );
}; 