import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialUser = { phone: '', name: 'Ramesh Kumar Sharma', shop: 'Ramesh Agro Traders', loc: 'Khetgaon, MP', cat: 'agri' };

const initialInv = [];

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
      setInventory(parsedData);
    } else {
      // Emergency fallback if Gemini fails
      setInventory([
        {id:1,name: category + ' Item 1', cat:'Retail',unit:'piece',qty:20,buy:100,sell:120,icon:'inventory_2',clr:'#78f275',earn:20},
        {id:2,name: category + ' Item 2', cat:'Retail',unit:'unit',qty:15,buy:200,sell:230,icon:'inventory_2',clr:'#ffd060',earn:30}
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
    setInventory(prev => [{...item, id: prev.length + 1}, ...prev]);
  };

  const completeSale = (customerName, customerPhone) => {
    const earned = +(cart.reduce((s, c) => s + c.earn * c.qty, 0) + 5).toFixed(2);
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
