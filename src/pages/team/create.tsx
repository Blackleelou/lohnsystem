import Layout from "@/components/common/Layout";

export default function CreateTeamPage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-violet-700 dark:text-violet-200">Team erstellen</h1>
        <p className="mb-4">
          <b>Hier entsteht das Formular für die Teamerstellung.</b>
        </p>
        <div className="text-gray-400 text-sm">
          <i>In Kürze kannst du dein Team benennen, Mitglieder einladen und Rechte festlegen!</i>
        </div>
      </div>
    </Layout>
  );
}
