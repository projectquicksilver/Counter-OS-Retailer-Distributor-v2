import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppContext } from '../context/AppContext';
import { Intelligence } from '../services/intelligence';
import { showToast } from '../components/ui/Toast';

export const Invoice = () => {
  const navigate = useNavigate();
  const { addInventoryItem } = useAppContext();
  
  const [status, setStatus] = useState('idle'); // idle | processing | results
  const [procSteps, setProcSteps] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [parsedProducts, setParsedProducts] = useState([]);
  const fileInputRef = useRef(null);

  const stepsList = ['Reading distributor details...','Scanning product list...','Extracting quantities & prices...','Calculating purchase cashback...','Finalising inventory data...'];

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const b64 = ev.target.result.split(',')[1];
      const mime = f.type || 'image/jpeg';
      await runParse(b64, mime, f.name);
    };
    reader.readAsDataURL(f);
  };

  const runParse = async (b64, mime, fname) => {
    showProcessing();
    const data = await Intelligence.readInvoice(b64, mime);
    if (data && data.products) showResults(data, fname);
    else showDemoResults(fname);
  };

  const loadDemo = async () => {
    showProcessing();
    const prompt = `Generate realistic Indian agricultural distributor invoice data as JSON.\nDistributor: Sharma Agri Distributors, Indore.\n5 products for an agri input dealer in Madhya Pradesh.\n{"distributor_name":"Sharma Agri Distributors","invoice_number":"SH-2024-0891","invoice_date":"12 Aug 2024","total_value":67450,"products":[{"name":"","category":"Fertilizer","quantity":10,"unit":"50kg bag","unit_price":1350,"total_price":13500}]}`;
    const data = await Intelligence.askJSON(prompt);
    if (data && data.products) showResults(data, 'Demo_Invoice.pdf');
    else showDemoResults('Demo_Invoice.pdf');
  };

  const showProcessing = () => {
    setStatus('processing');
    setProcSteps([]);
    let i = 0;
    const procTimer = setInterval(() => {
      if (i >= stepsList.length) {
        clearInterval(procTimer);
        return;
      }
      setProcSteps(prev => [...prev, stepsList[i]]);
      i++;
    }, 620);
    // Timer will naturally be cleared when state is updated
  };

  const showResults = (data, fname) => {
    setStatus('results');
    setParsedData(data);
    setParsedProducts(data.products || []);
  };

  const showDemoResults = (fname) => {
    const demo = {
      distributor_name: 'Sharma Agri Distributors', invoice_number: 'SH-2024-0891', invoice_date: '12 Aug 2024', total_value: 67450,
      products: [
        {name:'IFFCO DAP 18:46:0',category:'Fertilizer',quantity:20,unit:'50kg bag',unit_price:1350,total_price:27000, added: false},
        {name:'Urea 46% N',category:'Fertilizer',quantity:30,unit:'50kg bag',unit_price:267,total_price:8010, added: false},
        {name:'Chlorpyrifos 20% EC',category:'Pesticide',quantity:10,unit:'500ml',unit_price:435,total_price:4350, added: false},
      ]
    };
    showResults(demo, fname);
  };

  const getTotal = () => parsedProducts.reduce((s, p) => s + (p.quantity * p.unit_price), 0);

  const getCashback = (tot) => {
    if (tot >= 100000) return { pct: 2.5, tier: 'Diamond', emoji: '💎', cb: +(tot * 0.025).toFixed(0) };
    if (tot >= 50000) return { pct: 1.75, tier: 'Gold', emoji: '🥇', cb: +(tot * 0.0175).toFixed(0) };
    if (tot >= 10000) return { pct: 1.0, tier: 'Silver', emoji: '🥈', cb: +(tot * 0.01).toFixed(0) };
    return { pct: 0, tier: 'Bronze', emoji: '🥉', cb: 0 };
  };

  const updateProd = (idx, field, val) => {
    const next = [...parsedProducts];
    next[idx][field] = Number(val);
    next[idx].total_price = next[idx].quantity * next[idx].unit_price;
    setParsedProducts(next);
  };

  const addOne = (idx) => {
    const p = parsedProducts[idx];
    if (p.added) return;
    
    addInventoryItem({
      name: p.name,
      cat: p.category || 'Other',
      unit: p.unit,
      qty: p.quantity,
      buy: p.unit_price,
      sell: +(p.unit_price * 1.12).toFixed(0),
      icon: 'inventory_2',
      clr: '#8a9e8a',
      earn: +(p.unit_price * 0.01).toFixed(2)
    });
    
    const next = [...parsedProducts];
    next[idx].added = true;
    setParsedProducts(next);
  };

  const confirmAll = () => {
    parsedProducts.forEach((_, i) => addOne(i));
    showToast('✅ Invoice confirmed! Stock updated.');
    setTimeout(() => navigate('/home'), 500);
  };

  const renderContent = () => {
    if (status === 'processing') {
      return (
        <div style={{ textAlign: 'center', padding: '3rem 1.4rem' }}>
          <div className="asp" style={{ width: '4.5rem', height: '4.5rem', background: 'rgba(120,242,117,.1)', border: '1px solid rgba(120,242,117,.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', position: 'relative' }}>
            <span className="material-symbols-outlined aspin" style={{ color: 'var(--g4)', fontSize: '2.2rem' }}>sync</span>
          </div>
          <h2 className="au" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Processing Invoice...</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {procSteps.map((s, i) => (
              <div key={i} className="au" style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.32rem .6rem', background: 'rgba(120,242,117,.05)', border: '1px solid rgba(120,242,117,.12)', borderRadius: 'var(--r6)' }}>
                <span className="material-symbols-outlined fi" style={{ fontSize: '.8rem', color: 'var(--g4)' }}>check_circle</span>
                <span style={{ fontSize: '.75rem', color: 'var(--t2)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (status === 'results' && parsedData) {
      const tot = getTotal();
      const cbConfig = getCashback(tot);
      
      return (
        <div className="au" style={{ padding: '1.25rem' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r12)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '.75rem', color: 'var(--t3)' }}>Distributor</p>
                <p style={{ fontWeight: 800 }}>{parsedData.distributor_name}</p>
                <p style={{ fontSize: '.7rem', color: 'var(--t2)', marginTop: '2px' }}>Invoice #{parsedData.invoice_number} · {parsedData.invoice_date}</p>
              </div>
              <button 
                onClick={() => { setStatus('idle'); setParsedData(null); }} 
                style={{ background: 'var(--bg3)', border: '1px solid var(--bdr2)', borderRadius: 'var(--r6)', padding: '.3rem .6rem', color: 'var(--t2)', fontSize: '.68rem', cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <div style={{ flex: 1, padding: '.75rem', background: 'rgba(255,208,96,.06)', border: '1px solid rgba(255,208,96,.18)', borderRadius: 'var(--r8)' }}>
                 <p style={{ fontSize: '.62rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Purchase Total</p>
                 <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--t1)' }}>₹{tot.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ flex: 1, padding: '.75rem', background: 'rgba(120,242,117,.06)', border: '1px solid rgba(120,242,117,.18)', borderRadius: 'var(--r8)' }}>
                 <p style={{ fontSize: '.62rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Cashback Earned</p>
                 <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--g4)' }}>{cbConfig.cb > 0 ? `₹${cbConfig.cb.toLocaleString('en-IN')}` : 'None'}</p>
              </div>
            </div>
            <div style={{ marginTop: '.8rem', padding: '.45rem .8rem', background: 'var(--bg3)', borderRadius: 'var(--r6)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
               <span style={{ fontSize: '1rem' }}>{cbConfig.emoji}</span>
               <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--t2)' }}>
                  {cbConfig.cb > 0 ? `${cbConfig.tier} Tier — ${cbConfig.pct}% cashback applied` : '🥉 Bronze — min ₹10,000 needed'}
               </span>
            </div>
          </div>

          <h3 style={{ fontSize: '.95rem', fontWeight: 800, marginBottom: '.8rem' }}>Extracted Products ({parsedProducts.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.5rem' }}>
            {parsedProducts.map((p, i) => (
              <div key={i} className={`inv-row ${p.added ? 'added' : ''} au`} style={{ animationDelay: `${i * .06}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                  <div style={{ width: '2.4rem', height: '2.4rem', background: 'var(--bg3)', borderRadius: '.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <span className="material-symbols-outlined fi" style={{ fontSize: '1.05rem', color: '#78f275' }}>inventory_2</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                     <p style={{ fontWeight: 700, fontSize: '.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                     <p style={{ fontSize: '.65rem', color: 'var(--g4)' }}>Earn ₹{+(p.unit_price * 0.01).toFixed(2)}/unit on resale</p>
                  </div>
                  <button onClick={() => addOne(i)} disabled={p.added} className="btn-primary btn-xs" style={{ flexShrink: 0, opacity: p.added ? 0.7 : 1, background: p.added ? 'rgba(120,242,117,.18)' : '', border: p.added ? '1px solid rgba(120,242,117,.35)' : '', color: p.added ? 'var(--g4)' : '', boxShadow: p.added ? 'none' : '' }}>
                     <span className="material-symbols-outlined" style={{ fontSize: '.8rem' }}>{p.added ? 'check' : 'add'}</span> {p.added ? 'Added' : 'Add'}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.4rem', marginTop: '.65rem' }}>
                  <div>
                    <label className="ilabel">Qty</label>
                    <Input type="number" className="ifield-sm" style={{ fontFamily: 'var(--fm)' }} value={p.quantity} onChange={e => updateProd(i, 'quantity', e.target.value)} />
                  </div>
                  <div>
                    <label className="ilabel">Unit ₹</label>
                    <Input type="number" className="ifield-sm" style={{ fontFamily: 'var(--fm)' }} value={p.unit_price} onChange={e => updateProd(i, 'unit_price', e.target.value)} />
                  </div>
                  <div>
                    <label className="ilabel">Total ₹</label>
                    <Input type="number" className="ifield-sm" style={{ fontFamily: 'var(--fm)', color: 'var(--t2)' }} readOnly value={p.total_price || (p.quantity * p.unit_price)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={confirmAll}>
             Confirm & Add Stock <span className="material-symbols-outlined">inventory</span>
          </Button>
        </div>
      );
    }

    // Idle view
    return (
      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: '1.4rem', lineHeight: 1.5 }}>
          Upload a distributor invoice to automatically detect products, add stock, and claim <strong style={{ color: 'var(--t1)' }}>Purchase Cashback</strong>.
        </p>

        <div onClick={triggerUpload} className="au d1" style={{ border: '2px dashed var(--bdr2)', borderRadius: 'var(--r12)', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', background: 'var(--bg2)', cursor: 'pointer', transition: 'all .2s' }}>
          <div style={{ width: '3.6rem', height: '3.6rem', borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--g4)' }}>cloud_upload</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '.25rem' }}>Upload Invoice Document</p>
            <p style={{ fontSize: '.72rem', color: 'var(--t3)' }}>PDF, JPG, or PNG (Max 5MB)</p>
          </div>
          <button style={{ background: 'rgba(120,242,117,.08)', border: '1px solid rgba(120,242,117,.2)', borderRadius: '9999px', padding: '.45rem 1.1rem', color: 'var(--g4)', fontSize: '.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.3rem', marginTop: '.5rem', pointerEvents: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>file_open</span> Browse Files
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*,application/pdf" style={{ display: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
          <span style={{ fontSize: '.65rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>OR TRY DEMO</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }}></div>
        </div>

        <div className="au d2" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <Button onClick={loadDemo} className="btn-ghost" style={{ border: '1px dashed var(--bdr2)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--g4)' }}>auto_awesome</span> Read demo generated invoice
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="screen active">
        <Header title="Upload Invoice" subtitle="AI Parsing & Cashback" />
        <div className="scroller">
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
};
