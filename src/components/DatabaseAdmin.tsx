import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Plus, X, Database, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from './DataTable';
import { TableSelector } from './TableSelector';
import { TableTab } from './TableTab';
import { TableSkeleton } from './SkeletonLoader';
import { Sidebar } from './Sidebar';
import { KpiCards } from './KpiCards';
import { DashboardHeader } from './DashboardHeader';
import { getMockTables, getMockTableData } from '@/lib/supabase-mock';
import { toast } from 'sonner';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('home');

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const mockTables = await getMockTables();
      setTables(mockTables);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Erro ao carregar tabelas');
    } finally {
      setLoading(false);
    }
  };

  const openTable = async (tableName: string) => {
    try {
      // Switch to tables section when opening a table
      setCurrentSection('tables');
      
      const existingTable = openTables.find(t => t.name === tableName);
      if (existingTable) {
        setActiveTableId(existingTable.id);
        return;
      }

      const { data, columns } = await getMockTableData(tableName);

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

      toast.success(`${data?.length || 0} registros carregados de ${tableName}`);
    } catch (error) {
      console.error('Error opening table:', error);
      toast.error('Falha ao abrir tabela');
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

  const handleExport = () => {
    if (activeTable) {
      toast.success('Dados exportados com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onTableSelect={openTable}
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          {/* Dashboard Header */}
          <DashboardHeader 
            title={currentSection === 'home' ? 'Dashboard Principal' : 'Administração de Banco de Dados'}
            onExport={handleExport}
          />

          {/* KPI Cards - Only show in Home section */}
          {currentSection === 'home' && <KpiCards />}

          {/* Content Area */}
          {currentSection === 'home' ? (
            // Home Dashboard Content
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-320px)]">
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4">Visão Geral do Sistema</h3>
                <p className="text-muted-foreground mb-4">
                  Bem-vindo ao painel de administração do banco de dados. 
                  Aqui você pode visualizar métricas importantes e navegar pelas tabelas do sistema.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Total de Tabelas</span>
                    <span className="text-2xl font-bold text-primary">{tables.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Tabelas Abertas</span>
                    <span className="text-2xl font-bold text-primary">{openTables.length}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentSection('tables')} 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Ver Tabelas
                  </Button>
                  <Button 
                    onClick={() => setCurrentSection('reports')} 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button 
                    onClick={() => setCurrentSection('settings')} 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            // Tables Section Content
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-280px)]">
              {/* Table Selector */}
              <div className="lg:col-span-1">
                <Card className="h-full card-elevated">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Tabelas</CardTitle>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar tabelas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-100px)] overflow-hidden">
                    <TableSelector
                      tables={tables}
                      onSelectTable={openTable}
                      searchTerm={searchTerm}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Data Display Area */}
              <div className="lg:col-span-3 flex flex-col">
                {/* Table Tabs */}
                {openTables.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
                    <AnimatePresence>
                      {openTables.map((table) => (
                        <TableTab
                          key={table.id}
                          table={table}
                          isActive={table.id === activeTableId}
                          onClick={() => setActiveTable(table.id)}
                          onClose={() => closeTable(table.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Main Content */}
                <Card className="flex-1 card-elevated">
                  <CardContent className="p-6 h-full">
                    {activeTable ? (
                      <motion.div
                        key={activeTable.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">{activeTable.name}</h2>
                            <p className="text-muted-foreground">
                              {activeTable.data.length} registros • {activeTable.columns.length} colunas
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => closeTable(activeTable.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Fechar
                          </Button>
                        </div>
                        <div className="h-[calc(100%-100px)]">
                          <DataTable
                            data={activeTable.data}
                            columns={activeTable.columns}
                            tableName={activeTable.name}
                            onDataChange={(newData) => {
                              setOpenTables(prev => prev.map(t => 
                                t.id === activeTable.id 
                                  ? { ...t, data: newData }
                                  : t
                              ));
                            }}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center"
                        >
                          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                            <Plus className="w-12 h-12 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            Selecione uma tabela
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            Escolha uma tabela na barra lateral para visualizar e gerenciar seus dados.
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseAdmin;