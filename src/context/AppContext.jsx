import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Intelligence } from '../services/intelligence';

const AppContext = createContext();

const initialUser = { phone: '', name: 'Ramesh Kumar Sharma', shop: 'Ramesh Agro Traders', loc: 'Khetgaon, MP', cat: '', role: '' };
const initialInv = [];

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

const loadFromStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null || stored === 'undefined') return defaultValue;
    return JSON.parse(stored);
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
  // ─── STATE DEFINITIONS ───
  const [user, setUserState] = useState(() => loadFromStorage(STORAGE_KEYS.user, initialUser));
  const [theme, setThemeState] = useState(() => loadFromStorage(STORAGE_KEYS.theme, 'dark'));
  const [inventory, setInventoryState] = useState(() => loadFromStorage(STORAGE_KEYS.inventory, initialInv));
  const [distOrdersState, setDistOrdersState] = useState(() => loadFromStorage(STORAGE_KEYS.distOrders, initialOrders));
  const [myRetailersState, setMyRetailersState] = useState(() => loadFromStorage(STORAGE_KEYS.myRetailers, initialRetailers));
  const [transactions, setTransactions] = useState(() => {
    const restoredUser = loadFromStorage(STORAGE_KEYS.user, initialUser);
    return getInitialTransactions(restoredUser?.cat || 'food');
  });
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };
  const [linkedDists, setLinkedDists] = useState([]);
  const [walletBalance, setWalletBalanceState] = useState(() => loadFromStorage(STORAGE_KEYS.wallet, 3482.50));
  const [notifications, setNotificationsState] = useState(() => loadFromStorage(STORAGE_KEYS.notifications, []));
  const [globalPopup, setGlobalPopup] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Use a ref to always access current user inside realtime callbacks (avoid stale closure)
  const userRef = React.useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // ─── LOCAL STORAGE FALLBACK SYNCS ───
  const setUser = (updater) => {
    setUserState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
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
      saveToStorage(STORAGE_KEYS.distOrders, next);
      return next;
    });
  };

  const setMyRetailers = (updater) => {
    setMyRetailersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.myRetailers, next);
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

  const addTransaction = (txn) => {
    setTransactions(prev => [{ ...txn, id: Date.now(), date: 'Just now' }, ...prev]);
  };

  // Sync theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ─── POPUP SYSTEM (LOCAL FALLBACK) ───
  const showGlobalPopup = (popup, targetRole) => {
    if (!popup) { setGlobalPopup(null); return; }

    if (!targetRole || !isSupabaseConfigured) {
      setGlobalPopup(popup);
      return;
    }

    // Write cross-tab popup signal to localStorage for local testing
    localStorage.setItem(
      `counterOS_popup_for_${targetRole}`,
      JSON.stringify({ ...popup, savedAt: Date.now() })
    );
  };

  // Check saved popups on local storage (fallback)
  useEffect(() => {
    const role = user?.role;
    if (!role || isSupabaseConfigured) return;
    const saved = localStorage.getItem(`counterOS_popup_for_${role}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Date.now() - data.savedAt < 10 * 60 * 1000) {
          setTimeout(() => setGlobalPopup(data), 600);
        }
      } catch(e) {}
      localStorage.removeItem(`counterOS_popup_for_${role}`);
    }
  }, [user?.role]);

  // Sync tab updates in local testing mode
  useEffect(() => {
    if (isSupabaseConfigured) return;
    const handleStorage = (e) => {
      if (e.key === `counterOS_popup_for_${user?.role}` && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (Date.now() - data.savedAt < 10 * 60 * 1000) {
            setGlobalPopup(data);
          }
          localStorage.removeItem(`counterOS_popup_for_${user?.role}`);
        } catch(e) {}
      }
      if (e.key === 'counterOS_distOrders' && e.newValue) {
        setDistOrdersState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.role]);

  // Seed inventory dynamically if empty
  useEffect(() => {
    if (inventory.length === 0 && user?.cat && !isSeeding) {
      const CAT_LABELS = { 
        agri: 'Agri Retailer', food: 'Food & Grocery', pharma: 'Pharmacy', 
        hardware: 'Hardware & Tools', textile: 'Textile & Fashion', electronics: 'Electronics' 
      };
      const label = CAT_LABELS[user.cat] || user.cat;
      initializeAIStore(user.cat, label);
    }
  }, [inventory.length, user?.cat, isSeeding]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // ─── SUPABASE CONTROLLER & REAL-TIME FLOWS ───

  // 1. Authenticate user, loading/creating their persistent Supabase profile
  const loginUser = async (phone, role, isNew) => {
    if (!isSupabaseConfigured) {
      // Offline fallback
      const isDist = role === 'distributor';
      const dummyUser = {
        phone,
        name: isDist ? 'Rajesh Gupta' : 'Ramesh Kumar Sharma',
        shop: isDist ? 'Gupta Mega Suppliers' : 'Ramesh Agro Traders',
        loc: isDist ? 'Indore, MP' : 'Khetgaon, MP',
        role,
        cat: isDist ? 'agri' : 'food',
        wallet_balance: 3482.50
      };
      setUser(dummyUser);
      setWalletBalance(3482.50);
      return dummyUser;
    }

    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const isDist = role === 'distributor';
        const newProfile = {
          phone,
          name: isDist ? 'Rajesh Gupta' : 'Ramesh Kumar Sharma',
          shop: isDist ? 'Gupta Mega Suppliers' : 'Ramesh Agro Traders',
          loc: isDist ? 'Indore, MP' : 'Khetgaon, MP',
          role,
          cat: isDist ? 'agri' : 'food',
          wallet_balance: 3482.50
        };

        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) throw insertError;
        profile = data;
      } else {
        if (profile.role !== role) {
          const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', profile.id)
            .select()
            .single();
          if (updateError) throw updateError;
          profile = data;
        }
      }

      setUser(profile);
      setWalletBalance(Number(profile.wallet_balance || 0));
      return profile;
    } catch (e) {
      console.error('Supabase auth failed, running local mode:', e);
      throw e;
    }
  };

  // 2. Save shop onboarding or profile modifications
  const updateProfile = async (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    if (!isSupabaseConfigured || !user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      console.log('✅ Profile updated in database:', updates);
    } catch (e) {
      console.error('Failed to save profile updates to database:', e);
    }
  };

  // 3. Populate database initial seed list
  const initializeAIStore = async (category, categoryLabel) => {
    if (inventory.length > 0 || isSeeding) return;
    setIsSeeding(true);

    try {
      const label = categoryLabel || category;
      const parsedData = await Intelligence.generateInventory(label);
      
      if (parsedData && parsedData.length > 0) {
        const withCodes = parsedData.map((p, i) => ({
          ...p,
          id: p.id || Date.now() + i,
          code: p.code || `P${1000 + i}`,
          businessCat: category
        }));

        if (isSupabaseConfigured && user?.id) {
          const dbRows = withCodes.map(item => ({
            user_id: user.id,
            code: item.code,
            name: item.name,
            cat: item.cat,
            unit: item.unit,
            qty: item.qty,
            buy: item.buy,
            sell: item.sell,
            earn: item.earn,
            mfg: item.mfg || '2024-06',
            exp: item.exp || '2027-05',
            business_cat: category
          }));

          const { error } = await supabase.from('inventory').insert(dbRows);
          if (error) throw error;
          
          // Re-fetch clean list from database
          const { data: updatedInv } = await supabase
            .from('inventory')
            .select('*')
            .eq('user_id', user.id);
          
          if (updatedInv) {
            setInventory(updatedInv.map(row => ({
              id: row.id,
              code: row.code,
              name: row.name,
              cat: row.cat,
              unit: row.unit,
              qty: row.qty,
              buy: Number(row.buy),
              sell: Number(row.sell),
              earn: Number(row.earn),
              mfg: row.mfg,
              exp: row.exp,
              businessCat: row.business_cat
            })));
          }
        } else {
          setInventory(withCodes);
        }
        console.log(`✅ Inventory seed successful for: ${category}`);
      }
    } catch (e) {
      console.error('Failed to initialize AI store list:', e);
    } finally {
      setIsSeeding(false);
    }
  };

  // ─── SUBSCRIBER CORE (LOAD & SUBSCRIBE REALTIME FROM DATABASE) ───
  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return;

    // Load initial data
    const loadInitialData = async () => {
      try {
        // A. Inventory
        const { data: dbInv } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id);
        if (dbInv) {
          setInventoryState(dbInv.map(row => ({
            id: row.id,
            code: row.code,
            name: row.name,
            cat: row.cat,
            unit: row.unit,
            qty: row.qty,
            buy: Number(row.buy),
            sell: Number(row.sell),
            earn: Number(row.earn),
            mfg: row.mfg,
            exp: row.exp,
            businessCat: row.business_cat
          })));
        }

        // B. Orders (Retailers see their orders, Distributors see all orders sent to them)
        const orderQuery = user.role === 'distributor' 
          ? supabase.from('orders').select('*') 
          : supabase.from('orders').select('*').eq('retailer_id', user.id);
        
        const { data: dbOrders } = await orderQuery;
        if (dbOrders) {
          setDistOrdersState(dbOrders.map(o => ({
            id: o.id,
            retailer: o.retailer_name,
            retailer_id: o.retailer_id,
            items: o.items,
            total: Number(o.total),
            status: o.status,
            otp: o.otp,
            time: 'Active',
            date: o.created_at,
            items_list: o.items_list
          })));
        }

        // C. Transactions
        const { data: dbTxns } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (dbTxns) {
          setTransactions(dbTxns.map(t => ({
            id: t.id,
            type: t.type,
            label: t.label,
            sub: t.sub,
            amt: t.amt,
            clr: t.clr,
            icon: t.icon,
            date: new Date(t.created_at).toLocaleDateString()
          })));
        }

        // D. Notifications
        const { data: dbNotifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (dbNotifs) {
          setNotificationsState(dbNotifs.map(n => ({
            id: n.id,
            title: n.title,
            body: n.body,
            role: n.role,
            isRead: n.is_read,
            time: 'Recent'
          })));
        }

        // E. Connections / Linked distributors
        if (user.role === 'retailer') {
          const { data: connections } = await supabase
            .from('connections')
            .select('distributor_id, profiles!connections_distributor_id_fkey(*)')
            .eq('retailer_id', user.id);
          
          if (connections) {
            setLinkedDists(connections.map(c => ({
              id: c.profiles.id,
              name: c.profiles.shop || c.profiles.name,
              city: c.profiles.loc || 'India',
              products: [c.profiles.cat || 'Wholesale'],
              rating: 4.8,
              distance: 5,
              emoji: '🏭'
            })));
          }
        } else {
          // Distributor sees linked retailers
          const { data: connections } = await supabase
            .from('connections')
            .select('retailer_id, profiles!connections_retailer_id_fkey(*)')
            .eq('distributor_id', user.id);
          
          if (connections) {
            setMyRetailers(connections.map(c => ({
              id: c.profiles.id,
              name: c.profiles.shop || c.profiles.name,
              ltv: 125000,
              tier: 'Gold',
              lastOrder: 'Active'
            })));
          }
        }
      } catch (err) {
        console.error('Initial DB load error:', err);
      }
    };

    loadInitialData();

    // SETUP WEB SOCKET REAL-TIME LISTENERS
    const ordersChannel = supabase
      .channel('realtime-orders-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const currentUser = userRef.current;
        console.log('🔔 Realtime Order Update:', payload.eventType, payload.new?.status, 'for retailer:', payload.new?.retailer_id, 'current user:', currentUser?.id, 'role:', currentUser?.role);
        
        if (!payload.new) return;

        const mappedNew = {
          id: payload.new.id,
          retailer: payload.new.retailer_name,
          retailer_id: payload.new.retailer_id,
          items: payload.new.items,
          total: Number(payload.new.total),
          status: payload.new.status,
          otp: payload.new.otp,
          time: 'Just now',
          date: payload.new.created_at,
          items_list: payload.new.items_list
        };

        // Always update the orders list
        setDistOrdersState(prev => {
          if (payload.eventType === 'INSERT') {
            return [mappedNew, ...prev.filter(o => o.id !== mappedNew.id)];
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map(o => o.id === mappedNew.id ? mappedNew : o);
          }
          return prev;
        });

        // Show popup notifications based on role and event
        if (payload.eventType === 'INSERT') {
          // Distributor sees new order popup
          if (currentUser?.role === 'distributor') {
            setGlobalPopup({
              title: '🛍️ New Order Received!',
              message: `${payload.new.retailer_name} placed a B2B order worth ₹${Number(payload.new.total).toLocaleString('en-IN')}.`,
              type: 'pending',
              icon: 'shopping_bag'
            });
          }
        }

        if (payload.eventType === 'UPDATE') {
          const newStatus = payload.new.status;
          const isThisRetailersOrder = payload.new.retailer_id === currentUser?.id;

          // Retailer gets popup when THEIR order status changes
          if (currentUser?.role === 'retailer' && isThisRetailersOrder) {
            if (newStatus === 'approved') {
              setGlobalPopup({
                title: '✅ Order Approved!',
                message: `Your order ${payload.new.id} was approved! Delivery OTP: ${payload.new.otp}`,
                type: 'approved',
                icon: 'check_circle'
              });
            } else if (newStatus === 'fulfilled') {
              setGlobalPopup({
                title: '🎉 Order Delivered!',
                message: `Order ${payload.new.id} has been delivered successfully!`,
                type: 'fulfilled',
                icon: 'local_shipping'
              });
            } else if (newStatus === 'rejected') {
              setGlobalPopup({
                title: '❌ Order Rejected',
                message: `Your order ${payload.new.id} was rejected by the distributor.`,
                type: 'rejected',
                icon: 'cancel'
              });
            }
          }
        }
      })
      .subscribe((status) => {
        console.log('📡 Orders channel status:', status);
      });

    const profileChannel = supabase
      .channel('realtime-profile')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
        console.log('🔔 Wallet Balance Updated:', payload.new.wallet_balance);
        setWalletBalanceState(Number(payload.new.wallet_balance));
        setUserState(payload.new);
      })
      .subscribe();

    const notifChannel = supabase
      .channel('realtime-notif')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        console.log('🔔 New Notification:', payload);
        setNotificationsState(prev => [{
          id: payload.new.id,
          title: payload.new.title,
          body: payload.new.body,
          role: payload.new.role,
          isRead: payload.new.is_read,
          time: 'Just now'
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [user?.id, user?.role]);

  // 4. Record new product item in DB
  const addInventoryItem = async (item) => {
    const defaultItem = {
      ...item,
      id: Date.now(),
      code: item.code || `P${1000 + inventory.length}`,
      mfg: item.mfg || '2024-06',
      exp: item.exp || '2027-05',
      businessCat: item.businessCat || user.cat || 'food'
    };

    setInventory(prev => [defaultItem, ...prev]);

    // Handle reward cashback logic
    const purchaseTotal = Number(item.buy) * Number(item.qty);
    let reward = 0;
    if (purchaseTotal >= 10000) reward = purchaseTotal * 0.1;
    else if (purchaseTotal >= 5000) reward = purchaseTotal * 0.05;

    if (isSupabaseConfigured && user?.id) {
      try {
        const { error: invErr } = await supabase.from('inventory').insert([{
          user_id: user.id,
          code: defaultItem.code,
          name: defaultItem.name,
          cat: defaultItem.cat,
          unit: defaultItem.unit,
          qty: Number(defaultItem.qty),
          buy: Number(defaultItem.buy),
          sell: Number(defaultItem.sell),
          earn: Number(defaultItem.earn),
          mfg: defaultItem.mfg,
          exp: defaultItem.exp,
          business_cat: defaultItem.businessCat
        }]);
        if (invErr) throw invErr;

        if (reward > 0) {
          const newBalance = walletBalance + reward;
          await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
          await supabase.from('transactions').insert([{
            user_id: user.id,
            type: 'purchase',
            label: 'Purchase Reward',
            sub: `Cashback on ${item.name}`,
            amt: '+₹' + reward.toFixed(0),
            clr: '#78f275',
            icon: 'card_giftcard'
          }]);
        }
      } catch(e) {
        console.error('Failed to sync added inventory item to Supabase:', e);
      }
    } else {
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
    }
  };

  // 5. Complete walk-in customer sale & adjust quantities
  const completeSale = async (customerName, customerPhone, usedOtp = false) => {
    const baseEarned = cart.reduce((s, c) => s + c.earn * c.qty, 0);
    const otpBonus = usedOtp ? 5 : 0;
    const earned = +(baseEarned + otpBonus).toFixed(2);
    const firstItem = cart[0]?.name.split(' ').slice(0, 3).join(' ') || 'Products';
    const ct = cart.reduce((s, c) => s + c.qty, 0);

    // Update local state inventory quantities
    setInventory(prev => {
      const nextInv = [...prev];
      cart.forEach(c => {
        const p = nextInv.find(x => x.id === c.id);
        if (p) p.qty = Math.max(0, p.qty - c.qty);
      });
      return nextInv;
    });

    if (isSupabaseConfigured && user?.id) {
      try {
        // Deduct quantities in DB
        for (const cartItem of cart) {
          const matchingDbItem = inventory.find(p => p.id === cartItem.id || p.code === cartItem.code);
          if (matchingDbItem) {
            const newQty = Math.max(0, matchingDbItem.qty - cartItem.qty);
            await supabase.from('inventory').update({ qty: newQty }).eq('id', matchingDbItem.id);
          }
        }

        // Add funds to wallet balance
        const newBalance = walletBalance + earned;
        await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);

        // Record retail transaction
        await supabase.from('transactions').insert([{
          user_id: user.id,
          type: 'sale',
          label: 'Sale to ' + customerName,
          sub: firstItem + ' · ' + ct + ' items',
          amt: '+₹' + earned,
          clr: '#ffd060',
          icon: 'storefront'
        }]);
      } catch (e) {
        console.error('Failed to save sale updates to database:', e);
      }
    } else {
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
    }

    clearCart();
    return earned;
  };

  // 6. Create B2B purchase order
  const placeB2BOrder = async (order) => {
    const orderId = `ORD-${Math.floor(8000 + Math.random()*1000)}`;
    const newOrder = {
      ...order,
      id: orderId,
      status: 'pending',
      time: 'Just now',
      date: new Date().toISOString()
    };

    setDistOrders(prev => [newOrder, ...prev]);

    if (isSupabaseConfigured && user?.id) {
      try {
        // Target distributor ID matching name selection or connection lookup
        const { data: distProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('shop', order.distributorName || 'Gupta Mega Suppliers')
          .maybeSingle();

        const distributorId = distProfile?.id || null;

        const { error } = await supabase.from('orders').insert([{
          id: orderId,
          retailer_id: user.id,
          retailer_name: user.shop || user.name,
          items: Number(order.items),
          total: Number(order.total),
          status: 'pending',
          items_list: order.cartItems || []
        }]);

        if (error) throw error;

        // If distributor has an account, log a database notification
        if (distributorId) {
          await supabase.from('notifications').insert([{
            user_id: distributorId,
            title: 'New Order Received',
            body: `${user.shop || user.name} placed a wholesale order for ${order.items} items.`,
            role: 'distributor'
          }]);
        }
      } catch(e) {
        console.error('Failed to place order in Supabase:', e);
      }
    } else {
      addNotification({
        title: 'New Order Received',
        body: `${order.retailer} placed an order for ${order.items} items.`,
        role: 'distributor', isRead: false
      });
      showGlobalPopup({
        title: '🛍️ New Order Received!',
        message: `${order.retailer} just placed an order for ${order.items} items worth ₹${order.total?.toLocaleString('en-IN')}.`,
        type: 'pending',
        icon: 'shopping_bag'
      }, 'distributor');
    }
  };

  // 7. Approve pending B2B order & dispatch OTP code
  const approveB2BOrder = async (orderId) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    setDistOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'approved', otp: otp } : o));

    if (isSupabaseConfigured) {
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('retailer_id')
          .eq('id', orderId)
          .single();

        await supabase
          .from('orders')
          .update({ status: 'approved', otp: otp })
          .eq('id', orderId);

        if (order?.retailer_id) {
          await supabase.from('notifications').insert([{
            user_id: order.retailer_id,
            title: 'Order Approved!',
            body: `Your order ${orderId} has been approved. Delivery OTP: ${otp}`,
            role: 'retailer'
          }]);
        }
      } catch(e) {
        console.error('Failed to approve order in database:', e);
      }
    } else {
      addNotification({
        title: 'Order Approved!',
        body: `Your order ${orderId} has been approved. Delivery OTP: ${otp}`,
        role: 'retailer', isRead: false
      });
      showGlobalPopup({
        title: '✅ Order Approved!',
        message: `Your order ${orderId} has been approved! Your delivery OTP is: ${otp}. Share this with the delivery person.`,
        type: 'approved',
        icon: 'check_circle'
      }, 'retailer');
    }
  };

  // 8. Verify OTP delivery and settle amounts
  const deliverB2BOrder = async (orderId, enteredOtp) => {
    let success = false;
    let earned = 0;
    let retailerId = null;

    if (isSupabaseConfigured) {
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (order && order.otp === enteredOtp) {
          success = true;
          earned = Number(order.total);
          retailerId = order.retailer_id;

          // Update order status to fulfilled
          await supabase.from('orders').update({ status: 'fulfilled' }).eq('id', orderId);

          // Update distributor balance
          const newBalance = walletBalance + earned;
          await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);

          // Add transaction for wholesaler
          await supabase.from('transactions').insert([{
            user_id: user.id,
            type: 'sale',
            label: 'B2B Wholesale Fulfillment',
            sub: 'Order ' + orderId,
            amt: '+₹' + earned.toLocaleString('en-IN'),
            clr: '#ffd060',
            icon: 'local_shipping'
          }]);

          // Notify Retailer
          await supabase.from('notifications').insert([{
            user_id: retailerId,
            title: 'Order Fulfilled',
            body: `Order ${orderId} delivered successfully!`,
            role: 'retailer'
          }]);
        }
      } catch(e) {
        console.error('Failed to complete delivery in database:', e);
      }
    } else {
      const match = distOrdersState.find(o => o.id === orderId);
      if (match && match.otp === enteredOtp) {
        success = true;
        earned = match.total;

        setDistOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'fulfilled' } : o));
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
        showGlobalPopup({
          title: '🎉 Order Delivered!',
          message: `OTP verified for order ${orderId}. Your order has been delivered successfully!`,
          type: 'fulfilled',
          icon: 'local_shipping'
        }, 'retailer');
      }
    }

    return success;
  };

  // 9. Reject order (out of stock/issue)
  const rejectB2BOrder = async (orderId) => {
    setDistOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));

    if (isSupabaseConfigured) {
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('retailer_id')
          .eq('id', orderId)
          .single();

        await supabase.from('orders').update({ status: 'rejected' }).eq('id', orderId);

        if (order?.retailer_id) {
          await supabase.from('notifications').insert([{
            user_id: order.retailer_id,
            title: 'Order Rejected',
            body: `Order ${orderId} was rejected by the distributor.`,
            role: 'retailer'
          }]);
        }
      } catch(e) {
        console.error('Failed to reject order in database:', e);
      }
    } else {
      addNotification({
        title: 'Order Rejected',
        body: `Order ${orderId} was rejected by the distributor.`,
        role: 'retailer', isRead: false
      });
      showGlobalPopup({
        title: '❌ Order Rejected',
        message: `Order ${orderId} was rejected by the distributor (out of stock).`,
        type: 'rejected',
        icon: 'cancel'
      }, 'retailer');
    }
  };

  // 10. Link connections (Retailers linking to wholesalers)
  const saveConnectionLink = async (distributorProfile) => {
    if (!isSupabaseConfigured || !user?.id) return;
    try {
      const isLinked = linkedDists.some(d => d.id === distributorProfile.id);
      
      if (isLinked) {
        setLinkedDists(prev => prev.filter(d => d.id !== distributorProfile.id));
        await supabase
          .from('connections')
          .delete()
          .eq('retailer_id', user.id)
          .eq('distributor_id', distributorProfile.id);
      } else {
        setLinkedDists(prev => [...prev, distributorProfile]);
        await supabase
          .from('connections')
          .insert([{ retailer_id: user.id, distributor_id: distributorProfile.id }]);
      }
    } catch (e) {
      console.error('Failed to save connection in database:', e);
    }
  };

  const value = {
    user,
    setUser,
    loginUser,
    updateProfile,
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
    saveConnectionLink,
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
