import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Table2, Search, Plus, Download, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { TableSelector } from './TableSelector';
import { DataTable } from './DataTable';
import { TableTab } from './TableTab';
import { SidebarSkeleton, TableSkeleton } from './SkeletonLoader';
import { supabase } from '@/lib/supabase-mock';
import { useToast } from '@/hooks/use-toast';

export interface TableInfo {
  table_name: string;
  column_count?: number;
  row_count?: number;
}

export interface OpenTable {
  id: string;
  name: string;
  data: any[];
  columns: string[];
  isActive: boolean;
}

const DatabaseAdmin: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [openTables, setOpenTables] = useState<OpenTable[]>([]);
  const [activeTableId, setActiveTableId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      
      // Get all tables using RPC function
      const { data: pgData, error: pgError } = await supabase.rpc('get_public_tables');
      
      if (pgError) {
        toast({
          title: "Erro ao carregar tabelas",
          description: "Não foi possível conectar ao banco de dados. Verifique as configurações.",
          variant: "destructive"
        });
        return;
      }
      
      setTables(pgData || []);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast({
        title: "Erro de conexão",
        description: "Falha na conexão com o banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openTable = async (tableName: string) => {
    try {
      // Check if table is already open
      const existingTable = openTables.find(t => t.name === tableName);
      if (existingTable) {
        setActiveTableId(existingTable.id);
        return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1000);

      if (error) {
        toast({
          title: "Erro ao carregar dados",
          description: `Não foi possível carregar dados da tabela ${tableName}`,
          variant: "destructive"
        });
        return;
      }

      const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
      const newTable: OpenTable = {
        id: `table-${Date.now()}-${Math.random()}`,
        name: tableName,
        data: data || [],
        columns,
        isActive: true
      };

      setOpenTables(prev => {
        const updated = prev.map(t => ({ ...t, isActive: false }));
        return [...updated, newTable];
      });
      setActiveTableId(newTable.id);

      toast({
        title: "Tabela carregada",
        description: `${data?.length || 0} registros carregados de ${tableName}`,
      });
    } catch (error) {
      console.error('Error opening table:', error);
      toast({
        title: "Erro",
        description: "Falha ao abrir tabela",
        variant: "destructive"
      });
    }
  };

  const closeTable = (tableId: string) => {
    setOpenTables(prev => {
      const updated = prev.filter(t => t.id !== tableId);
      
      // If closing active table, activate another one
      if (tableId === activeTableId && updated.length > 0) {
        const newActive = updated[updated.length - 1];
        newActive.isActive = true;
        setActiveTableId(newActive.id);
      } else if (updated.length === 0) {
        setActiveTableId('');
      }
      
      return updated;
    });
  };

  const setActiveTable = (tableId: string) => {
    setOpenTables(prev => prev.map(t => ({
      ...t,
      isActive: t.id === tableId
    })));
    setActiveTableId(tableId);
  };

  const activeTable = openTables.find(t => t.id === activeTableId);
  const filteredTables = tables.filter(table => 
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold">Conectando ao banco de dados...</h2>
          <p className="text-muted-foreground">Carregando estrutura das tabelas</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b sticky top-0 z-50 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Admin Database</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciamento avançado de banco de dados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tabelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 glass"
              />
            </div>
            <Button variant="glass" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-80 glass-surface border-r p-4 overflow-y-auto"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                Tabelas ({filteredTables.length})
              </h3>
              <Button size="sm" variant="glass">
                <Plus className="h-4 w-4 mr-2" />
                Nova
              </Button>
            </div>
            
            <TableSelector
              tables={filteredTables}
              onSelectTable={openTable}
              searchTerm={searchTerm}
            />
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {openTables.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card border-b px-4 py-2 flex items-center space-x-2 overflow-x-auto"
            >
              {openTables.map((table) => (
                <TableTab
                  key={table.id}
                  table={table}
                  isActive={table.id === activeTableId}
                  onClick={() => setActiveTable(table.id)}
                  onClose={() => closeTable(table.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Table Content */}
          <div className="flex-1 p-6">
            <AnimatePresence mode="wait">
              {activeTable ? (
                <motion.div
                  key={activeTable.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full"
                >
                  <DataTable
                    tableName={activeTable.name}
                    data={activeTable.data}
                    columns={activeTable.columns}
                    onDataChange={(newData) => {
                      setOpenTables(prev => prev.map(t => 
                        t.id === activeTable.id 
                          ? { ...t, data: newData }
                          : t
                      ));
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <Card className="p-12 text-center glass-card max-w-md">
                    <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Nenhuma tabela selecionada
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Selecione uma tabela na barra lateral para começar a visualizar e editar os dados.
                    </p>
                    <Button 
                      onClick={() => filteredTables.length > 0 && openTable(filteredTables[0].table_name)}
                      disabled={filteredTables.length === 0}
                    >
                      <Table2 className="h-4 w-4 mr-2" />
                      Abrir primeira tabela
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseAdmin;