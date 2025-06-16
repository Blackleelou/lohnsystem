import { AdminContext, AdminUI } from '@react-admin/core';
import { Resource, ListGuesser } from '@react-admin/ra-rsc';
import simpleRestDataProvider from 'ra-data-simple-rest';
import authProvider from '@/lib/admin/authProvider';

const dataProvider = simpleRestDataProvider('/api/admin');

export default function AdminPanel() {
  return (
    <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
      <AdminUI>
        <Resource name="users" list={ListGuesser} />
        <Resource name="shifts" list={ListGuesser} />
        <Resource name="payrules" list={ListGuesser} />
      </AdminUI>
    </AdminContext>
  );
}
