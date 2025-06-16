// src/components/admin/AdminPanel.tsx

import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';              // Admin statt AdminUI
import simpleRestDataProvider from 'ra-data-simple-rest';
import { authProvider } from '../authProvider';                         // falls du eins nutzt

const dataProvider = simpleRestDataProvider('/api');                   // passe deine API-URL an

export const AdminPanel: React.FC = () => (
  <Admin 
    dataProvider={dataProvider} 
    authProvider={authProvider}                                      // optional
  >
    <Resource name="users" list={ListGuesser} />
    <Resource name="posts" list={ListGuesser} />
    {/* weitere Ressourcen */}
  </Admin>
);

export default AdminPanel;
