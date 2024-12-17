import React, { useEffect } from 'react';
import './position_history.css';
import newIcon from '../../../assets/icons/borrow-balance-icon.png';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { usePositionHistoryTable } from 'hooks/usePosition';
import Spinner from 'components/spinner/Spinner';
import { formatDate } from 'utils/formatDate';
import { useWalletStore } from 'stores/useWalletStore';

function PositionHistory() {
  const { walletId } = useWalletStore();

  const { data, isLoading } = usePositionHistoryTable(walletId);

  useEffect(() => {
    console.log('Fetching data for walletId:', walletId);
  }, [walletId]);

  return (
    <div className="position-wrapper">
      <div className="position-container">
        <h1 className="position-title">zkLend Position History</h1>
        <div className="position-content">
          <div className="position-top-cards">
            <div className="position-card">
              <div className="position-card-header">
                <HealthIcon className="icon" />
                <span className="label">Health Factor</span>
              </div>
              <div className="position-card-value">
                <span className="top-card-value">1.47570678</span>
              </div>
            </div>
            <div className="position-card">
              <div className="position-card-header">
                <img src={newIcon} alt="Borrow Balance Icon" className="icon" />{' '}
                <span className="label">Borrow Balance</span>
              </div>
              <div className="position-card-value">
                <span className="currency-symbol">$</span>
                <span className="top-card-value">-55.832665</span>
              </div>
            </div>
          </div>
        </div>

        <div className="position-content-table">
          <div className="position-table-title">
            <p>Position History</p>
          </div>

          <div className="position-table">
            {isLoading ? (
              <div className="spinner-container">
                <Spinner loading={isLoading} />
              </div>
            ) : (
              <table className="text-white">
                <thead>
                  <tr>
                    <th></th>
                    <th>Token</th>
                    <th>Amount</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Start Price</th>
                    <th>Multiplier</th>
                    <th>Liquidated</th>
                    <th>Closed At</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((data, index) => (
                    <tr key={index}>
                      <td className="index">{index + 1}.</td>
                      <td>{data.token_symbol.toUpperCase()}</td>
                      <td>{Number(data.amount).toFixed(2)}</td>
                      <td>{formatDate(data.created_at)}</td>
                      <td>{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</td>
                      <td>${data.start_price.toFixed(2)}</td>
                      <td>{data.multiplier.toFixed(1)}</td>
                      <td>{data.is_liquidated ? 'Yes' : 'No'}</td>
                      <td>
                        {data.datetime_liquidation ? new Date(data.datetime_liquidation).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionHistory;
