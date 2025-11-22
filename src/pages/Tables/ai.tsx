import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AiPage from "../../components/tables/BasicTables/aiTable";

export default function AiTables() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="AI Solution" />
                  <div className="space-y-6">
                        <ComponentCard title="AI Solution">
                              <AiPage />
                        </ComponentCard>
                  </div>
            </>
      );
}
