# Database Admin Pro

Sistema avançado de administração de banco de dados com interface moderna em glassmorphism, inspirado no Windows 11.

## 🚀 Características

- **Interface Moderna**: Design glassmorphism com efeitos de vidro fosco e transparência
- **Paleta de Cores**: Roxo (#7A00FF) e preto (#0D0D0D) com tons transparentes
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Tabela Interativa**: Visualização estilo Google Sheets com edição em tempo real
- **Funcionalidades Avançadas**:
  - Ordenação de colunas
  - Filtros e busca global
  - Paginação inteligente
  - Exportação para CSV
  - Edição inline de células
  - Múltiplas tabelas em abas
  - Menu de contexto para ações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Estilização**: TailwindCSS com configuração personalizada de glassmorphism
- **Animações**: Framer Motion
- **Tabela**: TanStack React Table (substituto do AG-Grid/Handsontable)
- **Backend**: Supabase (integração nativa do Lovable)
- **Exportação**: React CSV
- **UI Components**: Shadcn/ui customizados

## 🎨 Design System

### Cores Principais
```css
--primary: 260 100% 50%;        /* Roxo principal #7A00FF */
--background: 220 13% 8%;       /* Preto de fundo #0D0D0D */
--glass-primary: 260 60% 15%;   /* Vidro roxo */
--glass-secondary: 220 13% 10%; /* Vidro escuro */
```

### Efeitos Glassmorphism
- `glass`: Efeito básico de vidro com blur e transparência
- `glass-card`: Cartões com efeito de vidro
- `glass-surface`: Superfícies principais com blur intenso

### Animações
- **smooth-enter**: Entrada suave com escala e fade
- **fade-in**: Aparecer gradual
- **hover-glow**: Brilho no hover
- **primary-glow**: Brilho com cor primária

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DatabaseAdmin.tsx     # Componente principal
│   ├── TableSelector.tsx     # Seletor de tabelas lateral
│   ├── TableTab.tsx         # Abas das tabelas abertas
│   ├── DataTable.tsx        # Tabela de dados interativa
│   └── ui/                  # Componentes UI personalizados
├── lib/
│   ├── utils.ts            # Utilitários
│   └── supabase-mock.ts    # Mock do Supabase para desenvolvimento
├── pages/
│   └── Index.tsx           # Página principal
└── index.css              # Design system com glassmorphism
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd database-admin-pro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Arquivo .env (será criado automaticamente pelo Lovable/Supabase)
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
VITE_SUPABASE_PROJECT_ID=seu_project_id
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:8080
```

## 🐳 Deploy com Docker + EasyPanel

### 1. Dockerfile (já incluído)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Deploy no EasyPanel

1. **Acesse seu painel EasyPanel**
2. **Crie um novo projeto**
3. **Conecte ao repositório Git**
4. **Configure as variáveis de ambiente**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` 
   - `VITE_SUPABASE_PROJECT_ID`
5. **Configure o build**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Deploy automático**

### 3. Configuração de VPS Manual

```bash
# 1. Atualize o sistema
sudo apt update && sudo apt upgrade -y

# 2. Instale Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone e execute
git clone <SEU_REPOSITORIO>
cd database-admin-pro

# 4. Execute com Docker
docker build -t database-admin .
docker run -d -p 80:80 \
  -e VITE_SUPABASE_URL=sua_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave \
  database-admin
```

## 🔧 Configuração do Banco de Dados

### Supabase (Recomendado)
1. O Lovable já fornece integração nativa
2. As credenciais são configuradas automaticamente
3. Use as edge functions para operações customizadas

### PostgreSQL Personalizado
Para conectar a um PostgreSQL próprio, configure as variáveis:
```env
DATABASE_URL=postgresql://usuario:senha@host:5432/database
```

## 🎯 Funcionalidades Principais

### 1. Seleção de Tabelas
- Listagem automática de todas as tabelas do banco
- Busca em tempo real
- Informações de colunas e registros
- Interface visual com cards glassmorphism

### 2. Visualização de Dados
- Tabela interativa com ordenação
- Filtros por coluna
- Busca global em todos os campos
- Paginação com controles avançados
- Exportação para CSV

### 3. Edição de Dados
- Edição inline de células (clique para editar)
- Salvamento automático no banco
- Validação de dados
- Feedback visual de sucesso/erro
- Suporte para valores nulos

### 4. Gestão de Múltiplas Tabelas
- Sistema de abas para múltiplas tabelas
- Troca rápida entre tabelas
- Manutenção do estado de cada tabela
- Fechamento individual de abas

### 5. Interface Responsiva
- Layout adaptável a diferentes telas
- Sidebar colapsável
- Scroll horizontal em tabelas grandes
- Touch-friendly para dispositivos móveis

## 🎨 Personalização

### Alterar Cores
Edite o arquivo `src/index.css`:
```css
:root {
  --primary: 260 100% 50%;    /* Sua cor primária */
  --background: 220 13% 8%;   /* Cor de fundo */
  /* ... outras variáveis */
}
```

### Adicionar Animações
Edite `tailwind.config.ts`:
```typescript
keyframes: {
  'nova-animacao': {
    '0%': { /* estado inicial */ },
    '100%': { /* estado final */ }
  }
}
```

### Customizar Componentes UI
Os componentes em `src/components/ui/` são totalmente customizáveis.

## 🔒 Segurança

- ✅ Variáveis de ambiente protegidas
- ✅ Validação de entrada de dados
- ✅ Sanitização de queries SQL
- ✅ HTTPS obrigatório em produção
- ✅ Autenticação via Supabase RLS

## 📱 Responsividade

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px+)

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
1. Verifique as variáveis de ambiente
2. Confirme se o Supabase está configurado
3. Verifique as regras RLS (Row Level Security)

### Tabelas Não Aparecem
1. Verifique se existem tabelas na schema `public`
2. Confirme as permissões de leitura
3. Verifique o console do navegador para erros

### Performance Lenta
1. Limite os resultados por página (padrão: 50)
2. Use índices apropriados no banco
3. Configure cache no Supabase

## 📧 Suporte

Para dúvidas ou suporte técnico:
- GitHub Issues: [Criar issue](link-do-repositorio/issues)
- Documentação: [Wiki](link-do-repositorio/wiki)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Database Admin Pro** - Sistema de administração de banco de dados moderno e elegante.