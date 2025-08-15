// Mock Supabase client for development when not connected to Supabase
const createMockData = (tableName: string) => {
  const baseData = {
    usuarios: [
      { id: 1, nome: 'João Silva', email: 'joao@example.com', idade: 30, ativo: true },
      { id: 2, nome: 'Maria Santos', email: 'maria@example.com', idade: 28, ativo: true },
      { id: 3, nome: 'Pedro Costa', email: 'pedro@example.com', idade: 35, ativo: false },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@example.com', idade: 25, ativo: true },
      { id: 5, nome: 'Carlos Lima', email: 'carlos@example.com', idade: 40, ativo: true }
    ],
    produtos: [
      { id: 1, nome: 'Laptop Dell', preco: 2500.00, categoria: 'Eletrônicos', estoque: 15 },
      { id: 2, nome: 'Mouse Logitech', preco: 45.90, categoria: 'Acessórios', estoque: 50 },
      { id: 3, nome: 'Teclado Mecânico', preco: 120.00, categoria: 'Acessórios', estoque: 30 },
      { id: 4, nome: 'Monitor 24"', preco: 800.00, categoria: 'Eletrônicos', estoque: 12 },
      { id: 5, nome: 'Webcam HD', preco: 150.00, categoria: 'Eletrônicos', estoque: 25 }
    ],
    pedidos: [
      { id: 1, usuario_id: 1, produto_id: 1, quantidade: 1, data_pedido: '2024-01-15', status: 'Entregue' },
      { id: 2, usuario_id: 2, produto_id: 2, quantidade: 2, data_pedido: '2024-01-16', status: 'Processando' },
      { id: 3, usuario_id: 3, produto_id: 3, quantidade: 1, data_pedido: '2024-01-17', status: 'Cancelado' },
      { id: 4, usuario_id: 1, produto_id: 4, quantidade: 1, data_pedido: '2024-01-18', status: 'Entregue' }
    ],
    categorias: [
      { id: 1, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos em geral' },
      { id: 2, nome: 'Acessórios', descricao: 'Acessórios para computador' },
      { id: 3, nome: 'Móveis', descricao: 'Móveis para escritório' },
      { id: 4, nome: 'Livros', descricao: 'Livros técnicos e educacionais' }
    ]
  };
  
  return baseData[tableName as keyof typeof baseData] || [];
};

export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      const chainable = {
        eq: (column: string, value: any) => ({
          limit: (count: number) => Promise.resolve({
            data: createMockData(table).slice(0, count),
            error: null
          }),
          eq: (column2: string, value2: any) => Promise.resolve({
            data: createMockData(table),
            error: null
          })
        }),
        limit: (count: number) => Promise.resolve({
          data: createMockData(table).slice(0, count),
          error: null
        })
      };
      
      // Also return data directly if no chaining
      return Object.assign(chainable, Promise.resolve({
        data: createMockData(table),
        error: null
      }));
    },
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({
        data: null,
        error: null
      })
    }),
    insert: (data: any) => Promise.resolve({
      data: null,
      error: null
    })
  }),
  rpc: (functionName: string, params?: any) => {
    if (functionName === 'get_public_tables') {
      return Promise.resolve({
        data: [
          { table_name: 'usuarios' },
          { table_name: 'produtos' },
          { table_name: 'pedidos' },
          { table_name: 'categorias' }
        ],
        error: null
      });
    }
    return Promise.resolve({ data: null, error: null });
  }
};

// Export as default for easy import
export const supabase = mockSupabase;