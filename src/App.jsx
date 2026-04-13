import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

import { Login } from './screens/Login';
import { ShopSetup } from './screens/onboarding/ShopSetup';
import { Distributor } from './screens/onboarding/Distributor';
import { Payout } from './screens/onboarding/Payout';
import { Ready } from './screens/onboarding/Ready';
import { Home } from './screens/Home';
import { Sell } from './screens/Sell';
import { Cart } from './screens/Cart';
import { Success } from './screens/Success';
import { Earnings } from './screens/Earnings';
import { Inventory } from './screens/Inventory';
import { AddInventory } from './screens/AddInventory';
import { Wallet } from './screens/Wallet';
import { WalletAdd } from './screens/WalletAdd';
import { WalletWithdraw } from './screens/WalletWithdraw';
import { Settings } from './screens/Settings';
import { Assistant } from './screens/Assistant';
import { Toast } from './components/ui/Toast';

function App() {
  const { theme } = useAppContext();

  // Create a Toast component later. For now just root shell.
  return (
    <Router>
      <div className="shell" id="shell">
        <canvas id="confetti-c"></canvas>
        <Toast />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup/shop" element={<ShopSetup />} />
          <Route path="/setup/distributor" element={<Distributor />} />
          <Route path="/setup/payout" element={<Payout />} />
          <Route path="/setup/ready" element={<Ready />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/invoice" element={<AddInventory />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/add" element={<WalletAdd />} />
          <Route path="/wallet/withdraw" element={<WalletWithdraw />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/sales" element={<Earnings />} /> {/* Fallback route for Khata */}
          {/* Main App Routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
