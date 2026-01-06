import React from 'react';
import './Button.css'; 

export function Button({ children, variant = 'primary', isLoading, className='', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}