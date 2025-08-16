import React from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  title: string;
  onExport?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  onExport 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize seus dados de forma eficiente
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-64 bg-white shadow-sm border-border"
          />
        </div>

        {/* Export Button */}
        {onExport && (
          <Button
            onClick={onExport}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        )}

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
        </Button>

        {/* User Profile */}
        <Button variant="outline" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline">Admin</span>
        </Button>
      </div>
    </motion.div>
  );
};