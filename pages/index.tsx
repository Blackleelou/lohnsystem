import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookieSet = document.cookie.includes("userId=");
    if (!cookieSet) {
      router.push("/login");
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Willkommen auf der Startseite!</h1>
      <p>Diese Seite leitet automatisch zum Login, wenn du nicht eingeloggt bist.</p>
    </div>
  );
}
