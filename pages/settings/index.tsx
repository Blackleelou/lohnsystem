import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SettingsPage() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Dein Konto wurde gelöscht.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error("Fehler beim Löschen des Kontos.");
      }
    } catch (err) {
      toast.error("Serverfehler.");
    }
  };

  return (
    <Layout>
      <h1>Einstellungen</h1>
      <p>Hier kannst du Sprache, Theme und weitere Einstellungen anpassen.</p>
      <button onClick={handleDeleteAccount} style={{ marginTop: 20 }}>
        Konto löschen
      </button>
      <ToastContainer position="bottom-right" />
    </Layout>
  );
}