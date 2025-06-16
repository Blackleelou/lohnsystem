// src/components/admin/AdminPanel.tsx
import { AdminUI, Resource, ListGuesser } from 'react-admin';
import { AdminContext } from 'react-admin-core';
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
