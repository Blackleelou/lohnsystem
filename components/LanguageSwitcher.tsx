import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const changeLanguage = (lang: string) => {
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
      <span onClick={() => changeLanguage("de")} style={{ cursor: "pointer" }}>🇩🇪</span>
      <span onClick={() => changeLanguage("en")} style={{ cursor: "pointer" }}>🇬🇧</span>
    </div>
  );
}