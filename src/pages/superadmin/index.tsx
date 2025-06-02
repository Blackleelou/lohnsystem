const SuperadminLayout = dynamic(
  () => import("@/components/superadmin/SuperadminLayout"),
  { ssr: false }
);

export default function SuperadminPage() {
  return (
    <SuperadminLayout>
      <div className="text-center p-6">
        Willkommen im Superadmin-Bereich!
      </div>
    </SuperadminLayout>
  );
}
