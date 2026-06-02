import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { useAppContext } from '../context/AppContext';
import { Chip } from '../components/ui/Chip';

export const BuyFromDist = () => {
  const navigate = useNavigate();
  const { user, placeB2BOrder, distOrders } = useAppContext();
  
  const distOptions = [
    { id: 'dist_1', name: 'Sharma Wholesale Distributors' },
    { id: 'dist_2', name: 'Gupta Mega Suppliers' },
    { id: 'dist_3', name: 'Metro Fresh B2B' },
  ];

  const [selectedDistId, setSelectedDistId] = useState(distOptions[0].id);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  
  const myOrders = distOrders.filter(o => o.retailer === (user.shop || user.name));

  const allProducts = [
    { id: 101, name: 'Premium Grade Wheat', unit: '50kg Bag', price: 1200, category: 'Agri & Grains' },
    { id: 102, name: 'Basmati Rice (Export)', unit: '25kg Bag', price: 1800, category: 'Agri & Grains' },
    { id: 103, name: 'Cold Pressed Mustard Oil', unit: '15 Ltr Tin', price: 2100, category: 'Oils & Spices' },
    { id: 104, name: 'Refined Sugar', unit: '50kg Bag', price: 1900, category: 'Food Essentials' },
    { id: 105, name: 'Organic Turmeric Powder', unit: '5kg Pack', price: 850, category: 'Oils & Spices' },
    { id: 106, name: 'Red Lentils (Masoor Dal)', unit: '30kg Bag', price: 2400, category: 'Food Essentials' },
  ];

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];
  
  const catalog = allProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 Added ${product.name} to cart`);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showToast('⚠️ Cart is empty!');
      return;
    }
    
    placeB2BOrder({
      retailer: user.shop || user.name,
      items: cart.reduce((sum, item) => sum + item.qty, 0),
      total: total
    });
    
    setCart([]);
    showToast('✅ Order Placed Successfully!');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="screen active">
      <Header title="Order from Distributor" backTo="/home" />
      
      <div className="scroller" style={{ padding: '1rem', paddingBottom: '6rem' }}>
        
        {/* Distributor Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 800, color: 'var(--t2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Select Distributor
          </label>
          <select 
            value={selectedDistId}
            onChange={(e) => setSelectedDistId(e.target.value)}
            style={{ width: '100%', background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', padding: '1rem', color: 'var(--t1)', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
          >
            {distOptions.map(dist => (
              <option key={dist.id} value={dist.id}>{dist.name}</option>
            ))}
          </select>
        </div>

        {/* Product Category Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 800, color: 'var(--t2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Filter Products
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '100%', background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', padding: '1rem', color: 'var(--t1)', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gap: '.8rem', marginBottom: '2rem' }}>
          {catalog.map(product => (
            <div key={product.id} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: '.95rem' }}>{product.name}</p>
                <p style={{ fontSize: '.75rem', color: 'var(--t3)' }}>{product.unit} · ₹{product.price}</p>
              </div>
              <button 
                onClick={() => addToCart(product)}
                style={{ background: 'rgba(120,242,117,.1)', border: '1px solid rgba(120,242,117,.3)', color: 'var(--g4)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="au" style={{ background: 'var(--bg2)', border: '1px dashed var(--g4)', borderRadius: 'var(--r12)', padding: '1rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '.9rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--g4)' }}>Purchase Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', fontSize: '.8rem' }}>
                <span>{item.qty}x {item.name}</span>
                <span style={{ fontWeight: 800 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--bdr2)', marginTop: '.8rem', paddingTop: '.8rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total Payable</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {myOrders.length > 0 && (
          <div className="au d2" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>My Order History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
              {myOrders.map(order => (
                <div key={order.id} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.6rem' }}>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: '.95rem' }}>{order.id}</p>
                        <p style={{ fontSize: '.75rem', color: 'var(--t3)' }}>{order.items} items</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: '.95rem', color: 'var(--g4)' }}>₹{order.total.toLocaleString('en-IN')}</p>
                        <p style={{ fontSize: '.7rem', color: 'var(--t3)' }}>{order.time}</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--bdr2)' }}>
                      {order.status === 'pending' ? (
                        <Chip variant="o">Pending Approval</Chip>
                      ) : order.status === 'rejected' ? (
                        <span style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--e4)', border: '1px solid rgba(255,107,107,0.3)', padding: '.2rem .6rem', borderRadius: '1rem', fontSize: '.75rem', fontWeight: 700 }}>Rejected</span>
                      ) : order.status === 'approved' ? (
                        <Chip variant="o">Approved (To Deliver)</Chip>
                      ) : (
                        <Chip variant="g">Fulfilled</Chip>
                      )}
                      
                      {order.status === 'pending' && <p style={{ fontSize: '.7rem', color: 'var(--t3)' }}>Waiting for distributor...</p>}
                      {order.status === 'approved' && (
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '.7rem', color: 'var(--t2)', marginBottom: '.2rem' }}>Delivery OTP</p>
                          <p style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '2px', color: 'var(--g4)' }}>{order.otp}</p>
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', borderTop: '1px solid var(--bdr)', background: 'var(--bg1)', zIndex: 10 }}>
        <Button onClick={placeOrder} className="btn-gold" style={{ opacity: cart.length === 0 ? 0.5 : 1 }}>
          Place Order · ₹{total.toLocaleString('en-IN')}
        </Button>
      </div>
    </div>
  );
};
