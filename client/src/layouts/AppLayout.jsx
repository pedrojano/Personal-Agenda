import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, Bot, User } from 'lucide-react';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };
 
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">Agenda Pro</div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <LayoutDashboard size={20}/> Dashboard
          </Link>
          
          <Link to="/tasks" className={getLinkClass('/tasks')}>
            <CheckSquare size={20}/> Tarefas
          </Link>

          <Link to="/ai" className={getLinkClass('/ai')}>
            <Bot size={20}/> Assistente IA
          </Link>

          <Link to="/profile" className={getLinkClass('/profile')}>
            <User size={20}/> Perfil
          </Link>

          <button onClick={logout} className="nav-item" style={{marginTop:'auto', color:'red'}}>
            <LogOut size={20}/> Sair
          </button>
        </nav>
      </aside>
      
      <main className="content">{children}</main>
    </div>
  );
}