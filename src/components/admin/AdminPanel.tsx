// src/components/admin/AdminPanel.tsx

import React from 'react';
import { AdminContext, AdminUI, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';
import { authProvider } from '../authProvider'; // falls du Auth nutzt

const dataProvider = simpleRestDataProvider('/api'); // Deine API-URL

const AdminPanel: React.FC = () => (
  <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
    <AdminUI>
      <Resource name="users" list={ListGuesser} />
      <Resource name="posts" list={ListGuesser} />
      {/* Weitere Ressourcen hier */}
    </AdminUI>
  </AdminContext>
);

export default AdminPanel;
