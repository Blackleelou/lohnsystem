// src/components/admin/AdminPanel.tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestDataProvider('/api/admin');

export default function AdminPanel() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={ListGuesser} />
      <Resource name="shifts" list={ListGuesser} />
      <Resource name="payrules" list={ListGuesser} />
    </Admin>
  );
}
