// src/components/admin/AdminPanel.tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from '@react-admin/ra-data-simple-rest';
import authProvider from '@/lib/admin/authProvider';

const dataProvider = simpleRestDataProvider('/api');

export default function AdminPanel() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" list={ListGuesser} />
      <Resource name="posts" list={ListGuesser} />
    </Admin>
  );
}
