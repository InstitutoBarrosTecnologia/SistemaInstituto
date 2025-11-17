// Definição dos roles do sistema (baseado no backend)
export const USER_ROLES = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador", 
  FUNCIONARIO: "Funcionario",
  COMERCIAL: "Comercial",
  FISIOTERAPEUTA: "Fisioterapeuta",
  ADMINISTRATIVO: "Administrativo",
  COORDENADOR_FISIOTERAPEUTA: "CoordenadorFisioterapeuta",
  FINANCEIRO: "Financeiro"
} as const;

// Tipo para os roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Configuração de permissões por menu/funcionalidade
export const MENU_PERMISSIONS = {
  // Dashboard - todos os perfis têm acesso
  DASHBOARD: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA
  ],
  
  // Agenda - todos exceto Cliente
  AGENDA: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA
  ],
  
  // WhatsApp - Comercial e Administradores
  WHATSAPP: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL
  ],
  
  // Pacientes - Fisioterapeuta, Funcionário e Administradores
  PACIENTES: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA
  ],
  
  // Funcionários - Administradores, Administrativo, Comercial e Fisioterapeuta (apenas submenu /form-employee removido para Fisioterapeuta)
  FUNCIONARIOS: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA
  ],
  
  // Unidades/Filiais - apenas Administradores
  UNIDADES: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO
  ],
  
  // Categoria de Serviços - apenas Administradores
  CATEGORIA_SERVICO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO
  ],
  
  // Sub Categoria de Serviços - Comercial e Administradores
  SUB_CATEGORIA_SERVICO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL
  ],
  
  // Tratamento e Sessão - apenas Administradores
  TRATAMENTO_SESSAO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO
  ],
  
  // Formulário de Funcionários (/form-employee) - sem Fisioterapeuta e Coordenador Fisioterapeuta
  FORM_FUNCIONARIOS: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FUNCIONARIO
  ],
  
  // Dashboard Financeiro - todos exceto Fisioterapeuta e Coordenador Fisioterapeuta
  DASHBOARD_FINANCEIRO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.FINANCEIRO
  ],
  
  // Dashboard Operação - todos os perfis
  DASHBOARD_OPERACAO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA,
    USER_ROLES.FINANCEIRO
  ],
  
  // Dashboard Lead - todos exceto Fisioterapeuta e Coordenador Fisioterapeuta
  DASHBOARD_LEAD: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FUNCIONARIO
  ],

  // Módulo Financeiro - Administradores e Financeiro
  FINANCEIRO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.FINANCEIRO
  ],

  // Financeiro - Despesas
  FINANCEIRO_DESPESAS: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.FINANCEIRO
  ],

  // Módulo Notificações - apenas Administradores
  NOTIFICACOES: [
    USER_ROLES.ADMINISTRADOR
  ],

  // Notificações - Enviar
  NOTIFICACOES_ENVIAR: [
    USER_ROLES.ADMINISTRADOR
  ],

  // Logs - Rastreabilidade (apenas Administradores)
  LOGS: [
    USER_ROLES.ADMINISTRADOR
  ]
} as const;

// Função para verificar se o usuário tem permissão para um menu específico
export const hasPermissionForMenu = (userRoles: string | string[] | null, menuPermissions: readonly string[]): boolean => {
  if (!userRoles) return false;
  
  // Se userRoles é um array, verifica se algum dos roles tem permissão
  if (Array.isArray(userRoles)) {
    return userRoles.some(role => menuPermissions.includes(role));
  }
  
  // Se é string única, verifica se está nas permissões
  return menuPermissions.includes(userRoles);
};

// Função para obter o(s) role(s) do usuário a partir do token JWT
// Retorna string se for único role, ou array se forem múltiplos
export const getUserRoleFromToken = (token: string | null): string | string[] | null => {
  if (!token) return null;
  
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    
    // O role pode estar em diferentes propriedades do JWT
    return decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
};

// Função auxiliar para verificar se o usuário tem um role específico
export const userHasRole = (userRoles: string | string[] | null, targetRole: string): boolean => {
  if (!userRoles) return false;
  
  if (Array.isArray(userRoles)) {
    return userRoles.includes(targetRole);
  }
  
  return userRoles === targetRole;
};

// Função para obter o ID do funcionário a partir do token JWT
export const getUserFuncionarioIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    
    // Buscar funcionarioId no token - pode estar em diferentes propriedades
    return decoded.funcionarioId || decoded.FuncionarioId || decoded.IdUserLogin || null;
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
};

// Função para verificar se o usuário deve ter filtro aplicado na agenda
// CoordenadorFisioterapeuta pode ver todos os agendamentos
// Fisioterapeuta sem ser coordenador vê apenas seus próprios agendamentos
export const shouldApplyAgendaFilter = (userRoles: string | string[] | null): boolean => {
  if (!userRoles) return false;
  
  // Se é coordenador fisioterapeuta, não aplica filtro (vê todos)
  if (userHasRole(userRoles, USER_ROLES.COORDENADOR_FISIOTERAPEUTA)) {
    return false;
  }
  
  // Se é fisioterapeuta (mas não coordenador), aplica filtro
  return userHasRole(userRoles, USER_ROLES.FISIOTERAPEUTA);
};
