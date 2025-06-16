// src/components/admin/AdminPanel.tsx

import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';
import authProvider from '@/lib/admin/authProvider'; // Passe Pfad ggf. an

const dataProvider = simpleRestDataProvider('/api'); // API-Endpoint

const AdminPanel: React.FC = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="users" list={ListGuesser} />
    <Resource name="posts" list={ListGuesser} />
  </Admin>
);

export default AdminPanel;
