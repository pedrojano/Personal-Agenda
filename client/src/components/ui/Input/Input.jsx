import React from 'react';
import './Input.css';

export function Input({ label, icon: Icon, error, className='', ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label>{label}</label>}
      <div className="input-wrapper">
        {Icon && <div className="input-icon"><Icon size={18}/></div>}
        <input className={`form-input ${Icon ? 'has-icon' : ''} ${error ? 'error' : ''}`} {...props} />
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}