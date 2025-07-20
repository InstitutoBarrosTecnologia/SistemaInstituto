# 🏥 Sistema Instituto Barros - Frontend

> Sistema de gestão clínica e administrativa para o Instituto Barros, desenvolvido com tecnologias modernas para oferecer uma experiência completa na gestão de pacientes, funcionários, agendamentos e tratamentos.

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
│   ├── Dashboard/      # Dashboard principal
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

### **📅 Sistema de Agendamento**
- Calendário completo com visualizações (mês, semana, dia)
- Agendamento de consultas e sessões
- Controle de participantes
- Notificações e lembretes
- Gestão de conflitos de horário

### **🔧 Gestão de Serviços**
- Categorias e subcategorias de serviços
- Ordens de serviço para tratamentos
- Controle de sessões de fisioterapia
- Acompanhamento de progresso

### **💬 Atendimento WhatsApp**
- Sistema integrado de atendimento
- Gestão de leads e conversões
- Acompanhamento de campanhas

## 🛠️ Comandos de Desenvolvimento

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

### **👥 Gestão de Pacientes**

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

### **Tipos de Usuários**
- **Administrativo** - Acesso completo ao sistema
- **Comercial** - Gestão de leads e vendas
- **Fisioterapeuta** - Atendimento e sessões
- **Recepcionista** - Agendamentos e atendimento

## 🌍 Ambiente e Deploy

### **Variáveis de Ambiente**
```bash
# Desenvolvimento
VITE_API_URL=http://localhost:5101/api

# Produção
VITE_API_URL=https://instituto-barros-sistema.azurewebsites.net/api
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
- [ ] Dashboard analytics
- [ ] Backup automático de dados
- [ ] Sistema de permissões granular

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

**Desenvolvido com ❤️ para o Instituto Barros**