import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialUser = { phone: '', name: 'Ramesh Kumar Sharma', shop: 'Ramesh Agro Traders', loc: 'Khetgaon, MP', cat: 'agri' };

const initialInv = [
  {id:1,name:'IFFCO DAP 18:46:0',    cat:'Fertilizer',unit:'50kg bag',qty:20,buy:1200,sell:1350,icon:'grass',   clr:'#78f275',earn:13.50},
  {id:2,name:'Urea 46% N',           cat:'Fertilizer',unit:'50kg bag',qty:35,buy:240, sell:267, icon:'eco',     clr:'#a8f7a6',earn:2.67 },
  {id:3,name:'Gromor Amino Acid 40%',cat:'Pesticide', unit:'1L bottle',qty:8, buy:280, sell:320, icon:'science',clr:'#a0d2ff',earn:3.20 },
  {id:4,name:'Corteva Delegate 11.7%',cat:'Pesticide',unit:'250ml',   qty:5, buy:720, sell:845, icon:'biotech', clr:'#ffd060',earn:8.45 },
  {id:5,name:'PM Kisan Hybrid Seeds',cat:'Seed',      unit:'1kg pack',qty:50,buy:150, sell:180, icon:'spa',     clr:'#86efac',earn:1.80 },
  {id:6,name:'Chlorpyrifos 20% EC',  cat:'Pesticide', unit:'500ml',  qty:12,buy:380, sell:435, icon:'water_drop',clr:'#f9a8d4',earn:4.35},
];

const initialTxns = [
  {id:1, type:'purchase',label:'Sharma Agri Distributors', sub:'Invoice #SH-0891 · 5 products',date:'Today, 2:30 PM',  amt:'+₹1,180',clr:'#78f275',icon:'local_shipping'},
  {id:2, type:'sale',    label:'Sale to Suresh Yadav',      sub:'IFFCO DAP × 2 bags',           date:'Today, 11:20 AM',amt:'+₹27',   clr:'#ffd060',icon:'storefront'},
  {id:3, type:'sale',    label:'Sale to Ramesh Patel',      sub:'Urea 46% × 5 bags',            date:'Yesterday',      amt:'+₹13.35',clr:'#ffd060',icon:'storefront'},
  {id:4, type:'purchase',label:'Jain Agro Chemicals',       sub:'Invoice #JA-0341 · 3 products',date:'Aug 10',         amt:'+₹620',  clr:'#78f275',icon:'local_shipping'},
  {id:5, type:'sale',    label:'Sale to Prakash Singh',     sub:'Gromor Amino × 2',             date:'Aug 9',          amt:'+₹6.40', clr:'#ffd060',icon:'storefront'},
  {id:6, type:'withdraw',label:'Withdrawal to UPI',         sub:'ramesh@okicici',               date:'Aug 8',          amt:'-₹2,000',clr:'#ef4444',icon:'send_money'},
];

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
    setWalletBalance
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
