import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export function AuthLayout({ children, brandingTitle, brandingSubtitle }) {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      
      <div className="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 -top-20 -left-20"></div>
        
        <div className="z-10 text-center text-white px-10">
          <LayoutDashboard size={80} className="mb-6 mx-auto opacity-90" />
          <h1 className="text-4xl font-bold mb-4">{brandingTitle}</h1>
          <p className="text-blue-100 text-lg max-w-md mx-auto">
            {brandingSubtitle}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}