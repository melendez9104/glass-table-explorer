import React from 'react';
import { motion } from 'framer-motion';
import { Home, Database, BarChart3, Settings, HelpCircle, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Home', active: false },
  { icon: Database, label: 'Tabelas', active: true },
  { icon: BarChart3, label: 'Relatórios', active: false },
  { icon: Settings, label: 'Configurações', active: false },
  { icon: HelpCircle, label: 'Suporte', active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-primary flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="p-6 border-b border-primary-light/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-white">DataAdmin</h1>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-white hover:bg-primary-light/20 w-8 h-8"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-12 text-white/80 hover:text-white hover:bg-primary-light/20 transition-all duration-200",
                item.active && "bg-primary-light/30 text-white font-medium",
                isCollapsed && "px-3 justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Button>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-light/20">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12 text-white/80 hover:text-white hover:bg-primary-light/20",
            isCollapsed && "px-3 justify-center"
          )}
        >
          <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sair
            </motion.span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};