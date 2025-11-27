import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import api from "../services/api";

import AppLayout from "../layouts/AppLayout";
import { Card } from "../components/ui/Card";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await api.get("/tasks/dashboard");
        setMetrics(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar métricas", error);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="text-gray-500">Visão geral da sua produtividade.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10 text-gray-500">
          Carregando dados...
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Total de Tarefas"
            value={metrics.total_tasks}
            icon={Calendar}
            colorClass="bg-blue-500"
          />

          <Card
            title="Concluídas"
            value={metrics.completed_count}
            icon={CheckCircle}
            colorClass="bg-green-500"
          />

          <Card
            title="Pendentes"
            value={metrics.pending_count}
            icon={Clock}
            colorClass="bg-yellow-500"
          />

          <Card
            title="Canceladas"
            value={metrics.cancelled_count}
            icon={XCircle}
            colorClass="bg-red-500"
          />
        </div>
      ) : (
        <p className="text-red-500">Falha ao carregar dados do servidor.</p>
      )}

      {/* Placeholder para o Gráfico (Próxima aula) */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Desempenho Visual
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300 text-gray-400">
          O Gráfico de Pizza entrará aqui
        </div>
      </div>
    </AppLayout>
  );
}
