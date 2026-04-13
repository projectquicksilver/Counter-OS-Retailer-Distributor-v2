import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { showToast } from '../components/ui/Toast';
import { Scanner } from '../components/ui/Scanner';

export const Sell = () => {
  const navigate = useNavigate();
  const { inventory, cart, addToCart, clearCart } = useAppContext();
  const [scannedItem, setScannedItem] = useState(null);
  const [mode, setMode] = useState('scan'); // 'scan' or 'manual'
  const [searchTerm, setSearchTerm] = useState('');

  const total = cart.reduce((s, c) => s + c.sell * c.qty, 0);
  const totalEarn = cart.reduce((s, c) => s + (c.earn * c.qty), 0);
  const itemCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleScan = (code) => {
    const p = inventory.find(x => x.code === code || x.id.toString() === code);
    if (p) {
      addToCart(p);
      setScannedItem(p);
      setTimeout(() => setScannedItem(null), 2500);
    } else {
      showToast(`❌ Product code ${code} not found`);
    }
  };

  const filteredInv = inventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AppLayout>
      <div className="screen active" style={{ background: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Top Header */}
        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--g4)' }}>menu</span>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Obsidian Ledger</h1>
           </div>
           <div style={{ width: '2.4rem', height: '2.4rem', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--t3)' }}>person</span>
           </div>
        </div>

        {/* Mode Toggles */}
        <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
           <div style={{ display: 'flex', background: '#111', borderRadius: '12px', padding: '0.25rem', border: '1px solid #1a1a1a' }}>
              <button 
                onClick={() => setMode('scan')}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', background: mode === 'scan' ? 'var(--g4)' : 'transparent', color: mode === 'scan' ? '#000' : 'var(--t3)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>bolt</span> Scan & Sell
              </button>
              <button 
                onClick={() => setMode('manual')}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', background: mode === 'manual' ? 'var(--g4)' : 'transparent', color: mode === 'manual' ? '#000' : 'var(--t3)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>inventory_2</span> Manual Select
              </button>
           </div>
        </div>

        <div className="scroller" style={{ flex: 1, padding: '1rem 1.25rem' }}>
          
          {mode === 'scan' ? (
            <div style={{ marginBottom: '1.5rem' }}>
               {/* Camera View */}
               <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #222', marginBottom: '1.5rem' }}>
                  <Scanner onScan={handleScan} style={{ height: '100%' }} />
                  
                  {/* Sample Scan Button Overlay */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 5 }}>
                     <button 
                       onClick={() => {
                         const code = inventory[0]?.code || 'P1001';
                         handleScan(code);
                       }}
                       style={{ background: 'rgba(120,242,117,0.2)', backdropFilter: 'blur(5px)', border: '1px solid var(--g4)', color: 'var(--g4)', padding: '.4rem .8rem', borderRadius: '8px', fontSize: '.7rem', fontWeight: 700 }}
                     >
                       ⚡ Simulate Scan
                     </button>
                  </div>

                  {/* Scanned Item Overlay Card */}
                  {scannedItem && (
                    <div className="au" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: 'rgba(18,18,18,0.95)', backdropFilter: 'blur(10px)', border: '1px solid #333', borderRadius: '16px', padding: '1rem', animation: 'slideUpIn .3s ease-out', zIndex: 10 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.4rem' }}>
                          <span className="material-symbols-outlined" style={{ color: 'var(--g4)', fontSize: '1rem' }}>check_circle</span>
                          <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--g4)', textTransform: 'uppercase' }}>Added to Cart</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                             <p style={{ fontWeight: 800, fontSize: '.95rem' }}>{scannedItem.name}</p>
                             <p style={{ fontSize: '.7rem', color: 'var(--t3)' }}>{scannedItem.unit}</p>
                          </div>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{scannedItem.sell.toLocaleString('en-IN')}</p>
                       </div>
                    </div>
                  )}
               </div>
               <p style={{ textAlign: 'center', color: 'var(--t3)', fontSize: '0.75rem', marginBottom: '1rem' }}>Point camera at product barcode to sell</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
               <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', fontSize: '1.2rem' }}>search</span>
                  <input 
                    placeholder="Search from inventory..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '0.8rem 1rem 0.8rem 2.8rem', color: '#fff', fontSize: '0.9rem' }}
                  />
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredInv.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--t3)', padding: '2rem 0' }}>No products found</p>
                  ) : (
                    filteredInv.map(p => (
                      <div key={p.id} onClick={() => { addToCart(p); setScannedItem(p); setTimeout(()=>setScannedItem(null), 2000); }} style={{ padding: '1rem', background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <div style={{ width: '2.5rem', height: '2.5rem', background: '#1a1a1a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined" style={{ color: p.clr || 'var(--o4)', fontSize: '1.2rem' }}>{p.icon || 'inventory_2'}</span>
                           </div>
                           <div>
                              <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{p.name}</p>
                              <p style={{ fontSize: '0.65rem', color: 'var(--t3)' }}>{p.unit} · {p.qty} in stock</p>
                           </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ fontWeight: 800, color: 'var(--t1)' }}>₹{p.sell}</p>
                           <p style={{ fontSize: '0.65rem', color: 'var(--g4)', fontWeight: 700 }}>+₹{p.earn} reward</p>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

          {/* Scanned Item Feedback (Overlay for manual mode too) */}
          {mode === 'manual' && scannedItem && (
             <div className="au" style={{ position: 'fixed', bottom: '10rem', left: '1.25rem', right: '1.25rem', background: 'rgba(120,242,117,1)', color: '#000', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zHash: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'slideUpIn 0.3s ease-out' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>check_circle</span>
                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{scannedItem.name} added to cart</span>
             </div>
          )}

          {/* Cart Section */}
          <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #1a1a1a', padding: '1.25rem', marginBottom: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Cart ({itemCount} items)</h3>
                <span onClick={clearCart} style={{ color: '#ef4444', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}>Clear Cart</span>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {cart.length === 0 ? (
                  <p style={{ fontSize: '.8rem', color: 'var(--t3)', textAlign: 'center', padding: '1rem 0' }}>Add items to see them here</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--t2)' }}>{item.name} × {item.qty}</p>
                        <p style={{ fontSize: '.85rem', fontWeight: 800 }}>₹{(item.sell * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                  ))
                )}
             </div>

             <div style={{ height: '1px', background: '#222', margin: '1rem 0' }}></div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '1rem', fontWeight: 800 }}>Total</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--g4)' }}>₹{total.toLocaleString('en-IN')}</p>
             </div>
          </div>

          {/* Reward Section */}
          <div style={{ background: 'rgba(120,242,117,0.06)', borderRadius: '16px', border: '1px solid rgba(120,242,117,0.15)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <div style={{ width: '2.8rem', height: '2.8rem', background: 'rgba(120,242,117,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--g4)' }}>card_giftcard</span>
             </div>
             <div>
                <h3 style={{ fontSize: '.85rem', fontWeight: 800 }}>Earn ₹{totalEarn.toFixed(0)} on this sale</h3>
                <p style={{ fontSize: '.7rem', color: 'var(--t3)' }}>Confirm with OTP for +₹5 bonus</p>
             </div>
          </div>

        </div>

        {/* Footer Action */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #1a1a1a', background: '#0a0a0a', zIndex: 10 }}>
           <button onClick={() => navigate('/cart')} style={{ width: '100%', padding: '1.1rem', background: 'var(--g4)', border: 'none', borderRadius: '16px', color: '#000', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem' }}>
              <span className="material-symbols-outlined">shopping_cart</span> Proceed to Checkout
           </button>
        </div>

      </div>
    </AppLayout>
  );
};
