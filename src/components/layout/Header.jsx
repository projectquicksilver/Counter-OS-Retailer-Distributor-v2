import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../ui/Button';

export const Header = ({ title, subtitle, backTo, rightContent }) => {
  const navigate = useNavigate();

  return (
    <div className="ghead" style={{ padding: '.875rem 1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
          {backTo && (
            <IconButton isBack={true} onClick={() => navigate(backTo)}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.05rem' }}>arrow_back</span>
            </IconButton>
          )}
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '.65rem', color: 'var(--t2)' }}>{subtitle}</p>}
          </div>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </div>
  );
};
