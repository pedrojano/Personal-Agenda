import React from "react";
import "../ui.css";

export function StatCard({ title, value, icon: Icon, colorClass }) {
  const colors = {
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    red: "#ef4444",
  };
  const bg = colors[colorClass] || colorClass;

  return (
    <div className="card" style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          background: bg,
          padding: 12,
          borderRadius: "50%",
          color: "white",
          marginRight: 15,
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>{title}</p>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</h3>
      </div>
    </div>
  );
}
