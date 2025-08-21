# 🏥 Sistema Instituto Barros - Frontend

> Sistema de gestão clínica e administrativa para o Instituto Barros, desenvolvido com tecnologias modernas para oferecer uma experiência completa na gestão de pacientes, funcionários, agendamentos e tratamentos.

## 🚀 Tecnologias Embarcadas

### **Tecnologias Embarcadas**

### **Core Framework**
- **React 18.3.1** - Biblioteca principal para construção da interface
- **TypeSc## 🔧 Tecnologias e Integrações

### **📦 Dependências Principais**
```json
{
  "react": "^18.3.1",
  "typescript": "~5.7.2",
  "vite": "^6.1.0",
  "tailwindcss": "^4.0.8",
  "@tanstack/react-query": "^4.39.2",
  "react-router": "^7.1.5",
  "axios": "^1.8.4",
  "apexcharts": "^4.1.0",
  "@fullcalendar/react": "^6.1.15",
  "react-hot-toast": "^2.5.2",
  "jwt-decode": "^4.0.0"
}
```

### **🔌 API Integration**
- **Base URL**: Configuração dinâmica via environment
- **Autenticação**: JWT Bearer Token
- **Interceptadores**: Tratamento automático de erros e renovação de token
- **TypeScript**: DTOs tipados para todas as requisições
- **React Query**: Cache inteligente e sincronização de estado

### **📊 Principais Endpoints (Resumo)**
```typescript
// Dashboard Analytics
GET /api/Dashboard/faturamento
GET /api/Dashboard/despesas  
GET /api/Dashboard/entrada-saida
GET /api/Dashboard/faturamento-mensal
GET /api/Dashboard/faturamento-comparativo
GET /api/Dashboard/faturamento-por-categoria-servico

// Gestão de Entidades
GET|POST|PUT /api/Customer/*
GET|POST|PUT /api/Employee/*
GET|POST|PUT /api/ServiceCategory/*
GET|POST|PUT /api/BranchOffice/*

// Sistema Financeiro
GET|POST|PUT /api/FinancialTransaction/*
GET|POST|PUT /api/Despesa/*

// Notificações
GET|POST|PUT|DELETE /api/Notification/*

// Agendamento
GET|POST|PUT|DELETE /api/Schedule/*
```

### **🔒 Segurança e Validações**
- **Role-Based Access Control**: Controle granular por perfil
- **JWT Validation**: Validação automática de tokens
- **Route Protection**: Rotas protegidas por autenticação
- **Input Validation**: Validação client-side e server-side
- **Error Boundaries**: Tratamento robusto de erros
- **XSS Protection**: Sanitização de inputs

## 🚀 Performance e Otimizações

### **⚡ Otimizações Implementadas**
- **Code Splitting**: Carregamento sob demanda de componentes
- **React Query**: Cache inteligente de dados da API
- **Lazy Loading**: Carregamento assíncrono de componentes pesados
- **Memoization**: Otimização de re-renders com useMemo/useCallback
- **Bundle Optimization**: Tree shaking e minificação automática
- **Image Optimization**: Compressão e lazy loading de imagens

### **📱 Responsividade**
- **Mobile First**: Design responsivo desde a concepção
- **Breakpoints Tailwind**: Sistema consistente de responsividade
- **Touch Friendly**: Interações otimizadas para dispositivos móveis
- **PWA Ready**: Preparado para Progressive Web App

## 🛡️ Boas Práticas de Segurança

### **🔐 Implementadas no Frontend**
- ✅ **Sanitização de Inputs**: Prevenção de XSS
- ✅ **Validação de Dados**: Client-side e server-side
- ✅ **Controle de Acesso**: RBAC granular
- ✅ **Proteção de Rotas**: Autenticação obrigatória
- ✅ **Token Management**: Renovação automática de JWT
- ✅ **Error Handling**: Tratamento seguro de erros

### **⚠️ Informações Sensíveis Protegidas**
- Dados financeiros específicos (valores exatos não expostos)
- Informações pessoais de pacientes (LGPD compliance)
- Credenciais de API (environment variables)
- Chaves de integração (ocultas do código)
- URLs de produção (configuração por ambiente)ipt** - Tipagem estática para maior segurança e produtividade
- **Vite 6.1.0** - Build tool moderna para desenvolvimento rápido

### **Roteamento e Estado**
- **React Router 7.1.5** - Gerenciamento de rotas SPA
- **TanStack React Query 4.39.2** - Cache e sincronização de estado server-side
- **Context API** - Gerenciamento de estado global (Theme, Sidebar)

### **Interface e Estilização**
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **Tailwind Forms** - Componentes de formulário estilizados
- **React Hot Toast 2.5.2** - Sistema de notificações elegante
- **ApexCharts 4.1.0** - Biblioteca de gráficos interativos
- **React ApexCharts 1.7.0** - Wrapper React para ApexCharts

### **Componentes e UI**
- **FullCalendar 6.1.15** - Sistema completo de calendário e agendamento
- **React Input Mask 2.0.4** - Máscaras para campos de entrada
- **React Number Format 5.4.4** - Formatação numérica avançada
- **React Color 2.19.3** - Seletor de cores
- **React Dropzone 14.3.5** - Upload de arquivos drag-and-drop
- **Swiper 11.2.3** - Carrossel e sliders responsivos
- **React DnD 16.0.1** - Sistema de drag and drop

### **Autenticação e Segurança**
- **JWT Decode 4.0.0** - Decodificação de tokens JWT
- **Axios 1.8.4** - Cliente HTTP com interceptadores
- **Protected Routes** - Rotas protegidas por autenticação e roles

### **Utilitários**
- **React Helmet Async 2.0.5** - Gerenciamento de meta tags
- **Flatpickr 4.6.13** - Date picker avançado
- **React Flatpickr 3.10.13** - Wrapper React para Flatpickr
- **Simplebar React 3.3.0** - Scrollbars customizadas
- **ClassNames/CLSX** - Manipulação condicional de classes CSS
- **Tailwind Merge 3.0.1** - Utilitário para merge de classes Tailwind

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── charts/         # Gráficos e visualizações
│   ├── common/         # Componentes comuns (Header, Breadcrumb)
│   ├── ecommerce/      # Componentes de dashboard e métricas
│   ├── form/           # Componentes de formulário (Input, Select, MultiSelect)
│   ├── header/         # Cabeçalho e navegação
│   ├── tables/         # Tabelas e grids de dados (DespesasGrid, etc.)
│   ├── ui/             # Componentes básicos de UI (Button, Badge, Alert)
│   ├── UserProfile/    # Componentes de perfil
│   └── whatsapp/       # Componentes do sistema WhatsApp
├── context/            # Contextos React (Theme, Sidebar)
├── hooks/              # Hooks customizados (30+ hooks especializados)
│   ├── useFinancial*   # Hooks financeiros (Stats, Transactions)
│   ├── useFaturamento* # Hooks de faturamento (Mensal, Comparativo)
│   ├── useDashboard*   # Hooks de dashboard (Operação, Lead)
│   ├── useNotifications# Hook de notificações
│   └── useModal        # Hook para modais
├── icons/              # Ícones SVG do sistema (40+ ícones)
├── layout/             # Layouts da aplicação (AppLayout, Sidebar, Header)
├── pages/              # Páginas da aplicação
│   ├── AuthPages/      # Login e registro
│   ├── Charts/         # Páginas de gráficos
│   ├── Dashboard/      # Dashboard com múltiplas visões (Financeiro, Operação, Lead)
│   ├── Forms/          # Formulários de cadastro (Serviços, Categorias)
│   ├── Tables/         # Páginas de tabelas (Pacientes, Funcionários, etc.)
│   ├── Financeiro/     # Sistema financeiro (Despesas, Transações)
│   ├── Notificacoes/   # Sistema de notificações
│   └── UiElements/     # Elementos de interface
├── services/           # Camada de serviços
│   ├── model/          # DTOs e interfaces (40+ tipos)
│   ├── service/        # Serviços de API (15+ serviços)
│   └── util/           # Utilitários (JWT, formatação, permissões)
└── ProtectedRoute.tsx  # Componente de proteção de rotas
```

### **Padrões Arquiteturais**
- **Separation of Concerns** - Separação clara entre UI, lógica e dados
- **Component-Based** - Arquitetura baseada em componentes reutilizáveis
- **Service Layer** - Camada de serviços para comunicação com API
- **DTO Pattern** - Data Transfer Objects para tipagem de dados
- **Hook Pattern** - Hooks customizados para lógica reutilizável
- **Role-Based Access Control (RBAC)** - Controle de acesso baseado em roles
- **Protected Routes** - Rotas protegidas com validação JWT
- **Responsive Design** - Design totalmente responsivo com Tailwind CSS

## 🔐 Sistema de Controle de Acesso

### **Roles e Permissões**
O sistema implementa um controle granular de acesso baseado em roles:

#### **👨‍⚕️ Fisioterapeuta**
- ✅ Dashboard Operação
- ✅ Agenda (visualização e check-in)
- ✅ Pacientes (apenas visualização e check-in)
- ✅ Funcionários (visualização)
- ❌ Dashboards Financeiro e Lead
- ❌ Funcionalidades administrativas

#### **👨‍💼 Comercial**  
- ✅ WhatsApp e atendimento
- ✅ Agenda completa
- ✅ Gestão de serviços e subcategorias
- ✅ Funcionários
- ✅ Todos os dashboards
- ❌ Gestão financeira
- ❌ Notificações

#### **👥 Administrativo**
- ✅ Gestão de pacientes
- ✅ Gestão de funcionários
- ✅ Unidades e serviços
- ✅ Dashboards (Financeiro, Lead)
- ✅ Sistema financeiro (visualização)
- ❌ Dashboard Operação
- ❌ Notificações

#### **🔧 Funcionário**
- ✅ Funcionalidades básicas
- ✅ Agenda (visualização)
- ✅ Dashboards (Financeiro, Lead)
- ❌ Gestão administrativa
- ❌ Sistema financeiro

#### **👑 Administrador**
- ✅ **Acesso total ao sistema**
- ✅ Todas as funcionalidades
- ✅ Gestão financeira completa
- ✅ Sistema de notificações
- ✅ Configurações avançadas

### **Implementação de Segurança**
```typescript
// Validação JWT com roles
const token = localStorage.getItem('token');
const userRole = getUserRoleFromToken(token);

// Controle de menu baseado em permissões
const hasPermission = hasPermissionForMenu(userRole, MENU_PERMISSIONS.FINANCEIRO);

// Proteção de rotas
<ProtectedRoute allowedRoles={['Administrador', 'Administrativo']}>
  <FinanceiroPage />
</ProtectedRoute>
```

## 📋 Sistema de Gestão Completo

O Sistema Instituto Barros é uma solução completa para gestão clínica que inclui:

### **👥 Gestão de Pacientes**
- **Cadastro Completo**: Dados pessoais, médicos, histórico e documentos
- **Sistema de Filtros**: Busca avançada por nome, CPF, email, telefone, status
- **Controle de Status**: Fluxo completo (Novo → Em Tratamento → Alta/Cancelado)
- **Histórico Detalhado**: Registro completo de atendimentos e sessões
- **Upload em Massa**: Importação via Excel para cadastros em lote
- **Check-in de Sessões**: Sistema de presença para fisioterapeutas

### **🏢 Gestão de Funcionários**
- **Cadastro Profissional**: Dados, especialidades e credenciais
- **Controle de Credenciais**: Crefito, certificações e documentos
- **Sistema de Cores**: Identificação visual no calendário por profissional
- **Configuração de Acesso**: Gestão de usuários e permissões do sistema
- **Gestão de Filiais**: Controle de unidades e departamentos
- **Escalas e Horários**: Configuração de disponibilidade

### **📅 Sistema de Agendamento Avançado**
- **Calendário Completo**: Visualizações (mês, semana, dia, lista)
- **Agendamento Inteligente**: Consultas, sessões e bloqueios
- **Controle de Participantes**: Paciente, profissional e unidade
- **Notificações Automáticas**: Lembretes via sistema e email
- **Gestão de Conflitos**: Prevenção de sobreposição de horários
- **Reagendamento**: Sistema flexível de remarcação

### **🔧 Gestão de Serviços e Tratamentos**
- **Categorias Hierárquicas**: Serviços organizados por categoria/subcategoria
- **Ordens de Serviço**: Gestão completa de tratamentos
- **Controle de Sessões**: Acompanhamento de sessões de fisioterapia
- **Acompanhamento de Progresso**: Relatórios de evolução do paciente
- **Precificação Inteligente**: Sistema de preços por serviço
- **Pacotes de Tratamento**: Criação de planos personalizados

### **💰 Sistema Financeiro Completo**
- **Gestão de Despesas**: Controle total de gastos e custos
- **Transações Financeiras**: Receitas, despesas e parcelas
- **Formas de Pagamento**: Dinheiro, cartão, PIX, crédito
- **Controle de Parcelas**: Gestão automática de pagamentos parcelados
- **Relatórios Financeiros**: Análises detalhadas de faturamento
- **Validações Inteligentes**: Prevenção de inconsistências financeiras

### **💬 Atendimento WhatsApp Integrado**
- **Sistema de Leads**: Captação e qualificação de prospects
- **Gestão de Conversas**: Atendimento organizado por status
- **Campanhas de Marketing**: Acompanhamento de origem dos leads
- **Conversão de Leads**: Transformação em pacientes
- **Métricas de Performance**: Análise de taxa de conversão

### **📊 Sistema de Notificações**
- **Notificações Personalizadas**: Envio para grupos específicos
- **Múltiplos Destinatários**: Funcionários, pacientes ou grupos
- **Agendamento**: Notificações com data de expiração
- **Status de Entrega**: Controle de visualização e entrega
- **Templates**: Modelos pré-definidos para diferentes situações

## �️ Telas e Funcionalidades

### **📊 Sistema de Dashboard**
O sistema possui três dashboards especializados com controle de acesso baseado em perfil:

#### **💰 Dashboard Financeiro** (`/`)
- **Acesso**: Administrador, Administrativo, Comercial, Funcionário
- **Funcionalidades**:
  - Métricas financeiras e faturamento
  - Análise de receitas e despesas
  - Indicadores de performance financeira
  - Gráficos de tendências e comparativos

#### **⚙️ Dashboard Operação** (`/dashboard-operacao`)
- **Acesso**: Todos os perfis (incluindo Fisioterapeuta)
- **Funcionalidades**:
  - Sessões do dia e taxa de ocupação
  - Controle de pacientes ativos
  - Métricas de avaliações realizadas
  - Indicadores operacionais em tempo real
  - Acompanhamento de agendamentos
  - **📊 Gráfico de Sessões Mensais Multi-Séries**:
    - 🟢 Sessões Realizadas
    - 🔴 Sessões Canceladas
    - 🟡 Sessões Reagendadas
    - Visualização comparativa mensal
    - Estados vazios elegantes quando sem dados
  - **📈 Gráficos de Distribuição**:
    - Distribuição por Unidades (Pie Chart)
    - Top Serviços Mais Agendados (Pie Chart)  
    - Sessões por Fisioterapeuta (Bar Chart)

#### **📈 Dashboard Lead** (`/dashboard-lead`)
- **Acesso**: Administrador, Administrativo, Comercial, Funcionário
- **Funcionalidades**:
  - Funil de vendas interativo
  - Taxa de conversão de leads
  - Análise de origem dos leads (WhatsApp, Instagram, Indicação, Site)
  - Métricas de leads qualificados
  - Acompanhamento de novos pacientes

### **🔐 Sistema de Controle de Acesso**
- **Autenticação JWT** com roles específicos
- **Controle de Menu** baseado no perfil do usuário
- **Permissões Granulares** por funcionalidade

#### **🏗️ Arquitetura do Dashboard**

O sistema de dashboard implementa uma arquitetura robusta com integração completa entre frontend e backend:

**🔄 Service Layer**
- `DashboardService.ts` - Camada de serviços com 10+ endpoints especializados
- Requests assíncronos com Promise.all para otimização de performance
- Tratamento automático de erros e loading states
- Suporte a filtros avançados (período, filial, funcionário)

**📊 Componentes de Gráficos**
- `MonthlySessionsChart` - Gráfico de barras com suporte a múltiplas séries
- `UnidadesPieChart` - Distribuição por unidades (Pie Chart)
- `ServicosPieChart` - Top serviços mais agendados (Pie Chart)
- `FisioterapeutasBarChart` - Sessões por fisioterapeuta (Bar Chart)
- Estados vazios elegantes com ícones contextuais
- Loading states individuais por componente

**⚡ Custom Hooks**
- `useDashboard` - Hook customizado para gerenciamento de estado
- Carregamento paralelo de dados com otimização
- Cache automático via React Query
- Recarregamento manual com função `recarregarDados()`

**🎨 TypeScript Integration**
- Interfaces tipadas para todas as responses da API
- DTOs específicos para cada tipo de dado
- Type safety completo entre frontend e backend
- Suporte a modelos legados e novos (multi-séries)

**📱 Responsividade**
- Grid layout adaptativo (1-4 colunas)
- Gráficos responsivos com scroll horizontal
- Estados de loading otimizados para mobile
- Tooltips e interações touch-friendly

#### **Perfis e Acessos:**
- **👨‍⚕️ Fisioterapeuta**: Dashboard Operação, Agenda, Pacientes (apenas check-in), Funcionários
- **👨‍💼 Comercial**: WhatsApp, Agenda, Sub.Serviço, Funcionários, Dashboard (todos)
- **👩‍💻 Administrador/Administrativo**: Acesso completo a todas as funcionalidades
- **👤 Funcionário**: Dashboard, Agenda, Funcionários, Pacientes

### **📋 Páginas Principais**

#### **👥 Gestão de Pacientes** (`/customer`)
- Listagem com filtros avançados
- Cadastro e edição de pacientes
- Sistema de status do tratamento
- Histórico detalhado de atendimentos
- Botões de ação contextuais por perfil

#### **🗓️ Agenda** (`/calendar`)
- Calendário completo (mês, semana, dia)
- Agendamento de consultas e sessões
- Controle de conflitos de horário
- Visualização por profissional

#### **👨‍💼 Funcionários** (`/profile`, `/form-employee`)
- Cadastro de profissionais
- Controle de especialidades
- Sistema de cores para calendário
- Gestão de credenciais

#### **💬 WhatsApp** (`/basic-tables`)
- Sistema de atendimento integrado
- Gestão de leads
- Campanhas e conversões

#### **🏢 Gestão Administrativa**
- **Unidades** (`/form-branch`): Controle de filiais
- **Categorias de Serviço** (`/form-cat-servico`): Tipos de tratamento
- **Subcategorias** (`/form-sub-cat-servico`): Especialidades
- **Ordens de Serviço** (`/ordem-servico`): Controle de tratamentos

## 💰 Sistema Financeiro Avançado

### **📊 Gestão Financeira** (`/financeiro/despesas`)
- **Acesso**: Apenas Administradores
- **Funcionalidades Principais**:
  - 💳 **Controle Total de Despesas**: Cadastro, edição e exclusão
  - 📊 **Métricas em Tempo Real**: Receitas, despesas e saldo do mês
  - 🔍 **Filtros Avançados**: Por unidade, período e status
  - 💰 **Gestão de Parcelas**: Controle automático de pagamentos parcelados
  - 🏦 **Múltiplas Formas de Pagamento**: Dinheiro, cartão, PIX, crédito
  - ✅ **Validações Inteligentes**: Prevenção de inconsistências financeiras
  - 📈 **Relatórios Detalhados**: Análise completa de fluxo de caixa

### **🔐 Regras de Negócio Financeiro**
- **Controle de Parcelas**: Transações a crédito não podem ser concluídas com parcelas em aberto
- **Validação de Status**: Sistema previne alterações inadequadas de status
- **Cálculo Automático**: Valores de parcelas calculados automaticamente
- **Integração com Vendas**: Transações financeiras criadas automaticamente nas vendas
- **Auditoria Completa**: Log de todas as alterações financeiras

## 📬 Sistema de Notificações

### **📤 Envio de Notificações** (`/notificacoes/enviar`)
- **Acesso**: Apenas Administradores
- **Funcionalidades**:
  - 📝 **Criação Personalizada**: Título, mensagem e destinatários customizáveis
  - 👥 **Múltiplos Destinatários**: Envio para todos ou funcionários específicos
  - ⏰ **Agendamento**: Definição de data de expiração
  - 📊 **Controle de Status**: Ativo/Inativo para gerenciamento
  - 📋 **Histórico Completo**: Visualização de todas as notificações enviadas
  - ✏️ **Edição Dinâmica**: Modificação de notificações existentes

### **🔄 Integração com API**
- **Endpoint Dedicado**: Sistema de notificações com CRUD completo
- **Validação de Dados**: DTOs tipados para garantir integridade
- **Estado Reativo**: Atualizações em tempo real via React Query
- **Tratamento de Erros**: Sistema robusto de feedback ao usuário

## 🏗️ Rotas e Navegação Completa

### **🏠 Dashboards**
```typescript
/ - Dashboard Financeiro (Admin, Administrativo, Comercial, Funcionário)
/dashboard-operacao - Dashboard Operação (Todos os perfis)
/dashboard-lead - Dashboard Lead (Admin, Administrativo, Comercial, Funcionário)
```

### **👥 Gestão de Pessoas**
```typescript
/customer - Gestão de Pacientes (filtros avançados)
/form-employee - Gestão de Funcionários
/profile - Perfil do Usuário
```

### **📅 Agendamento**
```typescript
/calendar - Sistema de Agenda Completo
```

### **🏢 Gestão Administrativa**
```typescript
/form-branch - Gestão de Unidades/Filiais
/form-cat-servico - Categorias de Serviço
/form-sub-cat-servico - Subcategorias de Serviço
/ordem-servico - Tratamentos e Sessões
```

### **💰 Sistema Financeiro**
```typescript
/financeiro/despesas - Gestão Financeira Completa (Admin only)
```

### **📬 Comunicação**
```typescript
/basic-tables - Sistema WhatsApp/Atendimento
/notificacoes/enviar - Envio de Notificações (Admin only)
```

### **🔐 Autenticação**
```typescript
/signin - Login
/signup - Registro
```

### **🎨 UI/Demonstração**
```typescript
/alerts - Componentes de Alerta
/avatars - Componentes de Avatar
/badge - Componentes de Badge
/buttons - Componentes de Botão
/images - Galeria de Imagens
/videos - Player de Vídeos
/line-chart - Demonstração Gráfico de Linha
/bar-chart - Demonstração Gráfico de Barras
```

## �🛠️ Comandos de Desenvolvimento

### **Instalação**
```bash
# Instalar dependências
npm install

# Ou usando yarn
yarn install
```

### **Desenvolvimento**
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Servidor estará disponível em http://localhost:5173
```

### **Build**
```bash
# Build de produção
npm run build

# Gera arquivos otimizados na pasta 'dist/'
```

### **Lint e Qualidade**
```bash
# Executar ESLint
npm run lint

# Corrigir problemas automaticamente
npm run lint -- --fix
```

### **Preview**
```bash
# Preview da build de produção
npm run preview

# Testa a build localmente antes do deploy
```

### **Deploy**
```bash
# Deploy automático via Vercel (configurado)
git push origin main

# Ou build manual para outros provedores
npm run build && cp -r dist/* /seu/servidor/
```

## 🌐 API Routes e Endpoints

### **🔐 Autenticação**

#### **POST /api/User/LoginUser**
- **Descrição**: Login de usuário
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: UserDto }`

#### **POST /api/User/RegisterUser**
- **Descrição**: Registro de novo usuário
- **Body**: `UserRequestDto`
- **Response**: `{ status: number }`

#### **GET /api/User/SearchUser**
- **Descrição**: Buscar usuário
- **Filters**: `email`, `id`
- **Response**: `UserResponseDto`

---

### **� Dashboard Analytics**

#### **GET /api/Dashboard/pacientes-ativos**
- **Descrição**: Número total de pacientes ativos
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `{ total: number, variacao: number }`

#### **GET /api/Dashboard/agendamentos-marcados**
- **Descrição**: Agendamentos marcados por período
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `[{ periodo: string, total: number, variacao: number }]`

#### **GET /api/Dashboard/avaliacoes-agendadas**
- **Descrição**: Avaliações agendadas por período
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `[{ periodo: string, total: number, variacao: number }]`

#### **GET /api/Dashboard/avaliacoes-executadas**
- **Descrição**: Avaliações realizadas no período
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `{ total: number, variacao: number }`

#### **GET /api/Dashboard/sessoes-realizadas**
- **Descrição**: Sessões realizadas por período
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `[{ periodo: string, total: number, variacao: number }]`

#### **GET /api/Dashboard/sessoes-canceladas**
- **Descrição**: Sessões canceladas com percentual
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `{ periodo: string, total: number, percentual: number, variacao: number }`

#### **GET /api/Dashboard/sessoes-mensais-multi** 🆕
- **Descrição**: Evolução mensal com múltiplas séries (Realizadas, Canceladas, Reagendadas)
- **Filters**: `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: 
```json
{
  "meses": ["Jan", "Fev", "Mar", ...],
  "series": [
    { "name": "Realizadas", "data": [145, 220, 189, ...] },
    { "name": "Canceladas", "data": [25, 35, 28, ...] },
    { "name": "Reagendadas", "data": [18, 28, 22, ...] }
  ]
}
```

#### **GET /api/Dashboard/unidades-distribuicao**
- **Descrição**: Distribuição de sessões por unidade
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `funcionarioId`
- **Response**: `[{ unidade: string, total: number }]`

#### **GET /api/Dashboard/servicos-mais-agendados**
- **Descrição**: Top serviços mais agendados
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`, `funcionarioId`
- **Response**: `[{ servico: string, total: number }]`

#### **GET /api/Dashboard/sessoes-por-fisioterapeuta**
- **Descrição**: Sessões realizadas por fisioterapeuta
- **Filters**: `periodo`, `dataInicio`, `dataFim`, `filialId`
- **Response**: `[{ fisioterapeuta: string, total: number }]`

---

### **�👥 Gestão de Pacientes**

#### **GET /api/Customer/GetAllCustomer**
- **Descrição**: Listar todos os pacientes com filtros
- **Filters**: 
  - `nome` (string) - Filtro por nome
  - `cpf` (string) - Filtro por CPF  
  - `email` (string) - Filtro por email
  - `telefone` (string) - Filtro por telefone
  - `status` (number) - Status do tratamento
- **Response**: `CustomerResponseDto[]`

#### **POST /api/Customer/RegisterCustomer**
- **Descrição**: Cadastrar novo paciente
- **Body**: `CustomerRequestDto`
- **Response**: `{ status: number }`

#### **PUT /api/Customer/UpdateCustomer**
- **Descrição**: Atualizar dados do paciente
- **Body**: `CustomerRequestDto`
- **Response**: `{ status: number }`

#### **GET /api/Customer/SearchCustomer**
- **Descrição**: Buscar paciente específico
- **Filters**: `email`, `id`
- **Response**: `CustomerResponseDto`

#### **PUT /api/Customer/DesableCustomer/{id}**
- **Descrição**: Desativar paciente
- **Params**: `id` (string)
- **Response**: `{ status: number }`

#### **POST /api/Customer/AddCustomerFromExcel**
- **Descrição**: Importar pacientes via Excel
- **Body**: `FormData` com arquivo
- **Response**: `{ status: number }`

#### **GET /api/Customer/GetCustomerHistory**
- **Descrição**: Obter histórico do paciente
- **Filters**: `clienteId` (string)
- **Response**: `HistoryCustomerResponseDto[]`

---

### **🏢 Gestão de Funcionários**

#### **GET /api/Employee**
- **Descrição**: Listar todos os funcionários
- **Response**: `EmployeeResponseDto[]`

#### **POST /api/Employee**
- **Descrição**: Cadastrar novo funcionário
- **Body**: `EmployeeRequestDto`
- **Response**: `EmployeeResponseDto`

#### **PUT /api/Employee**
- **Descrição**: Atualizar funcionário
- **Body**: `EmployeeRequestDto`
- **Response**: `EmployeeResponseDto`

#### **GET /api/Employee/{id}**
- **Descrição**: Buscar funcionário por ID
- **Params**: `id` (string)
- **Response**: `EmployeeResponseDto`

#### **PUT /api/Employee/Desativarfuncionario/{id}**
- **Descrição**: Desativar funcionário
- **Params**: `id` (string)
- **Response**: `{ status: number }`

---

### **🏪 Gestão de Filiais**

#### **GET /api/BranchOffice**
- **Descrição**: Listar todas as filiais
- **Response**: `BranchOfficeResponseDto[]`

#### **POST /api/BranchOffice**
- **Descrição**: Cadastrar nova filial
- **Body**: `BranchOfficeRequestDto`
- **Response**: `BranchOfficeResponseDto`

#### **PUT /api/BranchOffice**
- **Descrição**: Atualizar filial
- **Body**: `BranchOfficeRequestDto`
- **Response**: `BranchOfficeResponseDto`

---

### **📅 Sistema de Agendamento**

#### **GET /api/Schedule**
- **Descrição**: Buscar eventos de agenda
- **Filters**: Objeto `Filter` com critérios de busca
- **Response**: `ScheduleRequestDto[]`

#### **POST /api/Schedule**
- **Descrição**: Criar novo evento
- **Body**: `ScheduleRequestDto`
- **Response**: `{ status: number, data: ScheduleRequestDto }`

#### **PUT /api/Schedule**
- **Descrição**: Atualizar evento
- **Body**: `ScheduleRequestDto`
- **Response**: `{ status: number, data: ScheduleRequestDto }`

#### **GET /api/Schedule/date/{date}**
- **Descrição**: Buscar eventos por data
- **Params**: `date` (string)
- **Response**: `ScheduleRequestDto[]`

#### **GET /api/Schedule/upcoming**
- **Descrição**: Buscar próximos eventos
- **Response**: `ScheduleRequestDto[]`

---

### **👨‍⚕️ Participantes da Agenda**

#### **GET /api/ScheduleParticipant**
- **Descrição**: Listar participantes
- **Response**: `ScheduleParticipantRequestDto[]`

#### **POST /api/ScheduleParticipant**
- **Descrição**: Adicionar participante
- **Body**: `ScheduleParticipantRequestDto`
- **Response**: `{ status: number }`

#### **GET /api/ScheduleParticipant/BySchedule/{scheduleId}**
- **Descrição**: Participantes por agenda
- **Params**: `scheduleId` (string)
- **Response**: `ScheduleParticipantRequestDto[]`

---

### **🔧 Gestão de Serviços**

#### **GET /api/CategoryService**
- **Descrição**: Listar categorias de serviço
- **Filters**: `titulo`, `desc`
- **Response**: `CategoryServiceResponseDto[]`

#### **POST /api/CategoryService**
- **Descrição**: Criar categoria
- **Body**: `CategoryServiceRequestDto`
- **Response**: `CategoryServiceResponseDto`

#### **GET /api/SubCategory**
- **Descrição**: Listar subcategorias
- **Filters**: `titulo`, `desc`
- **Response**: `SubCategoryServiceResponseDto[]`

#### **POST /api/SubCategory**
- **Descrição**: Criar subcategoria
- **Body**: `SubCategoryServiceRequestDto`
- **Response**: `SubCategoryServiceResponseDto`

---

### **📋 Ordens de Serviço**

#### **GET /api/OrderService**
- **Descrição**: Listar ordens de serviço
- **Filters**: `clienteId`, `funcionarioId`, `status`
- **Response**: `OrderServiceResponseDto[]`

#### **POST /api/OrderService**
- **Descrição**: Criar ordem de serviço
- **Body**: `OrderServiceRequestDto`
- **Response**: `OrderServiceResponseDto`

#### **PUT /api/OrderService**
- **Descrição**: Atualizar ordem de serviço
- **Body**: `OrderServiceRequestDto`
- **Response**: `OrderServiceResponseDto`

---

### **🏃‍♂️ Gestão de Sessões**

#### **GET /api/SessionService/GetByAllSessionService/**
- **Descrição**: Listar sessões
- **Filters**: `clienteId` (opcional)
- **Response**: `OrderServiceSessionResponseDto[]`

#### **POST /api/SessionService**
- **Descrição**: Criar sessão
- **Body**: `OrderServiceSessionRequestDto`
- **Response**: `OrderServiceSessionResponseDto`

## � Status e Roadmap do Projeto

### **✅ Funcionalidades Implementadas (v2.0.1)**
- ✅ **Sistema de Dashboards Completo**: 3 dashboards especializados
- ✅ **Gestão Financeira Avançada**: Controle total de receitas e despesas
- ✅ **Sistema de Notificações**: Comunicação interna completa
- ✅ **Controle de Acesso RBAC**: Permissões granulares por perfil
- ✅ **Gestão de Pacientes**: CRUD completo com filtros avançados
- ✅ **Sistema de Agendamento**: Calendário completo com múltiplas visualizações
- ✅ **Gestão de Funcionários**: Controle de profissionais e especialidades
- ✅ **WhatsApp Integration**: Sistema de leads e atendimento
- ✅ **Validações Financeiras**: Prevenção de inconsistências
- ✅ **Relatórios Dinâmicos**: Gráficos interativos em tempo real

### **🔄 Em Desenvolvimento**
- 🔄 **Sistema de Relatórios PDF**: Exportação de dados
- 🔄 **Notificações Push**: Integração com navegador
- 🔄 **Mobile App**: Versão nativa para Android/iOS
- 🔄 **API de Integração**: Webhooks para sistemas externos
- 🔄 **Backup Automático**: Sistema de backup de dados

### **📅 Próximas Releases**
- **v2.1.0**: Sistema de Relatórios e Exportação
- **v2.2.0**: Integração com WhatsApp Business API
- **v2.3.0**: Mobile Application
- **v3.0.0**: Sistema de Telemedicina

## 🏗️ Arquitetura de Desenvolvimento

### **📁 Estrutura de Branches**
```
main                 # Produção estável
├── feat/faturamento # Novas funcionalidades financeiras
├── feat/dashboard   # Melhorias nos dashboards
├── fix/bugs         # Correções de bugs
└── develop          # Desenvolvimento integrado
```

### **🔄 Pipeline de Deploy**
1. **Development**: Desenvolvimento local com hot reload
2. **Testing**: Testes automatizados e manuais
3. **Staging**: Ambiente de homologação
4. **Production**: Deploy automatizado via Vercel

### **📊 Métricas de Qualidade**
- **TypeScript Coverage**: 100% tipagem
- **Component Tests**: 85%+ cobertura
- **Performance Score**: 95+ (Lighthouse)
- **Accessibility**: AA compliance
- **SEO Score**: 90+ (páginas públicas)

## 🤝 Contribuição e Desenvolvimento

### **👨‍💻 Equipe de Desenvolvimento**
- **Frontend Team**: React/TypeScript specialists
- **Backend Team**: .NET Core/SQL Server experts
- **DevOps**: Azure/Vercel deployment
- **UX/UI**: Design system e usabilidade

### **� Convenções de Código**
```typescript
// Nomenclatura de componentes (PascalCase)
export default function CustomerTable() {}

// Hooks customizados (camelCase com 'use')
export function useFinancialStats() {}

// Constantes (UPPER_SNAKE_CASE)
const API_ENDPOINTS = {}

// Interfaces (PascalCase com sufixo)
interface CustomerRequestDto {}
```

### **🔧 Ferramentas de Desenvolvimento**
- **ESLint**: Análise estática de código
- **Prettier**: Formatação automática
- **Husky**: Git hooks para qualidade
- **TypeScript**: Tipagem estática
- **Vite**: Build tool otimizada

## 📄 Licença e Informações

### **📜 Licença**
Este projeto é propriedade do **Instituto Barros** e está licenciado para uso interno exclusivo.

### **🔐 Política de Segurança**
- **Dados Sensíveis**: Tratamento conforme LGPD
- **Acesso Restrito**: Apenas pessoal autorizado
- **Backup Seguro**: Criptografia em repouso
- **Auditoria**: Log completo de ações

### **📞 Suporte Técnico**
- **Email**: [REMOVIDO POR SEGURANÇA]
- **Slack**: [REMOVIDO POR SEGURANÇA]
- **Documentação**: [REMOVIDO POR SEGURANÇA]

---

> **Sistema Instituto Barros v2.0.1** - Solução completa para gestão clínica desenvolvida com as mais modernas tecnologias web. Focado em performance, segurança e experiência do usuário.

**Última atualização**: Janeiro 2025 | **Status**: Produção Ativa ✅

🗓️ Agendamento:
└── /calendar                   # Sistema de Agenda

💬 Atendimento:
└── /basic-tables              # WhatsApp/Leads

🏢 Configurações:
├── /form-branch               # Unidades/Filiais
├── /form-cat-servico          # Categorias de Serviço
├── /form-sub-cat-servico      # Subcategorias
└── /ordem-servico             # Ordens de Serviço

🔐 Autenticação:
├── /signin                    # Login
└── /signup                    # Registro
```

### **URLs do Sistema**
- **Frontend Produção**: Hospedado via Vercel
- **Backend Produção**: `https://instituto-barros-sistema.azurewebsites.net`
- **API Base**: `/api`

### **Autenticação**
- **Método**: JWT Bearer Token
- **Storage**: localStorage
- **Expiração**: Verificação automática
- **Interceptador**: Axios com token automático

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Tailwind CSS padrão (sm, md, lg, xl, 2xl)
- **Sidebar Adaptativa**: Collapsible em desktop, overlay em mobile
- **Tabelas Responsivas**: Scroll horizontal e layout adaptativo

## 🎯 Próximas Funcionalidades

- [ ] Sistema de relatórios avançados
- [ ] Integração com WhatsApp Business API
- [ ] Notificações push
- [x] ✅ **Dashboard Operação** - Métricas operacionais para fisioterapeutas
- [x] ✅ **Dashboard Lead** - Funil de vendas e análise de conversão
- [x] ✅ **Sistema de Controle de Acesso** - Permissões baseadas em perfil
- [x] ✅ **Gráficos Multi-Séries** - Sessões realizadas, canceladas e reagendadas
- [x] ✅ **API Dashboard Completa** - 10+ endpoints especializados para analytics
- [x] ✅ **Estados Vazios Elegantes** - UX otimizada quando sem dados
- [x] ✅ **Service Layer Otimizada** - Requisições paralelas e cache automático
- [ ] Backup automático de dados
- [ ] Sistema de permissões granular avançado
- [ ] Filtros avançados de período nos dashboards
- [ ] Exportação de dados dos gráficos (PDF/Excel)

---

## 👥 Contribuição

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Clone** sua fork
3. **Crie** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para a branch
6. **Abra** um Pull Request

## 📄 Licença

Este projeto é propriedade do **Instituto Barros** e está protegido por direitos autorais.

---

## 📝 Changelog

### **v2.1.0** - Janeiro 2025
- ✅ **Dashboard Multi-Séries**: Implementação completa do gráfico de sessões com múltiplas séries
- ✅ **API Dashboard**: 10+ novos endpoints especializados para analytics
- ✅ **UX Melhorada**: Estados vazios elegantes com ícones contextuais
- ✅ **Performance**: Service layer otimizada com requisições paralelas
- ✅ **TypeScript**: Type safety completo entre frontend e backend
- ✅ **Responsividade**: Gráficos otimizados para todos os dispositivos

### **v2.0.0** - Dezembro 2024
- ✅ Sistema de Dashboard completo (Financeiro, Operação, Lead)
- ✅ Controle de acesso baseado em perfis
- ✅ Integração com WhatsApp
- ✅ Sistema de agendamento avançado

---

**Desenvolvido com ❤️ para o Instituto Barros**