import React from 'react';
import { getUserRoleFromToken, MENU_PERMISSIONS, hasPermissionForMenu } from '../../services/util/rolePermissions';

// Componente temporário para debug do sistema de roles
const RoleDebug: React.FC = () => {
  const token = localStorage.getItem("token");
  const userRole = getUserRoleFromToken(token);

  const testMenus = [
    { name: 'Dashboard', permissions: MENU_PERMISSIONS.DASHBOARD },
    { name: 'Agenda', permissions: MENU_PERMISSIONS.AGENDA },
    { name: 'WhatsApp', permissions: MENU_PERMISSIONS.WHATSAPP },
    { name: 'Pacientes', permissions: MENU_PERMISSIONS.PACIENTES },
    { name: 'Funcionários', permissions: MENU_PERMISSIONS.FUNCIONARIOS },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">Debug de Roles</h3>
      <p><strong>Token exists:</strong> {token ? 'Sim' : 'Não'}</p>
      <p><strong>User Role:</strong> {userRole || 'Não detectado'}</p>
      
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Permissões de Menu:</h4>
        {testMenus.map((menu, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded mb-1">
            <span>{menu.name}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              userRole && hasPermissionForMenu(userRole, menu.permissions) 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {userRole && hasPermissionForMenu(userRole, menu.permissions) ? 'Permitido' : 'Negado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleDebug;
