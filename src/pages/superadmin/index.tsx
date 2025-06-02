const SuperadminLayout = dynamic(() => import("@/components/superadmin/SuperadminLayout"), { ssr: false });

export default function SuperpanelPage() {
  // Damit auch Kinder (children) gerendert werden, z.B. ein Willkommenstext:
  return (
    <SuperadminLayout>
      <div className="text-center p-6">
        Willkommen im Superadmin-Bereich!
      </div>
    </SuperadminLayout>
  );
}
