import React from 'react';
import { css } from '@emotion/css';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { useTonWalletContext } from '../shared/contexts/TonWalletContext';
import { ROUTES } from '../shared/constants/routes';

interface LayoutProps {
    requireWallet?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ requireWallet = false }) => {
    const location = useLocation();
    const { isConnected } = useTonWalletContext();

    if (requireWallet && !isConnected) {
        return <Navigate to="/" replace />;
    }

    const layoutStyles = css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        color: white;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    `;

    const contentStyles = css`
        flex: 1;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    `;

    const isPortfolioPage = location.pathname === ROUTES.PORTFOLIO;
    const isSelectTokenPage = location.pathname === ROUTES.SELECT_TOKEN;
    const isHomePage = location.pathname === '/home';
    const isRewardsPage = location.pathname === '/rewards';

    const showBottomNav = isPortfolioPage || isSelectTokenPage || isHomePage || isRewardsPage;

    return (
        <div className={layoutStyles}>
            <main className={contentStyles}>
                <Outlet />
            </main>
            {showBottomNav && <BottomNavigation />}
        </div>
    );
}; 