// src/components/admin/AdminPanel.tsx

import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';
import { authProvider } from '../authProvider';

const dataProvider = simpleRestDataProvider('/api');

const AdminPanel: React.FC = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="users" list={ListGuesser} />
    <Resource name="posts" list={ListGuesser} />
    {/* Weitere Ressourcen hier */}
  </Admin>
);

export default AdminPanel;
