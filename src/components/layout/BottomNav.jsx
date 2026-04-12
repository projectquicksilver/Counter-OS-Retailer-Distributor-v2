import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavClass = (path) => {
    return `nb ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <div className="bnav">
      <button className={getNavClass('/home')} onClick={() => navigate('/home')}>
        <span className="material-symbols-outlined">home</span>Home
      </button>
      <button className={getNavClass('/invoice')} onClick={() => navigate('/invoice')}>
        <span className="material-symbols-outlined">upload_file</span>Invoice
      </button>
      <button className={getNavClass('/sell')} onClick={() => navigate('/sell')}>
        <span className="material-symbols-outlined">storefront</span>Sell
      </button>
      <button className={getNavClass('/earnings')} onClick={() => navigate('/earnings')}>
        <span className="material-symbols-outlined">analytics</span>Earnings
      </button>
      <button className={getNavClass('/inventory')} onClick={() => navigate('/inventory')}>
        <span className="material-symbols-outlined">inventory_2</span>Stock
      </button>
    </div>
  );
};
