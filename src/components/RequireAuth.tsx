import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';

interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, redirectTo }) => {
    const { isConnected } = useTonWalletContext();

    // Если пользователь не авторизован, перенаправляем на указанный маршрут
    if (!isConnected) {
        return <Navigate to={redirectTo} replace />;
    }

    // Если пользователь авторизован, показываем защищенный контент
    return <>{children}</>;
}; 