import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Search,
  Download,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CSVLink } from 'react-csv';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-mock';

interface DataTableProps {
  tableName: string;
  data: any[];
  columns: string[];
  onDataChange: (newData: any[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  tableName,
  data,
  columns,
  onDataChange
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const columnHelper = createColumnHelper<any>();

  const tableColumns = useMemo<ColumnDef<any>[]>(() => {
    return columns.map((column) =>
      columnHelper.accessor(column, {
        header: ({ column }) => (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs uppercase tracking-wide">
              {column.id}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {column.getIsSorted() === 'asc' ? (
                <SortAsc className="h-3 w-3" />
              ) : column.getIsSorted() === 'desc' ? (
                <SortDesc className="h-3 w-3" />
              ) : (
                <Filter className="h-3 w-3 opacity-50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ getValue, row, column }) => {
          const value = getValue();
          const isEditing = editingCell?.row === row.index && editingCell?.column === column.id;

          if (isEditing) {
            return (
              <div className="flex items-center space-x-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(row.index, column.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="h-8 text-xs"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(row.index, column.id)}
                  className="h-6 w-6 p-0"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          }

          return (
            <div
              className="min-h-[32px] flex items-center cursor-pointer hover:bg-muted/50 px-2 py-1 rounded group"
              onClick={() => handleStartEdit(row.index, column.id, value)}
            >
              <span className="text-sm flex-1 min-w-0">
                {value !== null && value !== undefined ? String(value) : (
                  <span className="text-muted-foreground italic">null</span>
                )}
              </span>
              <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity ml-2" />
            </div>
          );
        },
      })
    );
  }, [columns, editingCell, editValue]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const handleStartEdit = (rowIndex: number, columnId: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, column: columnId });
    setEditValue(currentValue !== null && currentValue !== undefined ? String(currentValue) : '');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleSaveEdit = async (rowIndex: number, columnId: string) => {
    try {
      const row = data[rowIndex];
      const updatedRow = { ...row, [columnId]: editValue };

      // Update in Supabase
      const { error } = await supabase
        .from(tableName)
        .update({ [columnId]: editValue })
        .eq('id', row.id); // Assuming 'id' is the primary key

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a alteração.",
          variant: "destructive"
        });
        return;
      }

      // Update local data
      const newData = [...data];
      newData[rowIndex] = updatedRow;
      onDataChange(newData);

      setEditingCell(null);
      setEditValue('');

      toast({
        title: "Salvo com sucesso",
        description: "Alteração salva no banco de dados.",
      });
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar alteração.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRow = async (rowIndex: number) => {
    try {
      const row = data[rowIndex];
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', row.id);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro.",
          variant: "destructive"
        });
        return;
      }

      const newData = data.filter((_, index) => index !== rowIndex);
      onDataChange(newData);

      toast({
        title: "Excluído com sucesso",
        description: "Registro removido do banco de dados.",
      });
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir registro.",
        variant: "destructive"
      });
    }
  };

  const csvData = data.map(row => {
    const csvRow: any = {};
    columns.forEach(col => {
      csvRow[col] = row[col];
    });
    return csvRow;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 h-full flex flex-col"
    >
      {/* Header */}
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold">{tableName}</h2>
              <p className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} de {data.length} registros
              </p>
            </div>
            
            <Badge variant="secondary" className="px-3 py-1">
              {columns.length} colunas
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar em todos os campos..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
                className="pl-10 w-64"
              />
            </div>
            
            <CSVLink
              data={csvData}
              filename={`${tableName}_export.csv`}
              className="inline-flex"
            >
              <Button variant="glass">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </CSVLink>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo registro
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="flex-1 glass-card overflow-hidden">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border/50">
                  <TableHead className="w-12">#</TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-xs text-muted-foreground">
                      {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + index + 1}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem
                            onClick={() => handleDeleteRow(index)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};