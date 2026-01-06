import React from 'react';
import { AlertCircle } from 'lucide-react';
import './Alert.css'; 

export function Alert({ children }) {
 
  if (!children) return null;

  return (
    <div className="alert">
      <AlertCircle size={18} />
      <span>{children}</span>
    </div>
  );
}