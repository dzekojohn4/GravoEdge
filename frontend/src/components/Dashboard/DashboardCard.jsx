import React from 'react';
import 'pages/spotnet/dashboard/dashboard.css';

const DashboardCard = ({ card }) => {
  const { title, icon: Icon, currencyIcon: CurrencyIcon, currencyName, balance } = card;

  const isCollateral = title === 'Collateral & Earnings';
  const colorStyle = isCollateral ? 'var(--collateral-color)' : 'var(--borrow-color)';

  return (
    <div className="card card-custom-styles d-flex flex-column align-item-center card-shadow">
      <header className="card-header bg-custom-color text-light text-center">
        <div className="d-flex align-items-center justify-content-center">
          <Icon className="card-icons" />
          <h2 className="ms-2 icon-text-gap mb-0 text-style" style={{ color: colorStyle }}>
            {title}
          </h2>
        </div>
      </header>
      <div className="card-body card-body-custom">
        <div className="d-flex flex-column align-items-center bg-custom-color rounded p-3">
          <div className="d-flex align-items-center mb-3">
            <CurrencyIcon className="card-icons" />
            <span className="ms-2 icon-text-gap text-style">{currencyName}</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="dashboard-text-color balance-text-size">Balance:</span>
            <span className="ms-2 icon-text-gap text-style" style={{ color: colorStyle }}>
              {balance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
