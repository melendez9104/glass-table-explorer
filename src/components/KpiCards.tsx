import React from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Activity, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

const kpiData = [
  {
    title: 'Tabelas Ativas',
    value: '24',
    icon: Database,
    color: 'blue',
    trend: '+12%'
  },
  {
    title: 'Total de Registros',
    value: '1,428',
    icon: Users,
    color: 'green',
    trend: '+8%'
  },
  {
    title: 'Consultas Hoje',
    value: '156',
    icon: Activity,
    color: 'purple',
    trend: '+23%'
  },
  {
    title: 'Performance',
    value: '98.5%',
    icon: TrendingUp,
    color: 'orange',
    trend: '+2%'
  }
];

export const KpiCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`p-6 card-elevated hover:card-floating transition-all duration-300 kpi-card-${kpi.color}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white/80 text-sm font-medium mb-2">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {kpi.value}
                </p>
                <p className="text-white/70 text-sm">
                  {kpi.trend} este mês
                </p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};