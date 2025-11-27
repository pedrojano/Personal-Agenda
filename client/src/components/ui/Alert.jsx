import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Alert({ children }) {

  if (!children) return null;

  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center text-sm animate-pulse-once">
      <AlertCircle size={18} className="mr-2 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}