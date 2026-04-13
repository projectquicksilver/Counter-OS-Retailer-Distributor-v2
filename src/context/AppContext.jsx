import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialUser = { phone: '', name: 'Ramesh Kumar Sharma', shop: 'Ramesh Agro Traders', loc: 'Khetgaon, MP', cat: 'agri' };

const initialInv = [
  {id:100, name: 'Gromor Amino Acid 40%', cat:'Agri', unit:'1L', qty:45, buy:280, sell:320, icon:'science', clr:'#78f275', earn:17, code:'P1001'},
  {id:101, name: 'IFFCO DAP 18:46:0', cat:'Fertilizer', unit:'50kg', qty:10, buy:1200, sell:1350, icon:'agriculture', clr:'#ffd060', earn:25, code:'P1002'}
];

const initialTxns = [
  {id:1, type:'purchase',label:'Sharma Agri Distributors', sub:'Invoice #SH-0891 · 5 products',date:'Today, 2:30 PM',  amt:'+₹1,180',clr:'#78f275',icon:'local_shipping'},
  {id:2, type:'sale',    label:'Sale to Suresh Yadav',      sub:'IFFCO DAP × 2 bags',           date:'Today, 11:20 AM',amt:'+₹27',   clr:'#ffd060',icon:'storefront'},
  {id:3, type:'sale',    label:'Sale to Ramesh Patel',      sub:'Urea 46% × 5 bags',            date:'Yesterday',      amt:'+₹13.35',clr:'#ffd060',icon:'storefront'},
  {id:4, type:'purchase',label:'Jain Agro Chemicals',       sub:'Invoice #JA-0341 · 3 products',date:'Aug 10',         amt:'+₹620',  clr:'#78f275',icon:'local_shipping'},
  {id:5, type:'sale',    label:'Sale to Prakash Singh',     sub:'Gromor Amino × 2',             date:'Aug 9',          amt:'+₹6.40', clr:'#ffd060',icon:'storefront'},
  {id:6, type:'withdraw',label:'Withdrawal to UPI',         sub:'ramesh@okicici',               date:'Aug 8',          amt:'-₹2,000',clr:'#ef4444',icon:'send_money'},
];

import { Intelligence } from '../services/intelligence';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [theme, setTheme] = useState('dark');
  const [inventory, setInventory] = useState(initialInv);
  const [transactions, setTransactions] = useState(initialTxns);
  const [cart, setCart] = useState([]);
  const [linkedDists, setLinkedDists] = useState([]);
  const [walletBalance, setWalletBalance] = useState(3482.50);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const initializeAIStore = async (category) => {
    // Generate AI products based on user category
    const parsedData = await Intelligence.generateInventory(category);
    if (parsedData && parsedData.length > 0) {
      // Add a simple code for each product for demo scanning
      const withCodes = parsedData.map((p, i) => ({
        ...p,
        id: p.id || Date.now() + i,
        code: `P${1000 + i}`
      }));
      setInventory(withCodes);
    } else {
      // Emergency fallback if Gemini fails
      setInventory([
        {id:1,name: category + ' Item 1', cat:'Retail',unit:'piece',qty:20,buy:100,sell:120,icon:'inventory_2',clr:'#78f275',earn:20,code:'P1001'},
        {id:2,name: category + ' Item 2', cat:'Retail',unit:'unit',qty:15,buy:200,sell:230,icon:'inventory_2',clr:'#ffd060',earn:30,code:'P1002'}
      ]);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
                 .filter(item => item.qty > 0);
    });
  };

  const clearCart = () => setCart([]);

  const addTransaction = (txn) => {
    setTransactions(prev => [{...txn, id: Date.now()}, ...prev]);
  };

  const addInventoryItem = (item) => {
    // Reward logic for inbound (distributor purchase)
    // 0 < 5000: 0, 5000-10000: 5%, >10000: 10%
    const purchaseTotal = Number(item.buy) * Number(item.qty);
    let reward = 0;
    if (purchaseTotal >= 10000) reward = purchaseTotal * 0.1;
    else if (purchaseTotal >= 5000) reward = purchaseTotal * 0.05;

    if (reward > 0) {
      setWalletBalance(prev => prev + reward);
      addTransaction({
        type: 'purchase',
        label: 'Purchase Reward',
        sub: `Cashback on ${item.name}`,
        date: 'Just now',
        amt: '+₹' + reward.toFixed(0),
        clr: '#78f275',
        icon: 'card_giftcard'
      });
    }

    setInventory(prev => [{
      ...item, 
      id: Date.now(), 
      code: item.code || `P${1000 + prev.length}`,
      mfg: item.mfg || '2024-06',
      exp: item.exp || '2027-05'
    }, ...prev]);
  };

  const completeSale = (customerName, customerPhone, usedOtp = false) => {
    const baseEarned = cart.reduce((s, c) => s + c.earn * c.qty, 0);
    const otpBonus = usedOtp ? 5 : 0;
    const earned = +(baseEarned + otpBonus).toFixed(2);
    
    const firstItem = cart[0]?.name.split(' ').slice(0, 3).join(' ') || 'Products';
    const ct = cart.reduce((s, c) => s + c.qty, 0);
    
    // deduct from inventory
    setInventory(prev => {
      const nextInv = [...prev];
      cart.forEach(c => {
        const p = nextInv.find(x => x.id === c.id);
        if (p) p.qty = Math.max(0, p.qty - c.qty);
      });
      return nextInv;
    });

    addTransaction({
      type: 'sale',
      label: 'Sale to ' + customerName,
      sub: firstItem + ' · ' + ct + ' items',
      date: 'Just now',
      amt: '+₹' + earned,
      clr: '#ffd060',
      icon: 'storefront'
    });
    setWalletBalance(prev => prev + earned);
    clearCart();
    return earned;
  };

  const value = {
    user,
    setUser,
    theme,
    toggleTheme,
    inventory,
    setInventory,
    addInventoryItem,
    transactions,
    addTransaction,
    cart,
    addToCart,
    updateCartQty,
    clearCart,
    completeSale,
    linkedDists,
    setLinkedDists,
    walletBalance,
    setWalletBalance,
    initializeAIStore
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
