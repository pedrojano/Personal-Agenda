import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...props 
}) {
  
  const baseStyles = "w-full flex justify-center items-center font-bold py-3 px-4 rounded-lg transition-colors focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300"
  };

  const style = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyles} ${style} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}