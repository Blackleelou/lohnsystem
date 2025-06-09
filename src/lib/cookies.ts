// lib/cookies.ts

export type ConsentType = "essentiell" | "statistik" | "marketing";

export function hasConsent(type: ConsentType): boolean {
  if (typeof window === "undefined") return false; // nur im Browser prüfen
  try {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) return false;
    const consent = JSON.parse(stored);
    return !!consent[type];
  } catch {
    return false;
  }
}
