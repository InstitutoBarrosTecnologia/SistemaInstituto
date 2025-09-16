import { Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/WhatsappTableLeadComponent";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DashboardOperacao from "./pages/Dashboard/DashboardOperacao";
import DashboardLead from "./pages/Dashboard/DashboardLead";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import { MENU_PERMISSIONS } from "./services/util/rolePermissions";
import CustomerTables from "./pages/Tables/CustomerTable/CustomerTables";
import ServiceCategoryTables from "./pages/Tables/ServicesTable/ServiceCategoryTables";
import SubServiceCategoryTable from "./pages/Tables/ServicesTable/SubServiceCategoryTable";
import OrdemServiceTables from "./pages/Tables/OrderServiceTable/OrderServiceTables";
import EmployeeTables from "./pages/Tables/EmployeeTable/EmployeeTables";
import BranchOfficeTables from "./pages/Tables/BranchOfficeTable/BranchOfficeTables";
import { Despesas } from "./pages/Financeiro";
import Notifications from "./pages/Notificacoes/Notifications";

export default function App() {
  return (
    <>

      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/" element={<Home />} />
          <Route path="/dashboard-operacao" element={<DashboardOperacao />} />
          
          {/* Dashboard Lead - Sem acesso para Fisioterapeuta e Coordenador Fisioterapeuta */}
          <Route 
            path="/dashboard-lead" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.DASHBOARD_LEAD}>
                <DashboardLead />
              </RoleProtectedRoute>
            } 
          />

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/customer" element={<CustomerTables />} />

          {/* Financeiro - Apenas para Administradores */}
          <Route 
            path="/financeiro/despesas" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.FINANCEIRO_DESPESAS}>
                <Despesas />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Notificações - Apenas para Administradores */}
          <Route 
            path="/notificacoes/enviar" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.NOTIFICACOES_ENVIAR}>
                <Notifications />
              </RoleProtectedRoute>
            } 
          />
          


          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          
          {/* Form Funcionários - Administrador, Administrativo, Comercial, Funcionário */}
          <Route 
            path="/form-employee" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.FORM_FUNCIONARIOS}>
                <EmployeeTables />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Form Filiais - Apenas Administrador e Administrativo */}
          <Route 
            path="/form-branch" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.UNIDADES}>
                <BranchOfficeTables />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Form Categoria Serviços - Apenas Administrador e Administrativo */}
          <Route 
            path="/form-cat-servico" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.CATEGORIA_SERVICO}>
                <ServiceCategoryTables />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Form Sub Categoria Serviços - Administrador, Administrativo, Comercial */}
          <Route 
            path="/form-sub-cat-servico" 
            element={
              <RoleProtectedRoute requiredPermissions={MENU_PERMISSIONS.SUB_CATEGORIA_SERVICO}>
                <SubServiceCategoryTable />
              </RoleProtectedRoute>
            } 
          />
          <Route path="/ordem-servico" element={<OrdemServiceTables />} />


          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Rotas públicas */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  );
}
