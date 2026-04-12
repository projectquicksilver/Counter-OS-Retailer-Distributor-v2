import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, OtpInput } from '../components/ui/Input';
import { showToast } from '../components/ui/Toast';
import { useAppContext } from '../context/AppContext';
import { Chip } from '../components/ui/Chip';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    if (phone.length < 10 && phone !== '') {
      showToast('⚠️ Enter 10-digit mobile number');
      return;
    }
    const ph = phone || '9876543210';
    setPhone(ph);
    setUser(prev => ({ ...prev, phone: ph }));
    setStep(2);
    showToast('📱 OTP sent! Demo: 1234');
  };

  const handleVerifyOTP = () => {
    if (otp === '1234' || otp.length === 4) {
      showToast('✅ Verified!');
      setTimeout(() => navigate('/setup/shop'), 500);
    } else {
      showToast('❌ Wrong OTP. Use: 1234');
      setOtp('');
    }
  };

  const skipToHome = () => {
    setUser(prev => ({
      ...prev,
      name: prev.name || 'Ramesh Kumar Sharma',
      shop: prev.shop || 'Ramesh Agro Traders',
      loc: prev.loc || 'Khetgaon, Madhya Pradesh',
    }));
    navigate('/home');
  };

  return (
    <div className="screen active" id="s-login">
      {/* Dynamic Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(82,204,79,.15), transparent), radial-gradient(ellipse 60% 40% at 85% 85%, rgba(255,208,96,.1), transparent)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none' }}></div>
      
      <div className="scroller" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
        
        {/* Premium Graphic Header */}
        <div style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* The Floating Boxes properly constrained within a Hero Container */}
            <div className="au" style={{ position: 'relative', width: '280px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Generated 3D Illustration */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 5s ease-in-out infinite' }}>
                    <img src="/auth_hero.png" alt="CounterOS Vision" style={{ width: '85%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(82,204,79,0.4))' }} />
                </div>

                {/* Floating Card Left: Properly Bound */}
                <div className="afloat2 d1" style={{ position: 'absolute', left: '-20px', top: '10%', background: 'rgba(5,9,5,.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(120,242,117,.3)', borderRadius: 'var(--r12)', padding: '.75rem', display: 'flex', alignItems: 'center', gap: '.6rem', boxShadow: '0 8px 32px rgba(0,0,0,.6)' }}>
                  <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(120,242,117,.15)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined fi" style={{ fontSize: '1.2rem', color: 'var(--g4)' }}>account_balance_wallet</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '.65rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Cashback</p>
                    <p style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1rem', color: 'var(--g4)' }}>+₹1,180</p>
                  </div>
                </div>

                {/* Floating Card Right: Properly Bound */}
                <div className="afloat d2" style={{ position: 'absolute', right: '-15px', bottom: '15%', background: 'rgba(5,9,5,.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,208,96,.3)', borderRadius: 'var(--r12)', padding: '.75rem', display: 'flex', alignItems: 'center', gap: '.6rem', boxShadow: '0 8px 32px rgba(0,0,0,.6)' }}>
                  <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(255,208,96,.15)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined fi" style={{ fontSize: '1.2rem', color: 'var(--o4)' }}>storefront</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '.65rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Rewards</p>
                    <p style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1rem', color: 'var(--o4)' }}>+₹356</p>
                  </div>
                </div>
            </div>

            <div className="au d2" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1 }}>Counter<span className="gtext">OS</span></h1>
              <p style={{ fontSize: '.8rem', color: 'var(--t2)', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginTop: '.4rem' }}>Retailer Intelligence</p>
            </div>
            
            <div className="au d3" style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.25rem' }}>
              <Chip variant="g">Dual Earning</Chip>
              <Chip variant="o">AI Invoicing</Chip>
            </div>
        </div>

        {/* Login form Glass Panel */}
        <div className="au d4" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(16,23,16,0.6), rgba(5,9,5,1))', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--bdr2)', padding: '2rem 1.4rem' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.5rem', letterSpacing: '-.02em', color: 'var(--t1)' }}>Get Started</p>
              <p style={{ fontSize: '.85rem', color: 'var(--t3)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Enter your mobile number to securely sign in or create your new CounterOS retailer account.</p>

              <div style={{ display: 'flex', alignItems: 'stretch', gap: '.6rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--t2)' }}>
                      🇮🇳 <span style={{ fontSize: '.9rem' }}>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Enter Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ flex: 1, background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', padding: '1.1rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--t1)', fontFamily: 'var(--fm)', outline: 'none' }}
                  />
              </div>

              <div style={{ marginTop: 'auto' }}>
                  <Button onClick={handleSendOTP} style={{ padding: '1rem', fontSize: '1rem', borderRadius: 'var(--r12)' }}>
                    Continue securely <span className="material-symbols-outlined fi">arrow_right_alt</span>
                  </Button>
              </div>
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '4rem', height: '4rem', background: 'rgba(120,242,117,.1)', border: '1px solid rgba(120,242,117,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '2rem' }}>phonelink_ring</span>
                  </div>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--t1)', marginBottom: '.3rem' }}>Verify your number</p>
                  <p style={{ fontSize: '.85rem', color: 'var(--t3)' }}>We've sent a 4-digit OTP to <strong style={{ color: 'var(--g4)' }}>+91 {phone}</strong></p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <OtpInput length={4} value={otp} onChange={setOtp} />
              </div>
              
              <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--t3)', marginBottom: '2rem' }}>Developer Demo: <strong style={{ color: 'var(--g4)', fontFamily: 'var(--fm)', fontSize: '.9rem' }}>1234</strong></p>
              
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                  <Button onClick={handleVerifyOTP} style={{ padding: '1rem', fontSize: '1rem', borderRadius: 'var(--r12)' }}>
                    Verify & Proceed <span className="material-symbols-outlined fi">verified</span>
                  </Button>
                  <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--bdr2)', color: 'var(--t2)', fontSize: '.85rem', cursor: 'pointer', width: '100%', textAlign: 'center', fontWeight: 700, padding: '1rem', borderRadius: 'var(--r12)' }}>
                      Edit mobile number
                  </button>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', margin: '1.25rem 0 .7rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
            <span style={{ fontSize: '.65rem', color: 'var(--t3)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Already registered?</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
          </div>
          
          <button onClick={skipToHome} style={{ width: '100%', background: 'rgba(120,242,117,.06)', border: '1px solid rgba(120,242,117,.18)', borderRadius: 'var(--r12)', padding: '1rem', color: 'var(--g4)', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--fm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
            <span className="material-symbols-outlined fi" style={{ fontSize: '1.1rem' }}>login</span>
            Sign in securely directly to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
