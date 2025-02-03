import React from 'react';
import Sidebar from '@/components/layout/sidebar/Sidebar';
// import './DashboardLayout.css';
import clockIcon from '@/assets/icons/clock.svg';
import computerIcon from '@/assets/icons/computer-icon.svg';
import depositIcon from '@/assets/icons/deposit.svg';
import withdrawIcon from '@/assets/icons/withdraw.svg';

const dashboardItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    link: '/dashboard',
    icon: computerIcon,
  },
  {
    id: 'position_history',
    name: 'Position History',
    link: '/dashboard/position-history',
    icon: clockIcon,
  },
  {
    id: 'deposit',
    name: 'Add Deposit',
    link: '/dashboard/deposit',
    icon: depositIcon,
  },
  {
    id: 'withdraw',
    name: 'Withdraw All',
    link: '/dashboard/withdraw',
    icon: withdrawIcon,
  },
];

export default function DashboardLayout({ children, title = 'zkLend Position' }) {
  return (
    <div className="flex min-h-screen w-screen md:justify-center lg:ml-[372px] lg:w-[calc(100vw-372px)]">
      <Sidebar items={dashboardItems} />
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="mt-24 mb-12 flex h-full w-full flex-col justify-center gap-2.5 p-6 pt-5 md:w-auto md:max-w-none">
          <h1 className="text-second-primary mt-4 text-center text-2xl font-semibold">{title}</h1>
          <div className="text-second-primary flex w-full flex-col justify-center gap-6 rounded-2xl text-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
