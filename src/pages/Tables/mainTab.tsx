import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import MainPage from "../../components/tables/BasicTables/mainpage";

export default function MainTab() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="Home Page" />
                  <div className="space-y-6">
                        <ComponentCard title="Home Page">
                              <MainPage />
                        </ComponentCard>
                  </div>
            </>
      );
}
