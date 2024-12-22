import React from 'react';
import { Outlet } from 'react-router-dom';
import './vaultLayout.css';
import Sidebar from 'components/ui/Components/Sidebar/Sidebar';

export function VaultLayout({ children }) {
  const vaultItems = [
    {
      id: 'home',
      name: 'Home',
      link: '/',
    },
    {
      id: 'stake ',
      name: 'Stake',
      link: '/stake',
    },
    {
      id: 'withdraw',
      name: 'Withdraw',
      link: '/withdraw',
    },
  ];
  return (
    <div className="layout">
      <Sidebar title="Vault" items={vaultItems} className="sidebar-docs-sticky" />
      <main>
        {children}
        <Outlet />
      </main>
    </div>
  );
}
