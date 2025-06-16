// src/components/admin/AdminPanel.tsx

import { AdminContext, AdminUI, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestDataProvider('/api/admin');

export default function AdminPanel() {
  return (
    <AdminContext dataProvider={dataProvider}>
      <AdminUI>
        <Resource name="users" list={ListGuesser} />
        <Resource name="shifts" list={ListGuesser} />
        <Resource name="payrules" list={ListGuesser} />
      </AdminUI>
    </AdminContext>
  );
}
