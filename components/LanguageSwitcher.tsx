import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const changeLanguage = (lang: string) => {
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  return (
    <div className="flex justify-center gap-2 text-xl">
      <button onClick={() => changeLanguage("de")} className="cursor-pointer hover:scale-105 transition-transform">
        🇩🇪
      </button>
      <button onClick={() => changeLanguage("en")} className="cursor-pointer hover:scale-105 transition-transform">
        🇬🇧
      </button>
    </div>
  );
}
