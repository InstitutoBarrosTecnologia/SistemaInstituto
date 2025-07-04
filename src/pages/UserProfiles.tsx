import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Sistema Instituto Barros - Página para gerenciamento de perfil"
      />

      <PageBreadcrumb pageTitle="Perfil Instituto Barros" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
        </div>
      </div>
    </>
  );
}
