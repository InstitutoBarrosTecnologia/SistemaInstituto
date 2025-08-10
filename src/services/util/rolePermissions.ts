// Definição dos roles do sistema (baseado no backend)
export const USER_ROLES = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador", 
  FUNCIONARIO: "Funcionario",
  COMERCIAL: "Comercial",
  FISIOTERAPEUTA: "Fisioterapeuta",
  ADMINISTRATIVO: "Administrativo",
  COORDENADOR_FISIOTERAPEUTA: "CoordenadorFisioterapeuta"
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
    USER_ROLES.FUNCIONARIO
  ],
  
  // Dashboard Operação - todos os perfis
  DASHBOARD_OPERACAO: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FISIOTERAPEUTA,
    USER_ROLES.FUNCIONARIO,
    USER_ROLES.COORDENADOR_FISIOTERAPEUTA
  ],
  
  // Dashboard Lead - todos exceto Fisioterapeuta e Coordenador Fisioterapeuta
  DASHBOARD_LEAD: [
    USER_ROLES.ADMINISTRADOR,
    USER_ROLES.ADMINISTRATIVO,
    USER_ROLES.COMERCIAL,
    USER_ROLES.FUNCIONARIO
  ],

  // Módulo Financeiro - apenas Administradores
  FINANCEIRO: [
    USER_ROLES.ADMINISTRADOR
  ],

  // Financeiro - Despesas
  FINANCEIRO_DESPESAS: [
    USER_ROLES.ADMINISTRADOR
  ],

  // Módulo Notificações - apenas Administradores
  NOTIFICACOES: [
    USER_ROLES.ADMINISTRADOR
  ],

  // Notificações - Enviar
  NOTIFICACOES_ENVIAR: [
    USER_ROLES.ADMINISTRADOR
  ]
} as const;

// Função para verificar se o usuário tem permissão para um menu específico
export const hasPermissionForMenu = (userRole: string, menuPermissions: readonly string[]): boolean => {
  return menuPermissions.includes(userRole);
};

// Função para obter o role do usuário a partir do token JWT
export const getUserRoleFromToken = (token: string | null): string | null => {
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
export const shouldApplyAgendaFilter = (userRole: string | null): boolean => {
  return userRole === USER_ROLES.FISIOTERAPEUTA;
};
