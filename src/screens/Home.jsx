import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AppLayout } from '../components/layout/AppLayout';

const WEEK_DATA = [
  {day:'Mon',purchase:320,sale:120},{day:'Tue',purchase:580,sale:190},{day:'Wed',purchase:240,sale:95},
  {day:'Thu',purchase:920,sale:310},{day:'Fri',purchase:1180,sale:420},{day:'Sat',purchase:680,sale:230},{day:'Sun',purchase:180,sale:60}
];

export const Home = () => {
  const navigate = useNavigate();
  const { user, walletBalance, inventory, transactions, theme, toggleTheme } = useAppContext();
  const [insight, setInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingInsight(false);
      setInsight('Reorder Corteva Delegate now — only 5 units left and it earns ₹8.45/unit. A ₹26,550 purchase from your distributor this month unlocks Diamond tier (2.5% cashback) worth an extra ₹1,800+ annually.');
    }, 1200);
  }, []);

  const maxVal = Math.max(...WEEK_DATA.map(d => d.purchase + d.sale));
  const fname = user.name.split(' ')[0] || 'Ramesh';
  const locShort = user.loc ? user.loc.split(',')[0] : 'India';

  return (
    <AppLayout>
      <div className="screen active" style={{ background: 'var(--bg1)' }}>
        <div className="scroller" style={{ paddingBottom: '2rem' }}>
          
          <div className="ghead" style={{ padding: '1rem 1.1rem', border: 'none', background: 'transparent' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'pointer' }}>
                   <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--bg3)', color: 'var(--t2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      <span className="material-symbols-outlined">person</span>
                   </div>
                   <div>
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Namaste, {fname}! 👋</h2>
                      <p style={{ fontSize: '.65rem', color: 'var(--g4)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                         <span className="material-symbols-outlined fi" style={{ fontSize: '.8rem' }}>location_on</span>
                         {locShort}
                      </p>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                   <button className="btn-icon" onClick={() => navigate('/assistant')} style={{ border: '1px solid var(--g4)', color: 'var(--g4)', background: 'rgba(120,242,117,.08)' }}>
                      <span className="material-symbols-outlined fi">auto_awesome</span>
                   </button>
                   <button className="btn-icon" style={{ position: 'relative', background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
                      <span className="material-symbols-outlined">notifications</span>
                      <div className="gdot" style={{ position: 'absolute', top: '0', right: '0', background: '#ef4444', border: '2px solid var(--bg1)' }}>3</div>
                   </button>
                   <button className="btn-icon" onClick={toggleTheme} style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
                      <span className="material-symbols-outlined">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                   </button>
                   <button className="btn-icon" onClick={() => navigate('/settings')} style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
                      <span className="material-symbols-outlined">settings</span>
                   </button>
                </div>
             </div>
          </div>

          <div style={{ padding: '0 1.1rem' }}>
             
             {/* Wallet & Rewards Section */}
             <div className="au d1" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r16)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--bdr)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                      <div style={{ width: '2.8rem', height: '2.8rem', background: 'rgba(120,242,117,.12)', borderRadius: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '1.4rem' }}>account_balance_wallet</span>
                      </div>
                      <div>
                         <p style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Wallet Balance</p>
                         <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                            ₹{walletBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--t3)', cursor: 'pointer' }}>visibility</span>
                         </h2>
                      </div>
                   </div>
                   <button onClick={() => navigate('/wallet')} style={{ padding: '.5rem .8rem', background: 'transparent', border: '1px solid var(--g4)', borderRadius: '9999px', color: 'var(--g4)', fontSize: '.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.3rem', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span> Add Money
                   </button>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,208,96,.03)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                         <span style={{ fontSize: '.9rem' }}>🎁</span>
                         <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--t2)' }}>Rewards Unlocked</span>
                      </div>
                      <div style={{ fontSize: '.75rem', color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
                         <strong style={{ color: 'var(--g4)' }}>₹247</strong> this month <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ padding: '.3rem .8rem', background: 'rgba(255,208,96,.1)', border: '1px solid rgba(255,208,96,.3)', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                         <span style={{ fontSize: '.9rem' }}>🥇</span> <span style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--o4)' }}>GOLD TIER</span>
                      </div>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                         <div style={{ padding: '.3rem .6rem', background: 'rgba(120,242,117,.1)', border: '1px solid rgba(120,242,117,.2)', borderRadius: '9999px', fontSize: '.7rem', fontWeight: 700, color: 'var(--g4)', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                            📦 ₹2,156
                         </div>
                         <div style={{ padding: '.3rem .6rem', background: 'rgba(255,208,96,.1)', border: '1px solid rgba(255,208,96,.2)', borderRadius: '9999px', fontSize: '.7rem', fontWeight: 700, color: 'var(--o4)', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                            💳 ₹1,326
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Quick Actions */}
             <div className="au d2" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>What would you like to do today?</h3>
                <p style={{ fontSize: '.75rem', color: 'var(--t3)', marginBottom: '1rem' }}>Scan any product to get started</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                   <div onClick={() => navigate('/invoice')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '1rem', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ width: '3rem', height: '3rem', background: 'rgba(255,208,96,.1)', borderRadius: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                         <span className="material-symbols-outlined fi" style={{ color: 'var(--o4)', fontSize: '1.6rem' }}>inventory_2</span>
                         <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '1.2rem', height: '1.2rem', background: 'var(--g4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1rem', fontWeight: 800 }}>+</div>
                      </div>
                      <p style={{ fontSize: '.9rem', fontWeight: 800, marginBottom: '.3rem' }}>Add to Inventory</p>
                      <p style={{ fontSize: '.68rem', color: 'var(--t3)', lineHeight: 1.4 }}>Invoice or manual product add</p>
                   </div>
                   
                   <div onClick={() => navigate('/sell')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '1rem', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ width: '3rem', height: '3rem', background: 'rgba(120,242,117,.1)', borderRadius: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                         <span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '1.6rem' }}>storefront</span>
                         <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '1.2rem', height: '1.2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.8rem' }}>
                           <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>bolt</span>
                         </div>
                      </div>
                      <p style={{ fontSize: '.9rem', fontWeight: 800, marginBottom: '.3rem' }}>Sell a Product</p>
                      <p style={{ fontSize: '.68rem', color: 'var(--t3)', lineHeight: 1.4 }}>Scan code or select from inventory</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.6rem' }}>
                   <div onClick={() => navigate('/earnings')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '.8rem .4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(160,210,255,.1)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--td)', fontSize: '1.1rem' }}>bar_chart</span></div>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--t2)' }}>Earnings</span>
                   </div>
                   <div onClick={() => navigate('/inventory')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '.8rem .4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(255,208,96,.1)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--o4)', fontSize: '1.1rem' }}>inventory</span></div>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--t2)' }}>Stock</span>
                   </div>
                   <div onClick={() => navigate('/assistant')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '.8rem .4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(120,242,117,.1)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '1.1rem' }}>auto_awesome</span></div>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--t2)' }}>Assistant</span>
                   </div>
                   <div onClick={() => navigate('/settings')} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '.8rem .4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '2.2rem', height: '2.2rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--o4)', fontSize: '1.1rem' }}>settings</span></div>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--t2)' }}>Settings</span>
                   </div>
                </div>
             </div>

             {/* Chart */}
             <div className="au d3" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '.68rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.4rem' }}>Weekly Earnings</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹8,440</h2>
                      <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--g4)', display: 'flex', alignItems: 'center' }}>↑18%</span>
                   </div>
                   <div style={{ display: 'flex', gap: '.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--g4)' }}></div><span style={{ fontSize: '.65rem', color: 'var(--t2)' }}>Purchase</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--o4)' }}></div><span style={{ fontSize: '.65rem', color: 'var(--t2)' }}>Sale</span></div>
                   </div>
                </div>
                
                <div style={{ height: '120px', display: 'flex', flexDirection: 'column' }}>
                   <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--bdr2)' }}>
                      {WEEK_DATA.map((d, i) => {
                         const ph = Math.round((d.purchase/maxVal) * 85);
                         const sh = Math.round((d.sale/maxVal) * 85);
                         return (
                           <div key={d.day} className="bar-seg" style={{ width: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                 <div style={{ width: '100%', height: `${ph}px`, background: 'var(--g4)', borderRadius: '4px 4px 0 0', minHeight: '4px', animation: `barGrow .6s ${i * .07}s both` }}></div>
                                 <div style={{ width: '100%', height: `${sh}px`, background: 'var(--o4)', borderRadius: '0 0 2px 2px', minHeight: '3px' }}></div>
                           </div>
                         );
                      })}
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.4rem' }}>
                      {WEEK_DATA.map(d => (
                         <div key={d.day} style={{ width: '12%', textAlign: 'center' }}>
                            <span style={{ fontSize: '.6rem', color: 'var(--t3)', fontWeight: 600 }}>{d.day}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Daily Insight */}
             <div className="au d4" style={{ background: 'rgba(120,242,117,.05)', border: '1px solid rgba(120,242,117,.15)', borderRadius: 'var(--r12)', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.6rem' }}>
                   <div style={{ width: '1.5rem', height: '1.5rem', background: 'var(--g4)', borderRadius: '.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined fi" style={{ color: '#000', fontSize: '1rem' }}>auto_awesome</span>
                   </div>
                   <h3 style={{ fontSize: '.85rem', fontWeight: 800, color: 'var(--g4)' }}>Daily Insight</h3>
                </div>
                {loadingInsight ? (
                  <div style={{ display: 'flex', gap: '4px' }}><div className="tdot"></div><div className="tdot"></div><div className="tdot"></div></div>
                ) : (
                  <p style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.5 }}>
                     {insight}
                  </p>
                )}
             </div>

             {/* Day's Activity */}
             <div className="au d5" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                   <p style={{ fontSize: '.68rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Day's Activity</p>
                   <span onClick={() => navigate('/earnings')} style={{ fontSize: '.75rem', color: 'var(--g4)', fontWeight: 700, cursor: 'pointer' }}>All →</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                   {transactions.slice(0, 3).map((t, i) => (
                      <div key={t.id || i} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '1rem', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)' }}>
                         <div style={{ width: '2rem', height: '2rem', background: 'var(--bg3)', borderRadius: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined fi" style={{ fontSize: '1.1rem', color: t.clr }}>{t.icon || 'receipt'}</span>
                         </div>
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '.85rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</p>
                            <p style={{ fontSize: '.65rem', color: 'var(--t3)' }}>{t.date} · {t.sub}</p>
                         </div>
                         <span style={{ fontWeight: 800, fontSize: '.9rem', color: t.clr, flexShrink: 0 }}>{t.amt}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Top Products */}
             <div className="au d6" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                   <p style={{ fontSize: '.68rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Top Products</p>
                   <span onClick={() => navigate('/inventory')} style={{ fontSize: '.75rem', color: 'var(--g4)', fontWeight: 700, cursor: 'pointer' }}>View all →</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                   
                   {inventory.slice(0, 3).map((p, i) => (
                     <div key={p.id || i} onClick={() => navigate('/sell')} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '1rem', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', cursor: 'pointer' }}>
                        <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <span className="material-symbols-outlined fi" style={{ fontSize: '1.2rem', color: p.clr || 'var(--o4)' }}>{p.icon || 'inventory_2'}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                           <p style={{ fontSize: '.85rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                           <p style={{ fontSize: '.65rem', color: 'var(--t3)' }}>{p.unit} · {p.qty} in stock</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                           <p style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--t1)' }}>₹{p.sell}</p>
                           <p style={{ fontSize: '.65rem', color: 'var(--g4)', fontWeight: 600 }}>earn ₹{p.earn}</p>
                        </div>
                     </div>
                   ))}

                </div>
             </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};
