import { ReactElement } from "react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function NotificationsPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-4">Benachrichtigungen</h1>
      <p>Hier kannst du deine Benachrichtigungseinstellungen anpassen. (Dummy‐Inhalt)</p>
    </div>
  );
}

NotificationsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
