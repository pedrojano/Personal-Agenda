import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ProductivityChart.css';

export function ProductivityChart({ metrics }) {
  if (!metrics) return null;

  const data = [
    { name: 'Concluídas', value: Number(metrics.completed_count), color: '#22c55e' },
    { name: 'Pendentes', value: Number(metrics.pending_count), color: '#eab308' },
    { name: 'Canceladas', value: Number(metrics.cancelled_count), color: '#ef4444' },
  ];

  const activeData = data.filter(item => item.value > 0);

  if (activeData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-empty">
          Nenhuma tarefa registrada para gerar gráfico.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Produtividade Visual</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}