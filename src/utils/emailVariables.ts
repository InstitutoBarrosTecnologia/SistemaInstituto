/**
 * Helper para substituição de variáveis em templates de email
 * 
 * VARIÁVEIS DISPONÍVEIS (Backend C# - EmailDispatchService.cs):
 * - {{nome_cliente}}        - Nome completo do cliente
 * - {{email_cliente}}       - Email do cliente
 * - {{telefone_cliente}}    - Telefone do cliente formatado
 * - {{cidade_cliente}}      - Cidade do cliente
 * - {{estado_cliente}}      - Estado (UF) do cliente
 * - {{cpf_cliente}}         - CPF do cliente formatado
 * - {{endereco_completo}}   - Endereço completo formatado (rua, número, complemento, bairro, cidade, estado, CEP)
 * - {{data_atual}}          - Data atual formatada (dd/MM/yyyy)
 * - {{ano_atual}}           - Ano atual (yyyy)
 * - {{empresa}}             - Nome da empresa (Instituto Barros)
 * - {{titulo}}              - Título/assunto do email
 * - {{conteudo}}            - Conteúdo principal do email (usado nos templates)
 * - {{corpo}}               - Corpo/conteúdo do email (usado quando não há template)
 * - {{cta_texto}}           - Texto do botão de Call-to-Action (templates promocionais)
 * - {{cta_link}}            - Link do botão de Call-to-Action (templates promocionais)
 * - {{hora}}                - Hora atual formatada (HH:mm)
 * 
 * Nota: As variáveis são case-insensitive no backend ({{Nome_Cliente}} funciona igual a {{nome_cliente}})
 */

export interface EmailVariables {
  nome_cliente?: string;
  email_cliente?: string;
  telefone_cliente?: string;
  cidade_cliente?: string;
  estado_cliente?: string;
  cpf_cliente?: string;
  endereco_completo?: string;
  titulo?: string;
  corpo?: string;
  conteudo?: string;
  empresa?: string;
  ano_atual?: string;
  data_atual?: string;
  hora?: string;
  cta_texto?: string;
  cta_link?: string;
  [key: string]: string | undefined;
}

/**
 * Valores padrão para variáveis (usado no preview)
 */
export const DEFAULT_VARIABLES: EmailVariables = {
  nome_cliente: 'João Silva',
  email_cliente: 'joao.silva@email.com',
  telefone_cliente: '(11) 98765-4321',
  cidade_cliente: 'São Paulo',
  estado_cliente: 'SP',
  cpf_cliente: '123.456.789-00',
  endereco_completo: 'Rua Exemplo, nº 123, Centro, São Paulo, SP, CEP: 01234-567',
  titulo: 'Novidades do Instituto Barros',
  conteudo: '<p style="font-size: 16px; margin-bottom: 15px;">Temos <strong>ótimas novidades</strong> para você! Nossa equipe trabalha constantemente para oferecer o melhor atendimento.</p><p style="font-size: 16px;">Entre em contato conosco para saber mais!</p>',
  empresa: 'Instituto Barros',
  ano_atual: new Date().getFullYear().toString(),
  data_atual: new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }),
  hora: new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  cta_texto: 'Clique Aqui',
  cta_link: '#',
};

/**
 * Substitui variáveis em um template HTML
 * Variáveis no formato: {{nome_variavel}}
 * 
 * @param template - String HTML com variáveis
 * @param variables - Objeto com valores das variáveis
 * @param useDefaults - Se true, usa valores padrão para variáveis não fornecidas
 * @returns HTML com variáveis substituídas
 */
export function replaceVariables(
  template: string,
  variables: EmailVariables = {},
  useDefaults: boolean = true
): string {
  if (!template) return '';

  // Merge com valores padrão se useDefaults = true
  const values = useDefaults 
    ? { ...DEFAULT_VARIABLES, ...variables }
    : variables;

  // Substitui todas as variáveis no formato {{variavel}}
  let result = template;
  
  Object.keys(values).forEach(key => {
    const value = values[key] ?? '';
    // Usa regex global para substituir todas as ocorrências
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
}

/**
 * Extrai nomes de todas as variáveis presentes em um template
 * 
 * @param template - String HTML com variáveis
 * @returns Array com nomes das variáveis encontradas
 */
export function extractVariables(template: string): string[] {
  if (!template) return [];
  
  const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
  const matches = template.matchAll(regex);
  const variables = new Set<string>();
  
  for (const match of matches) {
    variables.add(match[1]);
  }
  
  return Array.from(variables);
}

/**
 * Valida se todas as variáveis obrigatórias estão presentes
 * 
 * @param template - String HTML com variáveis
 * @param providedVariables - Variáveis fornecidas pelo usuário
 * @param requiredVariables - Lista de variáveis obrigatórias
 * @returns Array com variáveis obrigatórias faltantes
 */
export function validateVariables(
  template: string,
  providedVariables: EmailVariables,
  requiredVariables: string[] = []
): string[] {
  const templateVars = extractVariables(template);
  const missing: string[] = [];
  
  requiredVariables.forEach(varName => {
    if (templateVars.includes(varName) && !providedVariables[varName]) {
      missing.push(varName);
    }
  });
  
  return missing;
}

/**
 * Formata nome de variável para exibição amigável
 * Ex: "nome_cliente" -> "Nome do Cliente"
 * 
 * @param variableName - Nome da variável
 * @returns Nome formatado
 */
export function formatVariableName(variableName: string): string {
  return variableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Cria um objeto de variáveis a partir de dados do cliente
 * Útil para o backend ao enviar emails reais
 * 
 * @param customerData - Dados do cliente
 * @param customVars - Variáveis customizadas adicionais
 * @returns Objeto com variáveis preenchidas
 */
export function createVariablesFromCustomer(
  customerData: {
    nome?: string;
    email?: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
    cpf?: string;
    [key: string]: any;
  },
  customVars: EmailVariables = {}
): EmailVariables {
  const now = new Date();
  
  return {
    nome_cliente: customerData.nome || 'Cliente',
    email_cliente: customerData.email || '',
    telefone_cliente: customerData.telefone || '',
    cidade_cliente: customerData.cidade || '',
    estado_cliente: customerData.estado || '',
    cpf_cliente: customerData.cpf || '',
    empresa: 'Instituto Barros',
    ano_atual: now.getFullYear().toString(),
    data_atual: now.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    hora: now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    ...customVars,
  };
}

/**
 * Sanitiza HTML para prevenir XSS
 * Remove scripts e atributos potencialmente perigosos
 * 
 * @param html - HTML a ser sanitizado
 * @returns HTML sanitizado
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Remove tags script
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove atributos on* (onclick, onload, etc)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: nos hrefs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  
  return sanitized;
}
