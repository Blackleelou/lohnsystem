import Layout from '@/components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700">Hier kommt deine Lohnübersicht hin.</p>
      </div>
    </Layout>
  );
}
