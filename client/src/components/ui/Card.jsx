import React from "react";

export function Card({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${colorClass} text-white mr-4`}>
        {Icon && <Icon size={24} />}
      </div>

      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
