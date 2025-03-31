import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import WhatsappTableLeadComponent from "../../components/tables/WhatsappTableLeadComponent/WhatsappTableLeadComponent";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Instituto Barros - WhatsappLead"
        description="Página do sistema Instituto Barros, para gerenciamento de lead"
      />
      <PageBreadcrumb pageTitle="Whatsapp" />
      <div className="space-y-6">
        <ComponentCard title="Atendimentos">
          <WhatsappTableLeadComponent />
        </ComponentCard>
      </div>
    </>
  );
}
