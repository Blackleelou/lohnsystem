import { ReactElement } from "react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function SecurityPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-4">Sicherheit</h1>
      <p>Hier kannst du dein Passwort ändern und 2FA einrichten. (Dummy‐Inhalt)</p>
    </div>
  );
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
