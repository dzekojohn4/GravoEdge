import React, { useState } from 'react';
import { ReactComponent as Star } from 'assets/particles/star.svg';
import { useDashboardData } from 'hooks/useDashboardData';
import { useClosePosition } from 'hooks/useClosePosition';
import Spinner from 'components/spinner/Spinner';
import './dashboard.css';

const Dashboard = ({ walletId }) => {
  const starData = [
    { top: 1, left: 0, size: 1.5 },
    { top: 75, left: 35, size: 2.5 },
    { top: -2, left: 94, size: 5.5 },
  ];

  const [startSum] = useState(0);
  const { cardData, healthFactor, currentSum, isLoading } = useDashboardData(walletId);
  const closePositionMutation = useClosePosition(walletId);

  const getCurrentSumColor = () => {
    if (startSum === currentSum) return '';
    return currentSum < startSum ? 'current-sum-red' : 'current-sum-green';
  };

  return (
    <div className="dashboard-container position-relative container">
      {isLoading && <Spinner loading={isLoading} />}

      {starData.map((star, index) => (
        <Star
          key={index}
          className="dashboard-star"
          style={{
            '--star-top': `${star.top}%`,
            '--star-left': `${star.left}%`,
            '--star-size': `${star.size}%`,
          }}
        />
      ))}
      <div className="position-relative">
        <div className="background-gradient"></div>
        <div className="background-gradient"></div>
      </div>
      <h1 className="text-white text-center zkLend-text">zkLend Position</h1>
      <div className="card card-health-factor mx-auto d-flex flex-column align-items-center justify-content-center card-shadow">
        <div className="bg-custom-health d-flex align-items-center px-4 py-3 rounded bg-card-health">
          <span className="dashboard-text-color health-text-size">Health factor:</span>
          <span className="text-white text-style">{healthFactor}</span>
        </div>
      </div>
      <div className="mb-4 d-flex flex-row justify-content-center cards-custom">
        {cardData.map((card, index) => (
          <div key={index} className="card card-custom-styles d-flex flex-column align-item-center card-shadow">
            <header className="card-header bg-custom-color text-light text-center card-shadow">
              <div className="d-flex align-items-center justify-content-center">
                <card.icon className="card-icons rounded-circle" />
                <h1
                  className={`ms-2 icon-text-gap mb-0 text-style ${card.title === 'Borrow' ? 'borrow-text' : 'collateral-text'}`}
                >
                  {card.title}
                </h1>
              </div>
            </header>
            <div className="card-body card-body-custom">
              <div className="d-flex flex-column align-items-center bg-custom-color rounded">
                <div className="d-flex align-items-center mb-3">
                  <card.currencyIcon className="card-icons rounded-circle" />
                  <span className="ms-2 icon-text-gap text-style">{card.currencyName}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="dashboard-text-color balance-text-size">Balance:</span>
                  <span
                    className={`ms-2 icon-text-gap text-style ${card.title === 'Borrow' ? 'borrow-text' : 'collateral-text'}`}
                  >
                    {card.balance}
                  </span>
                </div>
                {card.title === 'Collateral & Earnings' && (
                  <div className="sum-info">
                    <span className="start-sum">Start sum: {startSum} $</span>
                    <span className="current-sum">
                      Current sum: <span className={getCurrentSumColor()}>{currentSum} $</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className="btn redeem-btn border-0" onClick={() => closePositionMutation.mutate()}>
          Redeem
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
