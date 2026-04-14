import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';
import { useAppContext } from '../../context/AppContext';
import { Intelligence } from '../../services/intelligence';
import { ErrorLogger } from '../../services/errorLogger';

// Instant fallback distributors - shown immediately
const getFallbackDistributors = (category) => {
  const categoryMap = {
    agri: [
      {id: 1, name:'Sharma Agri Distributors',city:'Indore',products:['Fertilizers','Seeds'],rating:4.7,distance:12,emoji:'🌾'},
      {id: 2, name:'MP Krishi Vaahan Pvt Ltd',city:'Bhopal',products:['Agri Chemicals'],rating:4.3,distance:28,emoji:'🚜'},
      {id: 3, name:'Jain Agro Chemicals',city:'Khetgaon',products:['Pesticides'],rating:4.5,distance:5,emoji:'🧪'},
    ],
    food: [
      {id: 1, name:'Metro Wholesale Mart',city:'Indore',products:['Rice','Oils'],rating:4.6,distance:8,emoji:'🍚'},
      {id: 2, name:'Central Food Distributors',city:'Khetgaon',products:['Groceries','Spices'],rating:4.4,distance:3,emoji:'🍱'},
      {id: 3, name:'Premium Grains Trading',city:'Ujjain',products:['Wheat','Pulses'],rating:4.5,distance:32,emoji:'🌾'},
    ],
    pharma: [
      {id: 1, name:'Medline Pharma Distributors',city:'Indore',products:['Medicines','Supplements'],rating:4.7,distance:10,emoji:'💊'},
      {id: 2, name:'HealthCare Plus Distribution',city:'Khetgaon',products:['Medicines','Medical Devices'],rating:4.5,distance:4,emoji:'🏥'},
      {id: 3, name:'Arogya Pharmaceutical',city:'Bhopal',products:['Medicines','Vitamins'],rating:4.6,distance:26,emoji:'⚕️'},
    ],
    hardware: [
      {id: 1, name:'BuildRight Hardware',city:'Indore',products:['Tools','Materials'],rating:4.5,distance:11,emoji:'🔧'},
      {id: 2, name:'Constructor Supply House',city:'Khetgaon',products:['Building Materials'],rating:4.4,distance:6,emoji:'🏗️'},
      {id: 3, name:'Industrial Tools India',city:'Ujjain',products:['Power Tools','Hardware'],rating:4.6,distance:34,emoji:'⚙️'},
    ],
    textile: [
      {id: 1, name:'Fashion Fabric House',city:'Indore',products:['Fabrics','Textiles'],rating:4.7,distance:9,emoji:'👗'},
      {id: 2, name:'Cotton Kingdom Distributors',city:'Khetgaon',products:['Fabrics','Threads'],rating:4.5,distance:5,emoji:'🧵'},
      {id: 3, name:'Apparel Wholesale Market',city:'Ujjain',products:['Garments','Fabrics'],rating:4.6,distance:31,emoji:'👕'},
    ],
    electronics: [
      {id: 1, name:'TechHub Distributors',city:'Indore',products:['Electronics','Accessories'],rating:4.8,distance:7,emoji:'📱'},
      {id: 2, name:'Digital Paradise Wholesale',city:'Khetgaon',products:['Electronics','Gadgets'],rating:4.6,distance:4,emoji:'💻'},
      {id: 3, name:'Cyber Solutions Trading',city:'Bhopal',products:['Components','Accessories'],rating:4.5,distance:25,emoji:'🔌'},
    ],
  };

  return categoryMap[category] || categoryMap.food;
};

export const Distributor = () => {
  const navigate = useNavigate();
  const { user, linkedDists, setLinkedDists } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [dists, setDists] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Show instant fallback
    const instant = getFallbackDistributors(user.cat);
    setDists(instant);
    console.log(`📦 Showing instant fallback: ${instant.length} distributors for ${user.cat}`);
    setLoading(false);
    
    // Try to fetch dynamic distributors in background
    const fetchDynamic = async () => {
      console.log(`🌐 Attempting to fetch dynamic distributors for ${user.cat}...`);
      try {
        const prompt = `Return a JSON array of 3 wholesale distributors for a "${user.cat}" business in India near Khetgaon, MP. Return ONLY valid JSON array: [{"id":1,"name":"...","city":"...","products":[...],"rating":4.5,"distance":10,"emoji":"🏪"}]. Ensure all fields exist and are properly formatted.`;
        
        // Try OpenAI with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const res = await Promise.race([
          Intelligence.askOpenAI(prompt, "You are a distributor database expert. Return ONLY valid JSON."),
          timeoutPromise
        ]);

        if (res && Array.isArray(res) && res.length > 0) {
          // Validate response has required fields
          const valid = res.every(r => r.id && r.name && r.city && r.products && r.rating && r.distance);
          if (valid) {
            console.log(`✅ Got ${res.length} dynamic distributors, replacing fallback`);
            setDists(res);
            return;
          }
        }
      } catch (error) {
        console.log(`⚠️ Dynamic fetch failed: ${error.message}, keeping fallback`);
        ErrorLogger.logError(error, { context: 'Distributor fetch', category: user.cat });
      }
      
      console.log(`📦 Keeping instant fallback`);
    };

    fetchDynamic();
  }, [user.cat]);

  const toggleLink = (dist) => {
    const isLinked = linkedDists.some(d => d.id === dist.id);
    if (isLinked) {
      setLinkedDists(prev => prev.filter(d => d.id !== dist.id));
      showToast('Unlinked');
    } else {
      setLinkedDists(prev => [...prev, dist]);
      showToast(`✅ ${dist.name} linked!`);
    }
  };

  const filtered = dists.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen active">
      <div className="ghead" style={{ padding: '.875rem 1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🤝</span>
            <div><h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Link Distributors</h2><p style={{ fontSize: '.65rem', color: 'var(--t2)' }}>Step 2 of 4</p></div>
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div className="odot done"></div><div className="odot act"></div><div className="odot todo"></div><div className="odot todo"></div>
          </div>
        </div>
      </div>
      
      <div className="scroller" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: '1.4rem', lineHeight: 1.5 }}>Connect with your wholesale suppliers to unlock <strong style={{ color: 'var(--t1)' }}>Purchase Cashback</strong> on every invoice you upload.</p>
        
        {loading && (
          <div className="au" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', background: 'rgba(120,242,117,.06)', border: '1px solid rgba(120,242,117,.2)', borderRadius: 'var(--r8)', padding: '.875rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined aspin" style={{ color: 'var(--g4)', fontSize: '1.2rem' }}>auto_awesome</span>
            </div>
            <div>
              <p style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--g4)' }}>CounterOS AI</p>
              <p style={{ fontSize: '.68rem', color: 'var(--t2)' }}>Finding nearby distributors in {user.loc}...</p>
            </div>
          </div>
        )}

        <Input 
          wrapperClass="au d1 margin-bottom-1" 
          placeholder="Search distributor name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={<span className="material-symbols-outlined" style={{ color: 'var(--t3)', alignSelf: 'center', marginLeft: '.5rem', fontSize: '1.1rem' }}>search</span>}
          style={{ paddingLeft: '0', border: 'none', background: 'transparent' }}
          wrapperStyle={{ background: 'var(--inp)', border: '1.5px solid var(--bdr2)', borderRadius: 'var(--r8)', display: 'flex' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '2rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--t3)' }}>
              <p style={{ fontSize: '.85rem' }}>No distributors found</p>
            </div>
          ) : (
            filtered.map((d, i) => {
              const isLinked = linkedDists.some(x => x.id === d.id);
              return (
                <div key={d.id} className={`dres ${isLinked ? 'linked' : ''} au`} style={{ animationDelay: `${i * 0.06}s` }} onClick={() => toggleLink(d)}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--r8)', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{d.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '.68rem', color: 'var(--t3)' }}>📍 {d.city}</span>
                      <span style={{ fontSize: '.68rem', color: 'var(--t3)' }}>· {d.distance}km</span>
                      <span style={{ fontSize: '.68rem', color: 'var(--o4)' }}>⭐ {d.rating}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '.28rem', marginTop: '.25rem', flexWrap: 'wrap' }}>
                      {d.products.map(p => <span key={p} style={{ fontSize: '.6rem', padding: '.1rem .4rem', background: 'var(--bg3)', border: '1px solid var(--bdr)', borderRadius: '9999px', color: 'var(--t2)' }}>{p}</span>)}
                    </div>
                  </div>
                  <button style={{ background: isLinked ? 'rgba(120,242,117,.14)' : 'var(--bg3)', border: `1px solid ${isLinked ? 'rgba(120,242,117,.28)' : 'var(--bdr2)'}`, borderRadius: 'var(--r6)', padding: '.38rem .7rem', cursor: 'pointer', color: isLinked ? 'var(--g4)' : 'var(--t2)', fontSize: '.72rem', fontWeight: 700, fontFamily: 'var(--fd)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '.22rem', transition: 'all .18s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '.8rem' }}>{isLinked ? 'check' : 'add'}</span>{isLinked ? 'Linked' : 'Link'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="au" style={{ animationDelay: '0.4s', paddingBottom: '1.5rem' }}>
          <Button onClick={() => navigate('/setup/payout')}>Continue to Payout Setup <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span></Button>
        </div>
      </div>
    </div>
  );
};
