import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAppContext } from '../context/AppContext';

export const Notifications = () => {
  const { user, notifications, setNotifications } = useAppContext();
  
  const myNotifs = notifications.filter(n => n.role === user.role);

  // Mark as read on mount
  useEffect(() => {
    const hasUnread = myNotifs.some(n => !n.isRead);
    if (hasUnread) {
      setNotifications(prev => prev.map(n => 
        n.role === user.role ? { ...n, isRead: true } : n
      ));
    }
  }, [myNotifs, setNotifications, user.role]);

  return (
    <div className="screen active">
      <Header title="Notifications" backTo={user.role === 'retailer' ? '/home' : '/distributor-home'} />
      
      <div className="scroller" style={{ padding: '1rem' }}>
        {myNotifs.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--t3)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>notifications_off</span>
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myNotifs.map(n => (
              <div key={n.id} style={{ background: 'var(--bg2)', padding: '1rem', borderRadius: 'var(--r12)', border: '1px solid var(--bdr)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                  <h4 style={{ fontSize: '.9rem', fontWeight: 800 }}>{n.title}</h4>
                  {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--e4)' }}></span>}
                </div>
                <p style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.4 }}>{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
