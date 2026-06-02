import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialUser = { phone: '', name: 'Ramesh Kumar Sharma', shop: 'Ramesh Agro Traders', loc: 'Khetgaon, MP', cat: '', role: '' };

const initialInv = [];

const initialTxns = [];

const getInitialTransactions = (category) => {
  const txns = {
    agri: [
      {id:1, type:'purchase',label:'Sharma Agri Distributors', sub:'Invoice · 5 prod',date:'Today, 2:30 PM',  amt:'+₹1,180',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Suresh',sub:'IFFCO DAP × 2',date:'Today, 11 AM',amt:'+₹27',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to Patel',sub:'Urea × 5 bags',date:'Yesterday',amt:'+₹13',clr:'#ffd060',icon:'storefront'},
    ],
    food: [
      {id:1, type:'purchase',label:'Metro Wholesale', sub:'Invoice · 8 prod',date:'Today, 2:30 PM',  amt:'+₹2,400',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Local',sub:'Rice Basmati × 5',date:'Today, 11 AM',amt:'+₹85',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to Patel',sub:'Mustard Oil × 3',date:'Yesterday',amt:'+₹42',clr:'#ffd060',icon:'storefront'},
    ],
    pharma: [
      {id:1, type:'purchase',label:'Medline Pharma', sub:'Invoice · 6 prod',date:'Today, 2:30 PM',  amt:'+₹3,200',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Patient',sub:'Aspirin × 2 strips',date:'Today, 11 AM',amt:'+₹45',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to Customer',sub:'Vitamin D3 × 1',date:'Yesterday',amt:'+₹72',clr:'#ffd060',icon:'storefront'},
    ],
    hardware: [
      {id:1, type:'purchase',label:'BuildRight Hardware', sub:'Invoice · 4 prod',date:'Today, 2:30 PM',  amt:'+₹2,800',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Constructor',sub:'Hammer × 3 pcs',date:'Today, 11 AM',amt:'+₹120',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to DIY',sub:'Paint Brush × 2',date:'Yesterday',amt:'+₹65',clr:'#ffd060',icon:'storefront'},
    ],
    textile: [
      {id:1, type:'purchase',label:'Fashion Fabric House', sub:'Invoice · 5 prod',date:'Today, 2:30 PM',  amt:'+₹4,500',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Boutique',sub:'Cotton T-Shirt × 12',date:'Today, 11 AM',amt:'+₹180',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to Retailer',sub:'Denim Jeans × 3',date:'Yesterday',amt:'+₹120',clr:'#ffd060',icon:'storefront'},
    ],
    electronics: [
      {id:1, type:'purchase',label:'TechHub Distributors', sub:'Invoice · 6 prod',date:'Today, 2:30 PM',  amt:'+₹5,200',clr:'#78f275',icon:'local_shipping'},
      {id:2, type:'sale',label:'Sale to Tech',sub:'USB Cable × 10',date:'Today, 11 AM',amt:'+₹95',clr:'#ffd060',icon:'storefront'},
      {id:3, type:'sale',label:'Sale to Customer',sub:'Phone Charger × 2',date:'Yesterday',amt:'+₹280',clr:'#ffd060',icon:'storefront'},
    ],
  };

  return txns[category] || txns.food;
};

import { Intelligence } from '../services/intelligence';

// LocalStorage Keys
const STORAGE_KEYS = {
  user: 'counterOS_user',
  inventory: 'counterOS_inventory',
  wallet: 'counterOS_wallet',
  theme: 'counterOS_theme',
  distOrders: 'counterOS_distOrders',
  myRetailers: 'counterOS_myRetailers',
  notifications: 'counterOS_notifications'
};

const initialRetailers = [
  { id: 'RET-001', name: 'Ramesh Agro Traders', ltv: 125000, tier: 'Gold', lastOrder: '2 days ago' },
  { id: 'RET-002', name: 'Kisan Kendra', ltv: 85000, tier: 'Silver', lastOrder: '1 week ago' },
  { id: 'RET-003', name: 'Green Farm Supply', ltv: 210000, tier: 'Diamond', lastOrder: 'Today' }
];

const initialOrders = [
  { id: 'ORD-8291', retailer: 'Ramesh Agro Traders', items: 12, total: 4500, status: 'pending', time: '10 mins ago', date: new Date().toISOString() },
  { id: 'ORD-8290', retailer: 'Kisan Kendra', items: 5, total: 1280, status: 'fulfilled', time: '2 hours ago', date: new Date().toISOString() }
];

// Helper functions for localStorage
const loadFromStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [user, setUserState] = useState(() => loadFromStorage(STORAGE_KEYS.user, initialUser));
  const [theme, setThemeState] = useState(() => loadFromStorage(STORAGE_KEYS.theme, 'dark'));
  const [inventory, setInventoryState] = useState(() => loadFromStorage(STORAGE_KEYS.inventory, initialInv));
  const [distOrdersState, setDistOrdersState] = useState(() => loadFromStorage(STORAGE_KEYS.distOrders, initialOrders));
  const [myRetailersState, setMyRetailersState] = useState(() => loadFromStorage(STORAGE_KEYS.myRetailers, initialRetailers));
  const [transactions, setTransactions] = useState(() => {
    const restoredUser = loadFromStorage(STORAGE_KEYS.user, initialUser);
    console.log(`📊 Initializing category-appropriate transactions for: ${restoredUser.cat || 'food'}`);
    return getInitialTransactions(restoredUser.cat || 'food');
  });
  const [cart, setCart] = useState([]);
  const [linkedDists, setLinkedDists] = useState([]);
  const [walletBalance, setWalletBalanceState] = useState(() => loadFromStorage(STORAGE_KEYS.wallet, 3482.50));
  const [notifications, setNotificationsState] = useState(() => loadFromStorage(STORAGE_KEYS.notifications, []));
  
  const [globalPopup, setGlobalPopup] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // ─── POPUP SYSTEM ───────────────────────────────────────────────────────────
  // Rule: user.role in React state is PER-TAB (initialized from localStorage once
  // on mount, not updated when other tabs change it). So checking user.role here
  // correctly tells us which role THIS TAB is logged in as.
  //
  // showGlobalPopup(popup, 'distributor') -> writes to localStorage
  // -> storage event fires ONLY in OTHER tabs -> those tabs check their own
  //    user.role to decide whether to show it.
  // ─────────────────────────────────────────────────────────────────────────────

  const showGlobalPopup = (popup, targetRole) => {
    if (!popup) { setGlobalPopup(null); return; }

    if (!targetRole) {
      // No target - show in current tab immediately
      setGlobalPopup(popup);
      return;
    }

    // Write to localStorage. The storage event fires in ALL other tabs.
    // Current tab does NOT receive its own storage events.
    localStorage.setItem(
      `counterOS_popup_for_${targetRole}`,
      JSON.stringify({ ...popup, savedAt: Date.now() })
    );
    // Note: if both tabs are the same role (unusual), no cross-tab delivery needed.
    // The single-tab fallback below (on role login) handles it.
  };


  // Wrapper functions that also persist to localStorage
  const setUser = (updater) => {
    setUserState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      console.log(`💾 Saving user to localStorage:`, updated);
      saveToStorage(STORAGE_KEYS.user, updated);
      return updated;
    });
  };

  const setTheme = (theme) => {
    setThemeState(theme);
    saveToStorage(STORAGE_KEYS.theme, theme);
  };

  const setInventory = (updater) => {
    setInventoryState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      console.log(`💾 Saving ${updated.length} items to inventory storage`);
      saveToStorage(STORAGE_KEYS.inventory, updated);
      return updated;
    });
  };

  const setNotifications = (updater) => {
    setNotificationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.notifications, next);
      return next;
    });
  };

  const setDistOrders = (updater) => {
    setDistOrdersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage('counterOS_distOrders', next);
      return next;
    });
  };

  const setMyRetailers = (updater) => {
    setMyRetailersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage('counterOS_myRetailers', next);
      return next;
    });
  };

  const setWalletBalance = (updater) => {
    setWalletBalanceState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.wallet, updated);
      return updated;
    });
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{ ...notif, id: Date.now(), isRead: false, time: 'Just now' }, ...prev]);
  };

  // Sync theme to HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ─── On login: check if there's a saved popup for this role ─────────────────
  // This covers single-tab scenario: Retailer places order, logs out, logs in as
  // Distributor -> finds the saved popup in localStorage and shows it.
  useEffect(() => {
    const role = user?.role;
    if (!role) return;
    const saved = localStorage.getItem(`counterOS_popup_for_${role}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Date.now() - data.savedAt < 10 * 60 * 1000) {
          // Delay slightly so the page finishes transitioning
          setTimeout(() => setGlobalPopup(data), 600);
        }
      } catch(e) {}
      localStorage.removeItem(`counterOS_popup_for_${role}`);
    }
  }, [user?.role]);

  // ─── Cross-tab: storage event fires in OTHER tabs when localStorage changes ──
  // Tab 1 (Retailer) writes to counterOS_popup_for_distributor.
  // Tab 2 (Distributor) receives the storage event.
  // Tab 2 checks its own user.role (React state, per-tab) == 'distributor' -> show.
  useEffect(() => {
    const handleStorage = (e) => {
      // Popup delivery to this tab
      if (e.key === `counterOS_popup_for_${user?.role}` && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (Date.now() - data.savedAt < 10 * 60 * 1000) {
            setGlobalPopup(data);
          }
          // Remove so it doesn't show again on role-change useEffect
          localStorage.removeItem(`counterOS_popup_for_${user?.role}`);
        } catch(e) {}
      }
      // Sync distOrders across tabs
      if (e.key === 'counterOS_distOrders' && e.newValue) {
        setDistOrdersState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.role]);

  // When user category changes, clear AND reset inventory from storage with new category
  useEffect(() => {
    if (user.cat) {
      const storedInv = loadFromStorage(STORAGE_KEYS.inventory, []);
      // Check if stored inventory matches current category
      if (storedInv.length > 0) {
        const firstItemCat = storedInv[0]?.cat;
        
        // Map category codes to their expected item categories
        const catMapping = {
          agri: ['Fertilizers', 'Seeds', 'Pesticides'],
          food: ['Grains', 'Flour', 'Oils', 'Legumes'],
          pharma: ['Analgesics', 'Vitamins', 'Cough & Cold'],
          hardware: ['Hand Tools', 'Power Tools', 'Fasteners'],
          textile: ['T-Shirts', 'Jeans', 'Traditional', 'Bedding'],
          electronics: ['Cables', 'Chargers', 'Accessories'],
        };
        
        const expectedCats = catMapping[user.cat] || [];
        const isCategoryMismatch = firstItemCat && !expectedCats.includes(firstItemCat);
        
        if (isCategoryMismatch) {
          console.log(`🔄 Category mismatch detected! Stored: ${firstItemCat}, Expected: ${expectedCats.join('/')}`);
          console.log(`🔄 Clearing inventory for category change from previous session`);
          setInventory([]); // Clear mismatched inventory
          saveToStorage(STORAGE_KEYS.inventory, []); // Clear from storage too
        }
      }
    }
  }, [user.cat]);

  // Auto-initialize inventory when it becomes empty (category mismatched or first load)
  useEffect(() => {
    if (inventory.length === 0 && user.cat && !isSeeding) {
      const CAT_LABELS = { 
        agri: 'Agri Retailer', food: 'Food & Grocery', pharma: 'Pharmacy', 
        hardware: 'Hardware & Tools', textile: 'Textile & Fashion', electronics: 'Electronics' 
      };
      const label = CAT_LABELS[user.cat] || user.cat;
      console.log(`🔄 Auto-initializing inventory for category: ${user.cat} (${label})`);
      initializeAIStore(user.cat, label);
    }
  }, [inventory.length, user.cat, isSeeding]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const initializeAIStore = async (category, categoryLabel) => {
    // Only initialize if inventory is empty AND not already seeding
    if (inventory.length > 0 || isSeeding) {
      console.log(`⚠️ Skipping AI store init: inventory.length=${inventory.length}, isSeeding=${isSeeding}`);
      return;
    }
    
    setIsSeeding(true);
    console.log(`🌱 Initializing AI store for category: ${category} (${categoryLabel})`);
    
    // Generate AI products based on user category
    const label = categoryLabel || category;
    const parsedData = await Intelligence.generateInventory(label);
    
    if (parsedData && parsedData.length > 0) {
      const withCodes = parsedData.map((p, i) => ({
        ...p,
        id: p.id || Date.now() + i,
        code: p.code || `P${1000 + i}`
      }));
      setInventory(withCodes);
      console.log(`✅ AI Store initialized with ${withCodes.length} items`);
    } else {
      console.warn(`⚠️ No AI products generated for ${label}`);
    }
    
    setIsSeeding(false);
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
    console.log(`📦 Adding to inventory: ${item.name}`);
    
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
      exp: item.exp || '2027-05',
      businessCat: item.businessCat || user.cat || 'food'
    }, ...prev]);
  };

  const completeSale = (customerName, customerPhone, usedOtp = false) => {
    console.log(`💰 Processing sale to ${customerName}`);
    
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

  const placeB2BOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Math.floor(8000 + Math.random()*1000)}`,
      status: 'pending',
      time: 'Just now',
      date: new Date().toISOString()
    };
    setDistOrders(prev => [newOrder, ...prev]);
    addNotification({
      title: 'New Order Received',
      body: `${order.retailer} placed an order for ${order.items} items.`,
      role: 'distributor', isRead: false
    });
    // Fire popup to distributor tab
    showGlobalPopup({
      title: '🛍️ New Order Received!',
      message: `${order.retailer} just placed an order for ${order.items} items worth ₹${order.total?.toLocaleString('en-IN')}.`,
      type: 'pending',
      icon: 'shopping_bag'
    }, 'distributor');
  };

  const approveB2BOrder = (orderId) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setDistOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        addNotification({
          title: 'Order Approved!',
          body: `Your order ${orderId} has been approved. Delivery OTP: ${otp}`,
          role: 'retailer', isRead: false
        });
        // Fire popup to retailer tab
        showGlobalPopup({
          title: '✅ Order Approved!',
          message: `Your order ${orderId} has been approved! Your delivery OTP is: ${otp}. Share this with the delivery person.`,
          type: 'approved',
          icon: 'check_circle'
        }, 'retailer');

        return { ...o, status: 'approved', otp: otp };
      }
      return o;
    }));
  };

  const deliverB2BOrder = (orderId, enteredOtp) => {
    let success = false;
    let earned = 0;
    setDistOrders(prev => {
      const nextDistOrders = prev.map(o => {
        if (o.id === orderId) {
          if (o.otp === enteredOtp) {
            success = true;
            earned = o.total;
            return { ...o, status: 'fulfilled' };
          }
          return o;
        }
        return o;
      });
      return nextDistOrders;
    });

    if (success) {
      setWalletBalance(prev => prev + earned);
      addTransaction({
        type: 'sale',
        label: 'B2B Wholesale Fulfillment',
        sub: 'Order ' + orderId,
        date: 'Just now',
        amt: '+₹' + earned.toLocaleString('en-IN'),
        clr: '#ffd060',
        icon: 'local_shipping'
      });
      addNotification({
        title: 'Order Fulfilled',
        body: `Order ${orderId} delivered successfully!`,
        role: 'retailer', isRead: false
      });
      // Fire popup to retailer tab
      showGlobalPopup({
        title: '🎉 Order Delivered!',
        message: `OTP verified for order ${orderId}. Your order has been delivered successfully!`,
        type: 'fulfilled',
        icon: 'local_shipping'
      }, 'retailer');
    }
    return success;
  };

  const rejectB2BOrder = (orderId) => {
    setDistOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        addNotification({
          title: 'Order Rejected',
          body: `Order ${orderId} was rejected by the distributor.`,
          role: 'retailer', isRead: false
        });
        // Fire popup to retailer tab
        showGlobalPopup({
          title: '❌ Order Rejected',
          message: `Order ${orderId} was rejected by the distributor (out of stock).`,
          type: 'rejected',
          icon: 'cancel'
        }, 'retailer');
        return { ...o, status: 'rejected' };
      }
      return o;
    }));
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
    initializeAIStore,
    distOrders: distOrdersState,
    setDistOrders,
    myRetailers: myRetailersState,
    setMyRetailers,
    placeB2BOrder,
    approveB2BOrder,
    deliverB2BOrder,
    rejectB2BOrder,
    notifications,
    setNotifications,
    addNotification,
    globalPopup,
    showGlobalPopup
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
