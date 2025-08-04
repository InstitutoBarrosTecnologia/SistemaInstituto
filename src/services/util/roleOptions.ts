import { USER_ROLES } from './rolePermissions';

// Interface para as opções do select
export interface RoleOption {
  label: string;
  value: string;
}

// Função para obter as opções de perfil para o formulário de funcionário
export const getRoleOptionsForEmployeeForm = (): RoleOption[] => {
  return [
    { label: "Administrativo", value: USER_ROLES.ADMINISTRATIVO },
    { label: "Comercial", value: USER_ROLES.COMERCIAL },
    { label: "Fisioterapeuta", value: USER_ROLES.FISIOTERAPEUTA },
    { label: "Coordenador Fisioterapeuta", value: USER_ROLES.COORDENADOR_FISIOTERAPEUTA },
  ];
};
