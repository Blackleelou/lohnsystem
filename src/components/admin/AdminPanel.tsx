// src/components/AdminPanel.tsx
import { AdminContext, AdminUI, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

export default function AdminPanel() {
  return (
    <AdminContext dataProvider={simpleRestProvider('/api/admin')}>
      <AdminUI>
        <Resource name="users" list={ListGuesser} />
        <Resource name="shifts" list={ListGuesser} />
        <Resource name="payrules" list={ListGuesser} />
      </AdminUI>
    </AdminContext>
  );
}
