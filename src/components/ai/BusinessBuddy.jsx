import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Intelligence } from '../../services/intelligence';

export const BusinessBuddy = () => {
    const { user, inventory, walletBalance } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: `Hey ${user.name.split(' ')[0]}! I'm your CounterOS Buddy. How can I help you with your business today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getFullContext = () => {
        const lowStock = inventory.filter(p => p.qty < 10).map(p => p.name).join(', ');
        return `Persona: You are "CounterOS Buddy", a friendly, proactive, and witty business assistant. 
Current State:
- Retailer: ${user.name}
- Wallet: ₹${walletBalance}
- Inventory: ${inventory.length} items
- Low Stock items: ${lowStock || 'None'}
- Shop Category: ${user.cat}

Keep responses short, actionable, and encouraging. Use emojis!`;
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        const response = await Intelligence.ask(userMsg, getFullContext());
        setIsTyping(false);
        
        if (response) {
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } else {
            setMessages(prev => [...prev, { role: 'ai', text: "Oops, my brain took a break. Ready again! 🚀" }]);
        }
    };

    return (
        <>
            {/* The Floating Bubble */}
            <div className="buddy-fab" onClick={() => setIsOpen(true)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>auto_awesome</span>
            </div>

            {/* The Chat Panel */}
            {isOpen && (
                <div className="buddy-panel" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
                    <div className="buddy-content">
                        {/* Header */}
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', borderRadius: '1.5rem 1.5rem 0 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                                <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, var(--g4), var(--g6))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#000', fontSize: '1.4rem' }}>face</span>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '1rem' }}>Business Buddy</p>
                                    <p style={{ fontSize: '.7rem', color: 'var(--g4)', fontWeight: 700 }}>Online & Ready</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'var(--bg3)', border: 'none', color: 'var(--t2)', width: '2.2rem', height: '2.2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((m, i) => (
                                <div key={i} className={m.role === 'ai' ? 'msg-ai' : 'msg-user'} dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }}>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="msg-ai">
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <div className="tdot" style={{ background: 'var(--g4)' }}></div>
                                        <div className="tdot" style={{ background: 'var(--g4)', animationDelay: '0.2s' }}></div>
                                        <div className="tdot" style={{ background: 'var(--g4)', animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '1rem', background: 'var(--bg2)', borderTop: '1px solid var(--bdr)' }}>
                            <div style={{ display: 'flex', gap: '.5rem', background: 'var(--bg1)', padding: '.4rem', borderRadius: 'var(--r12)', border: '1px solid var(--bdr)' }}>
                                <input 
                                    className="ifield" 
                                    style={{ border: 'none', background: 'transparent' }} 
                                    placeholder="Type your question..." 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend} style={{ width: '2.4rem', height: '2.4rem', background: 'var(--g4)', border: 'none', borderRadius: 'var(--r8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
