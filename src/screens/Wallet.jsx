import React from 'react';
import { Header } from '../components/layout/Header';
import { useAppContext } from '../context/AppContext';

export const Wallet = () => {
    const { transactions, walletBalance } = useAppContext();
    return (
        <div className="screen active" style={{ background: 'var(--bg0)' }}>
            <Header title="Wallet" backTo="/home" />
            <div className="scroller" style={{ padding: '1.25rem' }}>
                 <div className="au d1 wallet-hero-card" style={{ borderRadius: 'var(--r16)', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--sh)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at top right, rgba(120,242,117,.15), transparent 70%)' }}></div>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--t2)', marginBottom: '.5rem', position: 'relative', zIndex: 2 }}>Total Balance</p>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'var(--fd)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: '1.5rem' }}>₹</span>{walletBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </h2>
                     <div style={{ display: 'flex', gap: '.6rem', position: 'relative', zIndex: 2 }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '.8rem' }}>
                            <span className="material-symbols-outlined">add</span>Add
                        </button>
                        <button className="btn btn-ghost" style={{ flex: 1, padding: '.8rem' }}>
                            Withdraw<span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div className="au d2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                   <h3 style={{ fontSize: '.95rem', fontWeight: 800 }}>Wallet History</h3>
                   <span style={{ fontSize: '.7rem', color: 'var(--t2)' }}>Last 30 days</span>
                </div>
                
                 <div className="au d3" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                   {transactions.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.7rem .875rem', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r8)' }}>
                         <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined fi" style={{ fontSize: '1.1rem', color: t.clr }}>{t.icon}</span>
                         </div>
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</p>
                            <p style={{ fontSize: '.65rem', color: 'var(--t3)' }}>{t.sub} · {t.date}</p>
                         </div>
                         <span style={{ fontWeight: 800, fontSize: '.9rem', color: t.clr, flexShrink: 0 }}>{t.amt}</span>
                      </div>
                   ))}
                </div>
            </div>
        </div>
    );
};
