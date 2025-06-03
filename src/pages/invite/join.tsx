import Layout from "@/components/common/Layout";

export default function JoinInvitePage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-200">Mit Einladungslink beitreten</h1>
        <p className="mb-4">
          <b>Hier kannst du dem Team mit deinem Einladungslink beitreten.</b>
        </p>
        <div className="text-gray-400 text-sm">
          <i>Demnächst kannst du hier den Link eingeben oder einen QR-Code scannen.</i>
        </div>
      </div>
    </Layout>
  );
}
