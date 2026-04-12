import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Header } from '../components/layout/Header';
import { useAppContext } from '../context/AppContext';
import { showToast } from '../components/ui/Toast';

export const Sell = () => {
  const navigate = useNavigate();
  const { inventory, cart, addToCart } = useAppContext();
  
  const avail = inventory.filter(p => p.qty > 0);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalEarn = cart.reduce((s, c) => s + (c.earn * c.qty), 0);

  const handleAdd = (p) => {
    addToCart(p);
    showToast(`✅ ${p.name.split(' ').slice(0,3).join(' ')} added`);
  };

  return (
    <AppLayout>
      <div className="screen active">
        <Header 
          title="Point of Sale" 
          subtitle="Add items to cart"
          rightContent={
            <div 
              style={{ padding: '.4rem .8rem', background: 'rgba(255,208,96,.1)', border: '1px solid rgba(255,208,96,.3)', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '.3rem', cursor: 'pointer' }}
              onClick={() => navigate('/cart')}
            >
              <span className="material-symbols-outlined fi" style={{ color: 'var(--o4)', fontSize: '1rem' }}>shopping_cart</span>
              <span style={{ fontSize: '.75rem', fontWeight: 800, color: 'var(--o4)' }}>{totalItems > 0 ? totalItems : ''}</span>
            </div>
          }
        />
        
        <div className="scroller" style={{ padding: '1.25rem' }}>
          {!avail.length ? (
            <p style={{ fontSize: '.82rem', color: 'var(--t2)', textAlign: 'center', padding: '1.5rem' }}>
              No products in stock. <button onClick={() => navigate('/invoice')} style={{ background: 'none', border: 'none', color: 'var(--g4)', cursor: 'pointer', fontWeight: 700 }}>Upload invoice →</button>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {avail.map((p, i) => (
                <div key={p.id} onClick={() => handleAdd(p)} className="au" style={{ animationDelay: `${i*.04}s`, display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.7rem .875rem', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r8)', cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: '2.2rem', height: '2.2rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined fi" style={{ fontSize: '1rem', color: p.clr }}>{p.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                    <p style={{ fontSize: '.65rem', color: 'var(--t3)' }}>{p.unit} · {p.qty} left</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '.875rem', fontWeight: 700 }}>₹{p.sell}</p>
                    <p style={{ fontSize: '.62rem', color: 'var(--g4)' }}>earn ₹{p.earn}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="au d1" style={{ padding: '1rem', borderTop: '1px solid var(--bdr)', background: 'var(--bg1)', position: 'sticky', bottom: 0, zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <div>
                <p style={{ fontSize: '.65rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Sale Reward</p>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--o4)' }}>+₹{totalEarn.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => navigate('/cart')} style={{ padding: '.6rem 1.2rem' }}>
                Checkout <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
