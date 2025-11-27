import React from 'react';
import { Link } from 'react-router-dom';

export function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

export function AuthDivider({ text = "Ou" }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-gray-50 text-gray-500">{text}</span>
      </div>
    </div>
  );
}

export function AuthFooter({ text, linkText, linkTo }) {
  return (
    <p className="mt-8 text-center text-sm text-gray-600">
      {text}{' '}
      <Link to={linkTo} className="font-bold text-blue-600 hover:text-blue-500">
        {linkText}
      </Link>
    </p>
  );
}