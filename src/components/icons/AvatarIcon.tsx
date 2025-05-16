import React, { useMemo } from 'react';

export const AvatarIcon = () => {
    // Генерация случайного цвета при каждом рендеринге
    const randomColor = useMemo(() => {
        // Используем яркие цвета для лучшей видимости
        const colors = [
            '#17E585', // зеленый (оригинальный)
            '#FF6D6F', // красный
            '#5D5FEF', // синий
            '#FFB800', // оранжевый/желтый
            '#00D1FF', // голубой
            '#FF00FF', // розовый
            '#7ED321', // салатовый
            '#9013FE', // фиолетовый
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g clipPath="url(#clip0_126_4806)">
                <rect width="20" height="20" rx="10" fill={randomColor}/>
                <rect x="-0.5" y="-0.5" width="21" height="21" fill="url(#pattern0_126_4806)"/>
            </g>
            <defs>
                <pattern id="pattern0_126_4806" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_126_4806" transform="scale(0.0104167)"/>
                </pattern>
                <clipPath id="clip0_126_4806">
                    <rect width="20" height="20" rx="10" fill="white"/>
                </clipPath>
                <image id="image0_126_4806" width="96" height="96" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAYKADAAQAAAABAAAAYAAAAACpM19OAAAC6ElEQVR4Ae2aQWokMRAEPcYHw7L/f6hZ2Jv3AUMgUi6lZiF8LKkzqyMtd9Htx+fvX99vAz9/v/48EpnU93/XJzbvtGC9Q8AAOpzRxQAQTWfBADqc0cUAEE1nIZpcJluiKYimHdpPPaU6tJ/0p+qegCmSmzoGsAlu6jIDmCK5qWMAm+CmLjOAKZKbOmNT0OkpZfP+ni6jaWeq/yfDRcETsAB0etkAThNe6BvAAtDpZQM4TXihbwALQKeX4ymIpoXT0wX5EqBb/ZAv9ekJIDKlugGUQJONARCZUt0ASqDJxgCITKn+mJouSv2+vE3K0xNwOVIDMIDLBC7bewIM4DKBy/Yf5E/vNNKnfKpP+1Nf6n9Kn3TIl/r3TxCRLNUNoASabAyAyJTqBlACTTYGQGRK9fhdUNpXOhXQ/tSX9tM0Qr60n/TTuicgJTa83wCGgaZyBpASG95vAMNAUzkDSIkN7z/+Lmhqikh1aKohfqk+6ZAv6XsCiGSpbgAl0GRjAESmVDeAEmiyMQAiU6rH/x2d9kVPf5oWSJ90aP+UfqpD/VDdE0BkSnUDKIEmGwMgMqW6AZRAk40BEJlSHb+IpU//dEqh+yPfVH9KJ+2T9lP/ngAiVqobQAk02RgAkSnVDaAEmmwMgMiU6vhFjPzpaU77aRqh/aT/ajpTfXoC6DehVDeAEmiyMQAiU6obQAk02RgAkSnV8YvY1FOe7uO0/i3f9L48AZRUqW4AJdBkYwBEplQ3gBJosjEAIlOqf9BTu+T/ZEP9TL0LejIsFei+PAGlAMjGAIhMqW4AJdBkYwBEplQ3gBJosom/iJHQVD2ddsiXdGgaIZ3TdU/AacILfQNYADq9bACnCS/0DWAB6PSyAZwmvNC/NgXRlLLo98fLt3ypcU8AkSnVDaAEmmwMgMiU6gZQAk02BkBkSnX8vyDyp3cprzZdUP9T9SkOnoCpRDZ1DGAT3NRlBjBFclPHADbBTV1mAFMkN3X+ATCIxJzPk8FUAAAAAElFTkSuQmCC"/>
            </defs>
        </svg>
    );
}; 