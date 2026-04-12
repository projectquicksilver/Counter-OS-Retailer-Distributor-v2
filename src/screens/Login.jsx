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
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(82,204,79,.1), transparent), radial-gradient(ellipse 60% 40% at 85% 85%, rgba(255,208,96,.06), transparent)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--bdr) 1px, transparent 1px), linear-gradient(90deg, var(--bdr) 1px, transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none', opacity: .6 }}></div>
      
      <div className="scroller" style={{ display: 'flex', flexDirection: 'column', padding: '0 1.4rem 1.8rem', position: 'relative' }}>
        
        {/* Logo Section */}
        <div style={{ paddingTop: '3.2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div className="asp" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', background: 'linear-gradient(145deg, var(--bg3), var(--bg2))', border: '1px solid rgba(120,242,117,.3)', borderRadius: '1.4rem', marginBottom: '1.4rem', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="15" width="13" height="19" rx="2" stroke="#52cc4f" strokeWidth="1.4"/>
              <rect x="21" y="9" width="16" height="26" rx="2" stroke="#52cc4f" strokeWidth="1.4"/>
              <rect x="7" y="19" width="5" height="1.8" rx=".9" fill="#52cc4f" opacity=".6"/>
              <rect x="7" y="23" width="5" height="1.8" rx=".9" fill="#52cc4f" opacity=".6"/>
              <rect x="25" y="13" width="8" height="1.8" rx=".9" fill="#52cc4f" opacity=".6"/>
              <rect x="25" y="17" width="8" height="1.8" rx=".9" fill="#52cc4f" opacity=".6"/>
              <rect x="25" y="21" width="8" height="1.8" rx=".9" fill="#52cc4f" opacity=".6"/>
              <circle cx="20" cy="7" r="3.5" fill="none" stroke="#ffd060" strokeWidth="1.3"/>
              <circle cx="20" cy="7" r="1.5" fill="#ffd060"/>
            </svg>
          </div>
          <div className="au d1">
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-.04em', marginBottom: '.3rem', lineHeight: 1 }}>Counter<span className="gtext">OS</span></h1>
            <p style={{ fontSize: '.72rem', color: 'var(--t2)', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>Retailer Intelligence Platform</p>
          </div>
          <div className="au d2" style={{ display: 'flex', justifyContent: 'center', gap: '.4rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Chip variant="g">Dual Rewards</Chip>
            <Chip variant="o">4-Tier Cashback</Chip>
            <Chip variant="b">Smart Invoicing</Chip>
          </div>
        </div>

        {/* Floating cards */}
        <div className="au d3" style={{ position: 'relative', height: '88px', marginBottom: '2rem' }}>
          <div className="afloat" style={{ position: 'absolute', left: 0, top: 0, background: 'var(--bg2)', border: '1px solid var(--bdr2)', borderRadius: 'var(--r12)', padding: '.6rem .9rem', display: 'flex', alignItems: 'center', gap: '.6rem', boxShadow: 'var(--sh)' }}>
            <div style={{ width: '2rem', height: '2rem', background: 'rgba(120,242,117,.1)', borderRadius: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined fi" style={{ fontSize: '.95rem', color: 'var(--g4)' }}>local_shipping</span>
            </div>
            <div>
              <p style={{ fontSize: '.58rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Purchase Cashback</p>
              <p style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '.9rem', color: 'var(--g4)' }}>+₹1,180</p>
            </div>
          </div>
          <div className="afloat2" style={{ position: 'absolute', right: 0, bottom: 0, background: 'var(--bg2)', border: '1px solid rgba(255,208,96,.2)', borderRadius: 'var(--r12)', padding: '.6rem .9rem', display: 'flex', alignItems: 'center', gap: '.6rem', boxShadow: 'var(--sh)' }}>
            <div style={{ width: '2rem', height: '2rem', background: 'rgba(255,208,96,.1)', borderRadius: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined fi" style={{ fontSize: '.95rem', color: 'var(--o4)' }}>storefront</span>
            </div>
            <div>
              <p style={{ fontSize: '.58rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Sale Rewards</p>
              <p style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '.9rem', color: 'var(--o4)' }}>+₹356</p>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="au d4" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '.875rem' }}>
          {step === 1 ? (
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '.875rem', letterSpacing: '-.02em' }}>Sign in to your account</p>
              <Input
                type="tel"
                maxLength="10"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                wrapperClass="margin-bottom-875"
                prefix={<div style={{ background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', padding: '.8rem .875rem', fontWeight: 700, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: '.25rem', flexShrink: 0, fontSize: '.85rem' }}>🇮🇳 +91</div>}
              />
              <Button onClick={handleSendOTP} style={{ marginTop: '.875rem' }}>
                <span className="material-symbols-outlined fi">sms</span> Send OTP
              </Button>
            </div>
          ) : (
             <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.875rem', padding: '.7rem .875rem', background: 'rgba(120,242,117,.05)', border: '1px solid rgba(120,242,117,.15)', borderRadius: 'var(--r8)' }}>
                <span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '1.1rem' }}>mark_email_read</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '.85rem' }}>OTP sent!</p>
                  <p style={{ fontSize: '.72rem', color: 'var(--t2)' }}>Sent to +91 {phone}</p>
                </div>
              </div>
              <OtpInput length={4} value={otp} onChange={setOtp} />
              <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--t3)', margin: '.75rem 0' }}>Demo OTP: <strong style={{ color: 'var(--g4)', fontFamily: 'var(--fm)' }}>1234</strong></p>
              <Button onClick={handleVerifyOTP}>
                <span className="material-symbols-outlined fi">verified</span>Verify & Enter
              </Button>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '.78rem', cursor: 'pointer', width: '100%', textAlign: 'center', marginTop: '.6rem', padding: '.4rem' }}>← Change number</button>
            </div>
          )}
          
          <p style={{ fontSize: '.68rem', color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>By continuing you agree to <span style={{ color: 'var(--g4)' }}>Terms</span> & <span style={{ color: 'var(--g4)' }}>Privacy</span></p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
            <span style={{ fontSize: '.65rem', color: 'var(--t3)', whiteSpace: 'nowrap' }}>Already registered?</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
          </div>
          
          <button onClick={skipToHome} style={{ width: '100%', background: 'rgba(120,242,117,.06)', border: '1px solid rgba(120,242,117,.18)', borderRadius: 'var(--r8)', padding: '.7rem 1rem', color: 'var(--g4)', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
            <span className="material-symbols-outlined fi" style={{ fontSize: '.9rem' }}>login</span>
            Enter registered number &amp; sign in directly
          </button>
        </div>
      </div>
    </div>
  );
};
