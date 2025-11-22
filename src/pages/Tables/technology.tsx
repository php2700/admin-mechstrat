import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TechnologyTab from "../../components/tables/BasicTables/technolgyTab";

export default function TechnologyTables() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="Technology" />
                  <div className="space-y-6">
                        <ComponentCard title="Technology">
                              <TechnologyTab />
                        </ComponentCard>
                  </div>
            </>
      );
}
