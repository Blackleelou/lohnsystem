// src/components/admin/AdminPanel.tsx

import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestDataProvider from 'ra-data-simple-rest';
import { authProvider } from '../authProvider'; // falls du eins nutzt

const dataProvider = simpleRestDataProvider('/api'); // Deine API-URL anpassen

export const AdminPanel: React.FC = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider} // falls du Auth nutzt
  >
    <Resource name="users" list={ListGuesser} />
    <Resource name="posts" list={ListGuesser} />
    {/* Weitere Ressourcen hier */}
  </Admin>
);

export default AdminPanel;
