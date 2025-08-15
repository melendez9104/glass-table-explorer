import React from 'react';
import { motion } from 'framer-motion';
import { X, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OpenTable } from './DatabaseAdmin';
import { cn } from '@/lib/utils';

interface TableTabProps {
  table: OpenTable;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

export const TableTab: React.FC<TableTabProps> = ({
  table,
  isActive,
  onClick,
  onClose
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer group transition-all duration-200",
        isActive 
          ? "bg-primary/10 border border-primary/30 text-primary" 
          : "bg-muted/50 hover:bg-muted/80 border border-transparent"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Table2 className={cn(
        "h-4 w-4 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      
      <span className={cn(
        "text-sm font-medium max-w-[120px] truncate",
        isActive ? "text-primary" : "text-foreground"
      )}>
        {table.name}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20",
          isActive && "opacity-100"
        )}
        onClick={handleClose}
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
};