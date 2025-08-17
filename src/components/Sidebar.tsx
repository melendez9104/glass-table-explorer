import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Database, BarChart3, Settings, HelpCircle, LogOut, Menu, ChevronDown, ChevronRight, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getMockTables } from '@/lib/supabase-mock';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onTableSelect?: (tableName: string) => void;
  onSectionChange?: (section: string) => void;
  currentSection?: string;
}

const menuItems = [
  { icon: Home, label: 'Home', active: false, id: 'home' },
  { icon: Database, label: 'Tabelas', active: false, id: 'tables', hasSubmenu: true },
  { icon: BarChart3, label: 'Relatórios', active: false, id: 'reports' },
  { icon: Settings, label: 'Configurações', active: false, id: 'settings' },
  { icon: HelpCircle, label: 'Suporte', active: false, id: 'support' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  onTableSelect, 
  onSectionChange, 
  currentSection = 'home' 
}) => {
  const [tablesSubmenuOpen, setTablesSubmenuOpen] = useState(true);
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tablesList = await getMockTables();
        setTables(tablesList);
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };
    
    loadTables();
  }, []);
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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Main Menu Item */}
            <Button
              variant="ghost"
              onClick={() => {
                if (item.id === 'tables' && !isCollapsed) {
                  setTablesSubmenuOpen(!tablesSubmenuOpen);
                } else {
                  onSectionChange?.(item.id);
                }
              }}
              className={cn(
                "w-full justify-start h-12 text-white/80 hover:text-white hover:bg-primary-light/20 transition-all duration-200",
                currentSection === item.id && "bg-primary-light/30 text-white font-medium",
                isCollapsed && "px-3 justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                  {item.hasSubmenu && (
                    <motion.div
                      animate={{ rotate: tablesSubmenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </>
              )}
            </Button>

            {/* Submenu for Tables */}
            {item.id === 'tables' && !isCollapsed && (
              <AnimatePresence>
                {tablesSubmenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8 mt-2 space-y-1 overflow-hidden"
                  >
                    {tables.map((table, tableIndex) => (
                      <motion.div
                        key={table.table_name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: tableIndex * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => onTableSelect?.(table.table_name)}
                          className="w-full justify-start h-10 text-white/60 hover:text-white hover:bg-primary-light/15 transition-all duration-200 text-sm"
                        >
                          <Table2 className="w-4 h-4 mr-2" />
                          <span className="truncate">{table.table_name}</span>
                          <span className="ml-auto text-xs text-white/40">
                            {table.row_count}
                          </span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
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