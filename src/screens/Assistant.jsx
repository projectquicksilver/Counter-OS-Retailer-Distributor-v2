import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAppContext } from '../context/AppContext';
import { Intelligence } from '../services/intelligence';

export const Assistant = () => {
  const navigate = useNavigate();
  const { user, inventory, walletBalance } = useAppContext();
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Namaste ${user.name.split(' ')[0]}! 👋 Your wallet has **₹${walletBalance.toLocaleString('en-IN')}** this month.\n\nYou need **₹26,550 more in purchases** to unlock Diamond tier (2.5% cashback). Ask me anything!` }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getSystemContext = () => {
    const invCount = inventory.length;
    const lowStock = inventory.filter(p => p.qty < 6).map(p => p.name.split(' ').slice(0,2).join(' ')).join(', ') || 'none';
    const topProd  = [...inventory].sort((a,b) => b.earn - a.earn)[0]?.name?.split(' ').slice(0,3).join(' ') || 'N/A';
    return `You are CounterOS, a smart business assistant for Indian retailers.
Platform: CounterOS — dual earning system (purchase cashback + sale rewards).
Retailer: ${user.name} | ${user.shop} | ${user.loc}
Category: ${user.cat}
Tier: Gold (1.75% purchase cashback) | Diamond needs ₹1,00,000/month (2.5%)
Inventory: ${invCount} products | Low stock: ${lowStock} | Top earner: ${topProd}
Rules: Be concise (max 80 words). Use ₹ symbols. Be specific. No generic filler advice. Sound like a smart business advisor.`;
  };

  const handleSend = async (overrideMsg) => {
    const msgOut = (overrideMsg || inputMsg).trim();
    if (!msgOut) return;
    
    setInputMsg('');
    setShowQuick(false);
    
    setMessages(prev => [...prev, { role: 'user', text: msgOut }]);
    setIsTyping(true);

    const promptText = messages.length === 1 ? `${getSystemContext()}\n\nUser question: ${msgOut}` : msgOut;
    
    const reply = await Intelligence.ask(promptText, messages.length > 1 ? getSystemContext() : null);
    
    setIsTyping(false);
    if (reply) {
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } else {
      // Fallback
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the network right now. But looking at your data: you have some low stock items to restock!" }]);
    }
  };

  return (
    <div className="screen active" style={{ background: 'var(--bg1)' }}>
      <Header title="CounterOS AI Assistant" subtitle="Smart Business Advisor" backTo="/home" />
      
      <div className="scroller" ref={scrollRef} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '.5rem' }}>
           <div className="chip chip-g" style={{ background: 'var(--bg2)', color: 'var(--t3)', border: '1px solid var(--bdr)' }}>Today</div>
        </div>

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp .28s both' }}>
            <div className={m.role === 'ai' ? 'cbubble-ai' : 'cbubble-user'} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>') }}>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', animation: 'fadeUp .25s both' }}>
            <div className="cbubble-ai">
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="tdot"></div><div className="tdot"></div><div className="tdot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg2)', padding: '.75rem 1rem', borderTop: '1px solid var(--bdr)' }}>
        {showQuick && (
          <div style={{ display: 'flex', gap: '.5rem', overflowX: 'auto', marginBottom: '.75rem', paddingBottom: '4px', scrollbarWidth: 'none' }}>
             <button onClick={() => handleSend('What should I reorder?')} className="ifbtn">What should I reorder?</button>
             <button onClick={() => handleSend('How to reach Diamond tier?')} className="ifbtn">How to reach Diamond tier?</button>
             <button onClick={() => handleSend('Top performing products?')} className="ifbtn">Top performing products?</button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '.5rem' }}>
           <input 
             className="ifield" 
             placeholder="Ask CounterOS AI..." 
             value={inputMsg}
             onChange={e => setInputMsg(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             style={{ padding: '.7rem 1rem', borderRadius: 'var(--r12)' }}
           />
           <button 
             onClick={() => handleSend()}
             style={{ width: '2.8rem', height: '2.8rem', borderRadius: 'var(--r12)', background: 'linear-gradient(135deg, var(--g4), var(--g6))', border: 'none', color: '#021302', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
           >
              <span className="material-symbols-outlined fi">send</span>
           </button>
        </div>
      </div>
    </div>
  );
};
