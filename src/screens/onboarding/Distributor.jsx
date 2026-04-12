import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';
import { useAppContext } from '../../context/AppContext';
import { Intelligence } from '../../services/intelligence';

const FALLBACK_DISTS = [
  {id: 1, name:'Sharma Agri Distributors',city:'Indore',products:['Fertilizers','Seeds'],rating:4.7,distance:12,emoji:'🌾'},
  {id: 2, name:'MP Krishi Vaahan Pvt Ltd',city:'Bhopal',products:['Agri Chemicals'],rating:4.3,distance:28,emoji:'🚜'},
  {id: 3, name:'Jain Agro Chemicals',city:'Khetgaon',products:['Pesticides'],rating:4.5,distance:5,emoji:'🧪'},
  {id: 4, name:'Rajhans Fertilizers',city:'Ujjain',products:['Fertilizers'],rating:4.2,distance:35,emoji:'🌱'},
];

export const Distributor = () => {
  const navigate = useNavigate();
  const { user, linkedDists, setLinkedDists } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [dists, setDists] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDynamicDists = async () => {
      setLoading(true);
      const prompt = `Return a JSON array of 3 realistic dummy wholesale distributors for a "${user.cat}" business in India. Include fields: id (number), name (string), city (string), products (array of 2 strings), rating (number like 4.5), distance (number), emoji (string).`;
      
      const res = await Intelligence.askJSON(prompt);
      if (res && Array.isArray(res) && res.length > 0) {
        setDists(res);
      } else {
        setDists(FALLBACK_DISTS);
      }
      setLoading(false);
    };
    
    fetchDynamicDists();
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
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.8rem 1rem', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r8)' }}>
                <div className="skel" style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--r6)', flexShrink: 0 }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.38rem' }}>
                  <div className="skel" style={{ height: '.85rem', width: '60%' }}></div>
                  <div className="skel" style={{ height: '.72rem', width: '40%' }}></div>
                </div>
              </div>
            ))
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
