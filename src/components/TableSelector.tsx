import React from 'react';
import { motion } from 'framer-motion';
import { Table2, ChevronRight, Database, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TableInfo } from './DatabaseAdmin';

interface TableSelectorProps {
  tables: TableInfo[];
  onSelectTable: (tableName: string) => void;
  searchTerm: string;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  tables,
  onSelectTable,
  searchTerm
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (tables.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma tabela encontrada</h3>
        <p className="text-sm text-muted-foreground">
          {searchTerm 
            ? `Nenhuma tabela corresponde a "${searchTerm}"`
            : "Não há tabelas disponíveis no banco de dados"
          }
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {tables.map((table, index) => (
        <motion.div
          key={table.table_name}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="p-4 cursor-pointer glass hover-glow transition-all duration-300 group border-border/50 hover:border-primary/50"
            onClick={() => onSelectTable(table.table_name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Table2 className="h-4 w-4 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {table.table_name}
                  </h4>
                  {table.row_count !== undefined && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {table.row_count} registros
                      </Badge>
                      {table.column_count && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {table.column_count} colunas
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <motion.div
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ x: 2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};