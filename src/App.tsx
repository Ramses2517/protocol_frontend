import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TonWalletProvider, useTonWalletContext } from './shared/contexts/TonWalletContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Rewards } from './pages/Rewards';
import { Trade } from './pages/Trade';
import { Deposit } from './pages/Deposit';
import { StartPage } from './pages/StartPage';
import { SelectToken } from './pages/SelectToken';
import { Withdraw } from './pages/Withdraw';
import { TransactionStatus } from './pages/TransactionStatus';
import { SearchTokens } from './pages/SearchTokens';
import { WebStub } from './components/WebStub';
import "./App.css";


import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';

// Компонент-обертка для проверки наличия initData
const AppContent: React.FC = () => {
  const { initData } = useTonWalletContext();
  
  // Если initData не получен, показываем WebStub
  if (!initData) {
    return <WebStub />;
  }
  
  // Иначе показываем основное приложение
  return (
    <Router>
      <Routes>
        {/* Стартовая страница подключения кошелька */}
        <Route path="/" element={<StartPage />} />

        {/* Страницы с общим Layout и нижней навигацией */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="portfolio" element={
            <RequireAuth redirectTo="/">
              <Portfolio />
            </RequireAuth>
          } />
          <Route path="select-token" element={
            <RequireAuth redirectTo="/">
              <SelectToken />
            </RequireAuth>
          } />
        </Route>

        {/* Страницы с Layout, но без нижней навигации */}
        <Route path="/" element={<Layout />}>
          <Route path="trade/:tokenId" element={
            <RequireAuth redirectTo="/">
              <Trade />
            </RequireAuth>
          } />
          <Route path="deposit" element={
            <RequireAuth redirectTo="/">
              <Deposit />
            </RequireAuth>
          } />
          <Route path="withdraw" element={
            <RequireAuth redirectTo="/">
              <Withdraw />
            </RequireAuth>
          } />
          <Route path="transaction/status" element={
            <RequireAuth redirectTo="/">
              <TransactionStatus />
            </RequireAuth>
          } />
          <Route path="search" element={
            <SearchTokens />
          } />
        </Route>

        {/* Редирект на стартовую страницу по умолчанию */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export const App: React.FC = () => {
  const manifestUrl = 'https://protocol.frogtracker.app/tonconnect-manifest.json';

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TonWalletProvider>
        <AppContent />
      </TonWalletProvider>
    </TonConnectUIProvider>
  );
};
