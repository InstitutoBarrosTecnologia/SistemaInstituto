# 🏥 Sistema Instituto Barros - Frontend

> Sistema completo de gestão clínica e administrativa para o Instituto Barros. Plataforma moderna desenvolvida com React e TypeScript que oferece gestão integrada de pacientes, funcionários, agendamentos, tratamentos e sistema avançado de recorrência para sessões de fisioterapia.

## 🎯 Últimas Atualizações

### 📅 Sistema de Agendamento com Recorrência Avançada
- **Agendamento Recorrente Inteligente**: Criação automática de múltiplas sessões baseada em dias da semana
- **Edição de Recorrência**: Atualização em lote de sessões futuras mantendo histórico de sessões passadas
- **Cálculo Inteligente de Datas**: Sistema preciso que identifica corretamente a próxima ocorrência de cada dia da semana
- **Status de Agendamento**: 10 diferentes status com ícones visuais (A Confirmar, Finalizado, Confirmado pelo Paciente, etc.)
- **Filtros Avançados**: Filtragem por filial e fisioterapeuta com controle de acesso baseado em perfil
- **Interface Otimizada**: Tooltips informativos, cores personalizadas por funcionário e visualização responsiva

### 🔧 Melhorias Técnicas Implementadas
- **Validação de Horários**: Sistema que respeita horários específicos dos campos de data/hora
- **Correção de Fuso Horário**: Formatação manual de datas para evitar problemas de timezone
- **Debug Avançado**: Sistema completo de logs para monitoramento de cálculos de data
- **Otimização de Performance**: Uso de Promise.all para operações em lote

## 🚀 Tecnologias Embarcadas

### **Core Framework**
- **React 18.3.1** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Vite** - Build tool moderna para desenvolvimento rápido

### **Roteamento e Estado**
- **React Router 7.1.5** - Gerenciamento de rotas SPA
- **TanStack React Query 4.39.2** - Cache e sincronização de estado server-side
- **Context API** - Gerenciamento de estado global (Theme, Sidebar)

### **Interface e Estilização**
- **Tailwind CSS 3.0** - Framework CSS utility-first
- **Tailwind Forms** - Componentes de formulário estilizados
- **React Hot Toast** - Sistema de notificações elegante
- **ApexCharts** - Biblioteca de gráficos interativos

### **Componentes e UI**
- **FullCalendar** - Sistema completo de calendário e agendamento
- **React Input Mask** - Máscaras para campos de entrada
- **React Color** - Seletor de cores
- **React Dropzone** - Upload de arquivos drag-and-drop
- **Swiper** - Carrossel e sliders responsivos

### **Autenticação e Segurança**
- **JWT Decode** - Decodificação de tokens JWT
- **Axios** - Cliente HTTP com interceptadores
- **Protected Routes** - Rotas protegidas por autenticação

### **Utilitários**
- **React Helmet Async** - Gerenciamento de meta tags
- **Flatpickr** - Date picker avançado
- **Simplebar React** - Scrollbars customizadas
- **ClassNames/CLSX** - Manipulação condicional de classes CSS

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── charts/         # Gráficos e visualizações
│   ├── common/         # Componentes comuns (Header, Breadcrumb)
│   ├── form/           # Componentes de formulário
│   ├── header/         # Cabeçalho e navegação
│   ├── tables/         # Tabelas e grids de dados
│   ├── ui/             # Componentes básicos de UI
│   └── UserProfile/    # Componentes de perfil
├── context/            # Contextos React (Theme, Sidebar)
├── hooks/              # Hooks customizados
├── icons/              # Ícones SVG do sistema
├── layout/             # Layouts da aplicação
├── pages/              # Páginas da aplicação
│   ├── AuthPages/      # Login e registro
│   ├── Charts/         # Páginas de gráficos
│   ├── Dashboard/      # Dashboard com múltiplas visões (Financeiro, Operação, Lead)
│   ├── Forms/          # Formulários de cadastro
│   ├── Tables/         # Páginas de tabelas
│   └── UiElements/     # Elementos de interface
├── services/           # Camada de serviços
│   ├── model/          # DTOs e interfaces
│   ├── service/        # Serviços de API
│   └── util/           # Utilitários (JWT, formatação)
└── ProtectedRoute.tsx  # Componente de proteção de rotas
```

### **Padrões Arquiteturais**
- **Separation of Concerns** - Separação clara entre UI, lógica e dados
- **Component-Based** - Arquitetura baseada em componentes reutilizáveis
- **Service Layer** - Camada de serviços para comunicação com API
- **DTO Pattern** - Data Transfer Objects para tipagem de dados
- **Hook Pattern** - Hooks customizados para lógica reutilizável

## 📋 Sistema de Gestão

O Sistema Instituto Barros é uma solução completa para gestão clínica que inclui:

### **👥 Gestão de Pacientes**
- Cadastro completo com dados pessoais, médicos e histórico
- Sistema de filtros avançado (nome, CPF, email, telefone, status)
- Controle de status do tratamento (Novo → Alta/Cancelado)
- Histórico detalhado de atendimentos
- Upload em massa via Excel

### **🏢 Gestão de Funcionários**
- Cadastro de profissionais com especialidades
- Controle de credenciais (Crefito, etc.)
- Sistema de cores para identificação no calendário
- Configuração de acesso ao sistema
- Gestão de filiais e departamentos

### **📅 Sistema de Agendamento Avançado**
- **Calendário FullCalendar** com visualizações múltiplas (mês, semana, dia)
- **Agendamento Recorrente Inteligente**:
  - Criação automática de múltiplas sessões baseada em dias da semana selecionados
  - Algoritmo inteligente que calcula corretamente a próxima ocorrência de cada dia
  - Suporte a múltiplos dias (Ex: Segunda, Quarta e Sexta)
  - Validação de horários para evitar agendamentos em horários passados
- **Edição de Recorrência em Lote**:
  - Atualização simultânea de sessões futuras
  - Preservação do histórico de sessões já realizadas
  - Alteração de horários respeitando campos de data/hora específicos
- **Sistema de Status Avançado**:
  - 10 diferentes status com ícones visuais: ❓ A Confirmar, ✅ Finalizado, 👍 Confirmado pelo Paciente, ⏳ Em Espera, ❌ Cancelado pelo Profissional, ✖️ Cancelado pelo Paciente, ⚠️ Faltou, 🔄 Pré-Atendimento, 📅 Reagendar, 💰 Pagamento
  - Cores personalizadas por funcionário para identificação visual rápida
  - Tooltips informativos com detalhes completos do agendamento
- **Filtros Inteligentes**:
  - Filtro por filial com acesso completo para administradores
  - Filtro automático por fisioterapeuta baseado no perfil do usuário logado
  - Auto-aplicação de filtros para perfis específicos (fisioterapeutas veem apenas seus agendamentos)
- **Interface Otimizada**:
  - Eventos truncados com tooltips para informações completas
  - Responsividade total em dispositivos móveis
  - Loading states e feedback visual em operações

### **🔧 Gestão de Serviços e Tratamentos**
- **Categorias e Subcategorias**: Organização hierárquica de serviços oferecidos
- **Ordens de Serviço**: Controle completo de tratamentos e acompanhamento
- **Sessões de Fisioterapia**: Gestão individual e recorrente de sessões
- **Acompanhamento de Progresso**: Histórico detalhado de evolução dos pacientes

### **💬 Atendimento WhatsApp**
- Sistema integrado de atendimento
- Gestão de leads e conversões
- Acompanhamento de campanhas

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

## 🛠️ Comandos de Desenvolvimento

### **📦 Instalação**
```bash
# Instalar dependências
npm install

# Ou usando yarn
yarn install
```

### **⚡ Desenvolvimento**
```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
yarn dev

# Servidor estará disponível em http://localhost:5173
```

### **🏗️ Build e Deploy**
```bash
# Build de produção
npm run build
# ou
yarn build

# Gera arquivos otimizados na pasta 'dist/'
```

### **🔍 Lint e Qualidade de Código**
```bash
# Executar ESLint
npm run lint
# ou
yarn lint

# Corrigir problemas automaticamente
npm run lint -- --fix
```

### **👀 Preview da Build**
```bash
# Preview da build de produção local
npm run preview
# ou  
yarn preview

# Testa a build localmente antes do deploy
```

### **🚀 Deploy Automático**
```bash
# Deploy via Vercel (configurado automaticamente)
git push origin main

# O sistema está configurado para deploy automático no Vercel
# Toda push na branch main dispara um novo deploy
```

### **🧪 Comandos de Debug**
```bash
# Executar com debug de data/hora no agendamento
yarn dev

# Abra o console do navegador para ver logs detalhados
# dos cálculos de recorrência e geração de datas
```

## 🔧 Configurações Técnicas

### **Variáveis de Ambiente**
```bash
# .env.local
VITE_API_BASE_URL=https://api.institutobarros.com
VITE_APP_TITLE=Sistema Instituto Barros
```

### **Estrutura de Build**
- **Vite**: Build tool moderna com hot-reload ultra-rápido
- **TypeScript**: Compilação com verificação de tipos
- **ESLint**: Análise estática de código
- **Tailwind CSS**: CSS otimizado e purging automático
- **Tree Shaking**: Eliminação automática de código não utilizado

### **Performance**
- **Code Splitting**: Divisão automática de código por rotas
- **Lazy Loading**: Carregamento dinâmico de componentes
- **React Query**: Cache inteligente de dados da API
- **Otimização de Imagens**: Compressão automática de assets

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

## 🎨 Status do Sistema

### **Status de Pacientes**
```typescript
enum CustomerStatus {
  NovoCliente = 0,        // Novo Paciente
  AguardandoAvaliacao = 1, // Aguardando Avaliação
  EmAvaliacao = 2,        // Em Avaliação
  PlanoTratamento = 3,    // Plano de Tratamento
  EmAtendimento = 4,      // Em Atendimento
  FaltouAtendimento = 5,  // Faltou Atendimento
  TratamentoConcluido = 6, // Tratamento Concluído
  Alta = 7,               // Alta
  Cancelado = 8,          // Cancelado
  Inativo = 9             // Inativo
}
```

### **🔐 Controle de Acesso por Perfil**

#### **Fisioterapeuta** 👨‍⚕️
```typescript
// Acesso limitado focado no atendimento
rotas: [
  '/dashboard-operacao',  // Dashboard especializado
  '/calendar',           // Agenda (apenas seus agendamentos)
  '/customer',          // Pacientes (visualização + check-in)
  '/profile'            // Perfil pessoal
]
```

#### **Comercial** 💼
```typescript
// Acesso focado em vendas e relacionamento
rotas: [
  '/',                   // Dashboard Financeiro
  '/dashboard-operacao', // Dashboard Operação
  '/dashboard-lead',     // Dashboard Lead
  '/basic-tables',       // WhatsApp/Leads
  '/calendar',           // Agenda completa
  '/form-sub-cat-servico', // Subcategorias
  '/profile'             // Funcionários
]
```

#### **Administrativo** 👨‍💼
```typescript
// Acesso completo ao sistema
rotas: [
  '*'  // Todas as funcionalidades disponíveis
]
```

### **🎯 Sistema de Status de Agendamento**

```typescript
enum EScheduleStatus {
  AConfirmar = 0,                    // ❓ A Confirmar
  Finalizado = 1,                    // ✅ Finalizado  
  ConfirmadoPeloPaciente = 2,        // 👍 Confirmado pelo Paciente
  EmEspera = 3,                      // ⏳ Em Espera
  CanceladoPeloProfissional = 4,     // ❌ Cancelado pelo Profissional
  CanceladoPeloPaciente = 5,         // ✖️ Cancelado pelo Paciente
  Faltou = 6,                        // ⚠️ Faltou
  PreAtendimento = 7,                // 🔄 Pré-Atendimento
  Reagendar = 8,                     // 📅 Reagendar
  Pagamento = 9                      // 💰 Pagamento
}
```

### **📊 Sistema de Status de Paciente**

```typescript
enum ECustomerStatus {
  Novo = 0,                    // 🆕 Novo (paciente recém-cadastrado)
  PrimeiraConsulta = 1,        // 🏥 Primeira Consulta
  Avaliacao = 2,               // 📋 Avaliação
  EmTratamento = 3,            // 💊 Em Tratamento
  EmAtendimento = 4,           // 🔄 Em Atendimento
  FaltouAtendimento = 5,       // ⚠️ Faltou Atendimento
  TratamentoConcluido = 6,     // ✅ Tratamento Concluído
  Alta = 7,                    // 🎯 Alta
  Cancelado = 8,               // ❌ Cancelado
  Inativo = 9                  // 😴 Inativo
}
```

### **🏗️ Algoritmo de Recorrência de Agendamentos**

O sistema implementa um algoritmo inteligente para criação e edição de agendamentos recorrentes:

```typescript
// Algoritmo de busca sequencial para próximas datas
function getNextDatesForMultipleWeekdays(daysOfWeek: string[], count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zerar horário para comparação precisa
  
  let searchDate = new Date(today); // Começar a partir de hoje
  
  // Para cada sessão necessária
  while (sessionsCreated < count) {
    // Encontrar a próxima ocorrência do dia da semana desejado
    while (searchDate.getDay() !== targetDayNumber) {
      searchDate.setDate(searchDate.getDate() + 1);
    }
    
    // Validar se não é um horário já passado no dia atual
    if (isValidDateTime(searchDate, selectedHorario)) {
      dates.push(new Date(searchDate));
      sessionsCreated++;
    }
    
    // Avançar para próximo dia
    searchDate.setDate(searchDate.getDate() + 1);
  }
}
```

**Características do Algoritmo:**
- ✅ **Busca Sequencial**: Não usa cálculos de semana, procura dia a dia
- ✅ **Validação de Horário**: Evita agendamentos em horários já passados
- ✅ **Múltiplos Dias**: Suporta recorrência em vários dias da semana
- ✅ **Precisão de Data**: Calcula corretamente a próxima ocorrência

**Exemplo Prático:**
```
Hoje: 15/09/2025 (segunda-feira)
Dias selecionados: [Terça-feira, Quinta-feira]
Quantidade: 4 sessões

Resultado:
- Sessão 1: 16/09/2025 (terça-feira) ✅
- Sessão 2: 19/09/2025 (quinta-feira) ✅  
- Sessão 3: 23/09/2025 (terça-feira) ✅
- Sessão 4: 26/09/2025 (quinta-feira) ✅
```

## 🌍 Ambiente e Deploy

### **🔗 URLs do Sistema**
- **Frontend Produção**: Hospedado via Vercel (deploy automático)
- **Backend Produção**: `https://instituto-barros-sistema.azurewebsites.net`
- **API Base**: `/api`
- **Ambiente Local**: `http://localhost:5173` (frontend) + `http://localhost:5101` (backend)

### **🔐 Autenticação e Segurança**
- **Método**: JWT Bearer Token com refresh automático
- **Storage**: localStorage com verificação de expiração
- **Interceptador Axios**: Token automático em todas as requisições
- **Protected Routes**: Componente de proteção baseado em autenticação
- **Role-Based Access**: Controle granular por perfil de usuário

### **🎛️ Variáveis de Ambiente**
```bash
# .env.local (desenvolvimento)
VITE_API_BASE_URL=http://localhost:5101/api
VITE_APP_TITLE=Sistema Instituto Barros
VITE_APP_VERSION=2.0.0

# .env.production (produção)
VITE_API_BASE_URL=https://instituto-barros-sistema.azurewebsites.net/api
VITE_APP_TITLE=Sistema Instituto Barros
VITE_APP_VERSION=2.0.0
```

## 🚀 Roadmap e Próximas Funcionalidades

### **🎯 Em Desenvolvimento**
- [ ] **Sistema de Relatórios Avançados**: Relatórios personalizáveis com exportação
- [ ] **Integração WhatsApp Business API**: Automação de mensagens e campanhas
- [ ] **Notificações Push**: Sistema de notificações em tempo real
- [ ] **Backup Automático**: Backup incremental de dados críticos
- [ ] **Filtros Avançados de Período**: Seleção customizada de datas nos dashboards

### **✅ Funcionalidades Concluídas (Última Atualização)**
- [x] **Sistema de Agendamento Recorrente**: Criação e edição inteligente de sessões
- [x] **Dashboard Operação Multi-Perfil**: Métricas operacionais para todos os perfis
- [x] **Dashboard Lead**: Funil de vendas e análise de conversão completa
- [x] **Sistema de Controle de Acesso**: Permissões granulares baseadas em perfil
- [x] **Gráficos Multi-Séries**: Visualização de sessões realizadas, canceladas e reagendadas
- [x] **API Dashboard Completa**: 10+ endpoints especializados para analytics
- [x] **Estados Vazios Elegantes**: UX otimizada quando não há dados
- [x] **Service Layer Otimizada**: Requisições paralelas com Promise.all e cache automático
- [x] **Algoritmo de Data Inteligente**: Cálculo preciso de próximas ocorrências por dia da semana
- [x] **Sistema de Status Visual**: 10 status diferentes com ícones para agendamentos
- [x] **Filtros por Perfil**: Auto-aplicação de filtros baseados no usuário logado

### **🎯 Funcionalidades Planejadas (2025)**
- [ ] **Sistema de Permissões Granular Avançado**: Controle por funcionalidade específica
- [ ] **Módulo de Financeiro Completo**: Controle de receitas, despesas e fluxo de caixa
- [ ] **Integração com Sistemas Externos**: APIs de laboratórios e convênios
- [ ] **App Mobile Nativo**: Aplicativo React Native para fisioterapeutas
- [ ] **IA para Otimização de Agenda**: Inteligência artificial para sugestão de horários
- [ ] **Sistema de Teleconsulta**: Integração com plataformas de videochamada

## 📱 Características Técnicas

### **🎨 Responsividade e UX**
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints Tailwind**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Sidebar Adaptativa**: Collapsible em desktop, overlay em mobile com backdrop
- **Tabelas Responsivas**: Scroll horizontal automático e layout adaptativo
- **Loading States**: Skeletons e spinners contextualizados
- **Feedback Visual**: Toasts, tooltips e estados de sucesso/erro

### **⚡ Performance e Otimização**
- **Code Splitting**: Divisão automática por rotas com React.lazy
- **Tree Shaking**: Eliminação de código não utilizado no build
- **Lazy Loading**: Carregamento dinâmico de componentes pesados
- **React Query Cache**: Cache inteligente com invalidação automática
- **Promise.all**: Requisições paralelas para otimização de carregamento
- **Vite HMR**: Hot Module Replacement ultra-rápido para desenvolvimento

### **🔧 Arquitetura e Padrões**
- **Component-Based Architecture**: Componentes reutilizáveis e modulares
- **Service Layer Pattern**: Camada de abstração para APIs
- **Custom Hooks**: Lógica reutilizável encapsulada
- **DTO Pattern**: Data Transfer Objects tipados
- **Error Boundaries**: Tratamento elegante de erros React
- **TypeScript Strict**: Tipagem rigorosa em todo o projeto
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

---

## 📝 Changelog Recente

### **v2.1.0** - Sistema de Agendamento Recorrente (Setembro 2025)
- ✅ **Agendamento Recorrente Inteligente**: Algoritmo próprio para cálculo preciso de datas
- ✅ **Edição de Recorrência em Lote**: Atualização simultânea de sessões futuras  
- ✅ **10 Status de Agendamento**: Sistema visual completo com ícones
- ✅ **Filtros por Perfil**: Auto-aplicação baseada no usuário logado
- ✅ **Correção de Timezone**: Formatação manual para evitar problemas de fuso
- ✅ **Debug Avançado**: Logs detalhados para monitoramento de cálculos

### **v2.0.0** - Dashboard Multi-Perfil (Agosto 2025)
- ✅ **Dashboard Operação**: Métricas especializadas para fisioterapeutas
- ✅ **Dashboard Lead**: Funil de vendas completo  
- ✅ **Gráficos Multi-Séries**: Visualização de sessões com múltiplas métricas
- ✅ **API Dashboard**: 10+ endpoints especializados
- ✅ **Controle de Acesso**: Permissões granulares por perfil

### **v1.5.0** - Base do Sistema (Julho 2025)
- ✅ **Gestão de Pacientes**: CRUD completo com filtros avançados
- ✅ **Gestão de Funcionários**: Cadastro com especialidades e cores
- ✅ **Sistema de Agenda**: FullCalendar com eventos personalizados
- ✅ **Autenticação JWT**: Sistema completo de login/logout
- ✅ **Arquitetura Base**: React + TypeScript + Tailwind

---

## 👥 Equipe de Desenvolvimento

### **Frontend**
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite com HMR
- **UI/UX**: Tailwind CSS + Design System personalizado
- **Estado**: React Query + Context API

### **Backend Integration**
- **API**: RESTful com .NET Core
- **Authentication**: JWT Bearer Token
- **Database**: SQL Server com Entity Framework
- **Deploy**: Azure App Service

### **DevOps**
- **CI/CD**: Vercel (frontend) + Azure DevOps (backend)
- **Monitoramento**: Console logs + Azure Application Insights  
- **Versionamento**: Git Flow com feature branches

---

## 🛡️ Licença e Uso

Este sistema foi desenvolvido exclusivamente para o **Instituto Barros** e contém propriedade intelectual protegida. 

**© 2025 Instituto Barros - Todos os direitos reservados**

- ✅ **Uso Autorizado**: Funcionários e parceiros autorizados do Instituto Barros
- ❌ **Uso Não Autorizado**: Distribuição, cópia ou modificação sem autorização
- 🔒 **Dados Sensíveis**: Sistema contém informações médicas protegidas por LGPD

---

## 📞 Suporte e Contato

### **🚨 Suporte Técnico**
- **Issues**: Reporte bugs através do repositório Git
- **Documentação**: README sempre atualizado com últimas funcionalidades
- **Logs**: Console do navegador para debug em desenvolvimento

### **📊 Métricas do Projeto**
- **Linhas de Código**: ~15.000+ linhas (TypeScript/TSX)
- **Componentes**: 50+ componentes reutilizáveis
- **Páginas**: 15+ telas funcionais completas
- **APIs Integradas**: 25+ endpoints do backend
- **Tempo de Desenvolvimento**: 6+ meses de desenvolvimento contínuo

---

**🏥 Desenvolvido com ❤️ e ☕ para revolucionar a gestão clínica do Instituto Barros**

*Sistema em constante evolução - Última atualização: Setembro 2025*