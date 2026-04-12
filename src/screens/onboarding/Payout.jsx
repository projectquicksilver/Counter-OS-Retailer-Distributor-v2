import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';

export const Payout = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('upi');

  const handleNext = () => {
    navigate('/setup/ready');
  };

  return (
    <div className="screen active">
      <div className="ghead" style={{ padding: '.875rem 1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💸</span>
            <div><h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Payout Setup</h2><p style={{ fontSize: '.65rem', color: 'var(--t2)' }}>Step 3 of 4</p></div>
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div className="odot done"></div><div className="odot done"></div><div className="odot act"></div><div className="odot todo"></div>
          </div>
        </div>
      </div>
      
      <div className="scroller" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: '1.4rem', lineHeight: 1.5 }}>How would you like to receive your cashback and sale rewards? We settle instantly.</p>
        
        <div className="au d1" style={{ display: 'grid', gap: '.75rem', marginBottom: '1.5rem' }}>
          <div className={`selopt ${method === 'mobile' ? 'sel' : ''}`} onClick={() => setMethod('mobile')}>
             <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--t2)' }}>smartphone</span></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 700 }}>Mobile Number</p>
              <p style={{ fontSize: '.62rem', color: 'var(--t3)', marginTop: '.1rem' }}>Instant transfer to Wallet</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: method === 'mobile' ? 'var(--g4)' : 'var(--t3)' }}>{method === 'mobile' ? 'check_circle' : 'radio_button_unchecked'}</span>
          </div>

          <div className={`selopt ${method === 'upi' ? 'sel' : ''}`} onClick={() => setMethod('upi')}>
            <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ width: '1.4rem', filter: 'grayscale(1) brightness(2)' }}/></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 700 }}>UPI ID</p>
              <p style={{ fontSize: '.62rem', color: 'var(--t3)', marginTop: '.1rem' }}>Instant transfer (0% fee)</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: method === 'upi' ? 'var(--g4)' : 'var(--t3)' }}>{method === 'upi' ? 'check_circle' : 'radio_button_unchecked'}</span>
          </div>
          <div className={`selopt ${method === 'bank' ? 'sel' : ''}`} onClick={() => setMethod('bank')}>
             <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined fi" style={{ color: 'var(--t2)' }}>account_balance</span></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 700 }}>Bank Account</p>
              <p style={{ fontSize: '.62rem', color: 'var(--t3)', marginTop: '.1rem' }}>NEFT/IMPS settlement</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: method === 'bank' ? 'var(--g4)' : 'var(--t3)' }}>{method === 'bank' ? 'check_circle' : 'radio_button_unchecked'}</span>
          </div>
        </div>

        {method === 'upi' && (
          <div className="au as" style={{ marginBottom: '2rem' }}>
            <Input label="UPI ID" placeholder="e.g. ramesh@okicici" wrapperClass="margin-bottom-875" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.75rem .875rem', background: 'rgba(160,210,255,.06)', border: '1px solid rgba(160,210,255,.18)', borderRadius: 'var(--r8)' }}>
              <span className="material-symbols-outlined fi" style={{ color: 'var(--td)', fontSize: '1.1rem' }}>verified_user</span>
              <p style={{ fontSize: '.7rem', color: 'var(--td)', lineHeight: 1.4 }}>We'll verify this UPI ID by sending ₹1 before your first withdrawal.</p>
            </div>
          </div>
        )}

        {method === 'mobile' && (
          <div className="au as" style={{ marginBottom: '2rem' }}>
            <Input type="tel" maxLength="10" label="Mobile Number" placeholder="e.g. 9876543210" wrapperClass="margin-bottom-875" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.75rem .875rem', background: 'rgba(120,242,117,.06)', border: '1px solid rgba(120,242,117,.18)', borderRadius: 'var(--r8)' }}>
              <span className="material-symbols-outlined fi" style={{ color: 'var(--g4)', fontSize: '1.1rem' }}>verified_user</span>
              <p style={{ fontSize: '.7rem', color: 'var(--t1)', lineHeight: 1.4 }}>We'll verify this mobile number before your first withdrawal.</p>
            </div>
          </div>
        )}

        {method === 'bank' && (
          <div className="au as" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Account Number" placeholder="e.g. 1234567890" />
            <Input label="Re-enter Account Number" placeholder="e.g. 1234567890" />
            <Input label="IFSC Code" placeholder="e.g. SBIN0001234" />
          </div>
        )}

        <div className="au d3" style={{ paddingBottom: '1.5rem' }}>
          <Button onClick={handleNext}>Finish Setup <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>check_circle</span></Button>
          <button onClick={handleNext} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--t3)', fontSize: '.78rem', cursor: 'pointer', textAlign: 'center', marginTop: '.8rem', padding: '.4rem', fontFamily: 'var(--fd)' }}>Skip for later</button>
        </div>
      </div>
    </div>
  );
};
