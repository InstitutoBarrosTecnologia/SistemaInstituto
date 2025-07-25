import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { 
  MENU_PERMISSIONS, 
  hasPermissionForMenu, 
  getUserRoleFromToken 
} from "../services/util/rolePermissions";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { 
    name: string; 
    path: string; 
    pro?: boolean; 
    new?: boolean;
    permissions?: readonly string[];
  }[];
  permissions?: readonly string[];
};

// Configuração completa do menu com permissões
const allNavItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Agenda",
    path: "/calendar",
    permissions: MENU_PERMISSIONS.AGENDA,
  },
  {
    name: "Whatsapp",
    icon: <GridIcon />,
    permissions: MENU_PERMISSIONS.WHATSAPP,
    subItems: [{ 
      name: "Atendimento", 
      path: "/basic-tables", 
      pro: false,
      permissions: MENU_PERMISSIONS.WHATSAPP,
    }],
  },
  {
    name: "Gestão",
    icon: <ListIcon />,
    subItems: [
      { 
        name: "Pacientes", 
        path: "/customer", 
        pro: false,
        permissions: MENU_PERMISSIONS.PACIENTES,
      },
      { 
        name: "Funcionários", 
        path: "/form-employee", 
        pro: false,
        permissions: MENU_PERMISSIONS.FORM_FUNCIONARIOS,
      },
      { 
        name: "Unidades", 
        path: "/form-branch", 
        pro: false,
        permissions: MENU_PERMISSIONS.UNIDADES,
      },
      { 
        name: "Cat. Serviço", 
        path: "/form-cat-servico", 
        pro: false,
        permissions: MENU_PERMISSIONS.CATEGORIA_SERVICO,
      },
      { 
        name: "Sub. Serviço", 
        path: "/form-sub-cat-servico", 
        pro: false,
        permissions: MENU_PERMISSIONS.SUB_CATEGORIA_SERVICO,
      },
      { 
        name: "Tratamento e Sessão", 
        path: "/ordem-servico", 
        pro: false,
        permissions: MENU_PERMISSIONS.TRATAMENTO_SESSAO,
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Funcionários",
    path: "/profile",
    permissions: MENU_PERMISSIONS.FUNCIONARIOS,
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    permissions: MENU_PERMISSIONS.DASHBOARD,
    subItems: [
      { 
        name: "Financeiro", 
        path: "/", 
        pro: false,
        permissions: MENU_PERMISSIONS.DASHBOARD_FINANCEIRO,
      },
      { 
        name: "Operação", 
        path: "/dashboard-operacao", 
        pro: false,
        permissions: MENU_PERMISSIONS.DASHBOARD_OPERACAO,
      },
      { 
        name: "Lead", 
        path: "/dashboard-lead", 
        pro: false,
        permissions: MENU_PERMISSIONS.DASHBOARD_LEAD,
      }
    ],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Obter role do usuário e filtrar itens do menu
  const userRole = getUserRoleFromToken(localStorage.getItem("token"));
  
  // Função para filtrar subitens baseado nas permissões
  const filterSubItems = useCallback((subItems: NavItem['subItems'], userRole: string | null) => {
    if (!subItems || !userRole) return [];
    
    return subItems.filter(subItem => {
      if (!subItem.permissions) return true; // Se não tem permissão definida, mostra para todos
      return hasPermissionForMenu(userRole, subItem.permissions);
    });
  }, []);

  // Filtrar itens do menu baseado no perfil do usuário usando useMemo
  const navItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!userRole) return false; // Se não tem role, não mostra nada
      
      // Se o item não tem permissões definidas, mostra para todos (fallback)
      if (!item.permissions) return true;
      
      // Verificar se o usuário tem permissão para o item principal
      const hasPermission = hasPermissionForMenu(userRole, item.permissions);
      
      // Se tem subitens, verificar se pelo menos um subitem tem permissão
      if (item.subItems && item.subItems.length > 0) {
        const filteredSubItems = filterSubItems(item.subItems, userRole);
        return hasPermission && filteredSubItems.length > 0;
      }
      
      return hasPermission;
    }).map(item => ({
      ...item,
      // Filtrar subitens também
      subItems: item.subItems ? filterSubItems(item.subItems, userRole) : undefined
    }));
  }, [userRole, filterSubItems]);

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/instituto-barros-logo-cinza.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/instituto-barros-logo-branco.webp"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>

      </div>
    </aside>
  );
};

export default AppSidebar;
