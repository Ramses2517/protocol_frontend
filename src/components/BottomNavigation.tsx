import React from 'react';
import { css } from '@emotion/css';
import { NavLink, useLocation } from 'react-router-dom';
import { HomePageIcon, PortfolioPageIcon, RewardsPageIcon } from './icons';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/home', icon: <HomePageIcon />, label: 'Home' },
    { path: '/rewards', icon: <RewardsPageIcon />, label: 'Rewards' },
    { path: '/portfolio', icon: <PortfolioPageIcon />, label: 'Portfolio' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const navigationContainerStyles = css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #121212;
    border-top: 1px solid var(--Stroke-Primary, #323232);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 10;
    height: 84px;
    padding-bottom: 0;
  `;

  const navigationItemStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    height: 100%;
    text-decoration: none;
    color: rgba(244, 244, 244, 0.64);
    font-size: 12px;
    padding: 10px 0 28px 0;
  `;

  const activeItemStyles = css`
    color: #17E585;
    
    svg {
      color: #17E585;
    }
    
    svg path, svg rect, svg circle, svg g {
      stroke: #17E585;
      fill: #17E585;
    }
    
    /* Черточка внутри иконки дома */
    svg #vector_2 {
      stroke: #111312;
    }    
  `;

  const iconStyles = css`
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const labelStyles = css`
    font-size: 12px;
  `;

  return (
    <nav className={navigationContainerStyles}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={`${navigationItemStyles} ${isActive(item.path) ? activeItemStyles : ''}`}
        >
          <div className={iconStyles}>{item.icon}</div>
          <div className={labelStyles}>{item.label}</div>
        </NavLink>
      ))}
    </nav>
  );
}; 