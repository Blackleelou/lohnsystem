import SuperadminLayout from "@/components/SuperadminLayout";
import CompanyAdmin from "@/components/Superadmin/CompanyAdmin"; // ← wie gerade gebaut

export default function SuperadminCompaniesPage() {
  return (
    <SuperadminLayout>
      <CompanyAdmin />
    </SuperadminLayout>
  );
}
