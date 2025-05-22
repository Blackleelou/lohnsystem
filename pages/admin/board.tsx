import SuperadminLayout from "@/components/SuperadminLayout";
// ... (Rest bleibt gleich)

export default function BoardPage() {
  // ...
  return (
    <SuperadminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Superadmin Board</h1>
        {/* ... */}
      </div>
    </SuperadminLayout>
  );
}
