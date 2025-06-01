import { Admin, Resource, ListGuesser } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import SuperpanelLayout from "./SuperpanelLayout";

export default function Superpanel() {
  return (
    <SuperpanelLayout>
      <div style={{ height: "700px" }}>
        <Admin dataProvider={simpleRestProvider("/api/admin")}>
          <Resource name="superadminboardentrys" list={ListGuesser} />
        </Admin>
      </div>
    </SuperpanelLayout>
  );
}
