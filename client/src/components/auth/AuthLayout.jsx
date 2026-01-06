import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import './Auth.css';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <LayoutDashboard size={80} style={{marginBottom: 20}} />
        <h1>Agenda Pro</h1>
        <p>Organize sua vida com eficiência.</p>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}