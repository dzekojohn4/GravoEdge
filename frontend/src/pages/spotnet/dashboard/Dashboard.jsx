"use client";
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { ReactComponent as EthIcon } from "assets/icons/ethereum.svg";
import { ReactComponent as UsdIcon } from "assets/icons/usd_coin.svg";
import { ReactComponent as HealthIcon } from "assets/icons/health.svg";
import { ReactComponent as CollateralIcon } from "assets/icons/collateral_dynamic.svg";
import { ReactComponent as BorrowIcon } from "assets/icons/borrow_dynamic.svg";
import { ReactComponent as TelegramIcon } from "assets/icons/telegram_dashboard.svg";
import Spinner from "components/spinner/Spinner";
import useDashboardData from "hooks/useDashboardData";
import { useClosePosition } from "hooks/useClosePosition";

export default function Component({ walletId }) {
  const [isCollateralActive, setIsCollateralActive] = useState(true);
  const { data, isLoading } = useDashboardData(walletId);
  const {
    mutate: closePositionEvent,
    isLoading: isClosing,
    error: closePositionError,
  } = useClosePosition(walletId);

  const [healthFactor, setHealthFactor] = useState("0.00");
  const [startSum, setStartSum] = useState(2);
  const [currentSum, setCurrentSum] = useState(1);

  useEffect(() => {
    const getData = async () => {
      if (!walletId) {
        console.error("getData: walletId is undefined");
        return;
      }

      if (!data || !data.zklend_position) {
        console.error("Data is missing or incorrectly formatted");
        return;
      }

      if (data.zklend_position.products) {
        const healthRatio = data.zklend_position.products[0].health_ratio;
        setHealthFactor(healthRatio);
        setCurrentSum(data.current_sum);
        setStartSum(data.start_sum);
      }
    };

    getData();
  }, [walletId, data]);

  const getCurrentSumColor = () => {
    if (currentSum > startSum) return "current-sum-green";
    if (currentSum < startSum) return "current-sum-red";
    return ""; 
  };

  return (
    <div className="dashboard-wrapper">
      {isLoading && <Spinner loading={isLoading} />}
      <div className="dashboard-container">
        <h1 className="dashboard-title">zkLend Position</h1>

        {/* Top Cards */}
        <div className="top-cards">
          <div className="card">
            <div className="card-header">
              <HealthIcon className="icon" />
              <span className="label">Health Factor</span>
            </div>
            <div className="card-value">{healthFactor}</div>
          </div>

          <div className="card">
            <div className="card-header">
              <EthIcon className="icon" />
              <span className="label">Borrow Balance</span>
            </div>
            <div className="card-value">$0.00</div>
          </div>
        </div>

        <div className="main-card">
          <div className="tabs">
            <button
              onClick={() => setIsCollateralActive(true)}
              className={`tab ${isCollateralActive ? "active" : ""}`}
            >
              <CollateralIcon className="tab-icon" />
              Collateral & Earnings
              {isCollateralActive && (
                <div className="tab-indicator collateral" />
              )}
            </button>

            <div className="tab-divider" />

            <button
              onClick={() => setIsCollateralActive(false)}
              className={`tab ${!isCollateralActive ? "active borrow" : ""}`}
            >
              <BorrowIcon className="tab-icon" />
              Borrow
              {!isCollateralActive && (
                <div className="tab-indicator borrow" />
              )}
            </button>
          </div>

          {isCollateralActive ? (
            <div className="tab-content">
              <div className="currency-info">
                <EthIcon className="icon" />
                <span className="currency-name">Ethereum</span>
              </div>

              <div className="balance-info">
                <span>Balance: $0.00</span>
                <span>Start sum: ${startSum}</span>
                <span className={getCurrentSumColor()}>
                  Current sum: ${currentSum}
                </span>
              </div>
            </div>
          ) : (
            <div className="tab-content">
              <div className="currency-info">
                <UsdIcon className="icon" />
                <span className="currency-name">USD Coin</span>
              </div>
              <span className="balance-value">Balance: $0.00</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <button
          className="redeem-button"
          onClick={() => closePositionEvent()}
          disabled={isClosing}
        >
          {isClosing ? "Closing..." : "Redeem"}
        </button>
        {closePositionError && (
          <div>Error: {closePositionError.message}</div>
        )}

        <button className="telegram-button">
          <TelegramIcon className="tab-icon" />
          Enable telegram notification bot
        </button>
      </div>
    </div>
  );
}
