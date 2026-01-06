import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header"><h3>{title}</h3><X onClick={onClose} style={{cursor:'pointer'}}/></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}