// src/components/admin/AdminPanel.tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

export default function AdminPanel() {
  return (
    <Admin dataProvider={simpleRestProvider('/api/admin')}>
      <Resource name="users" list={ListGuesser} />
      <Resource name="shifts" list={ListGuesser} />
      <Resource name="payrules" list={ListGuesser} />
    </Admin>
  );
}
