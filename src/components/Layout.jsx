import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', background: '#f9f9f9' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
