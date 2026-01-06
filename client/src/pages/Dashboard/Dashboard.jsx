import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';
import api from '../../services/api'; 
import AppLayout from '../../layouts/AppLayout';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { ProductivityChart } from '../../components/ui/ProductivityChart/ProductivityChart';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    api.get('/tasks/dashboard').then(res => setMetrics(res.data.data)).catch(console.error);
  }, []);

  if (!metrics) return <AppLayout>Carregando...</AppLayout>;

  return (
    <AppLayout>
      <h1 style={{marginBottom: 20}}>Dashboard</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20}}>
        <StatCard title="Total" value={metrics.total_tasks} icon={Calendar} colorClass="blue" />
        <StatCard title="Concluídas" value={metrics.completed_count} icon={CheckCircle} colorClass="green" />
        <StatCard title="Pendentes" value={metrics.pending_count} icon={Clock} colorClass="yellow" />
        <StatCard title="Canceladas" value={metrics.cancelled_count} icon={XCircle} colorClass="red" />
      </div>
      <ProductivityChart metrics={metrics} />
    </AppLayout>
  );
}