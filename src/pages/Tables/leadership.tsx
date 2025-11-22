import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LeadershipTable from "../../components/tables/BasicTables/leadershipTab";

export default function LeadershipTables() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="Leadership" />
                  <div className="space-y-6">
                        <ComponentCard title="Leadership">
                              <LeadershipTable />
                        </ComponentCard>
                  </div>
            </>
      );
}
