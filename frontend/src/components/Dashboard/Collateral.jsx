import React from "react"
import './collateral.css';
import { ReactComponent as CollateralIcon } from 'assets/icons/collateral_dynamic.svg';
import zkland_svg from "../../assets/icons/Vector.svg"

function Collateral({data,startSum,currentSum,getCurrentSumColor}){
    return (
        <div className="tab-content">
                <div className="balance-info">
                  <div className="currency-info">
                    {React.createElement(data[0]?.currencyIcon || CollateralIcon, {
                      className: 'icon',
                    })}
                    <span className="currency-name">{data[0]?.currencyName || 'N/A'}</span>
                  </div>
                  <span>
                    <span className="balance-label">Balance: </span>
                    <span className="balance-value">
                      {data[0]?.balance ? Number(data[0].balance).toFixed(8) : '0.00'}
                    </span>
                  </span>
                  <span>
                    <span className="balance-label">Start sum: </span>
                    <span className="balance-value">
                      <span className="currency-symbol">$</span>
                      {startSum ? Number(startSum).toFixed(0) : '0.00'}
                    </span>
                  </span>
                  <span>
                    <span className="balance-label">Current sum: </span>
                    <span className={currentSum === 0 ? 'current-sum-green' : getCurrentSumColor()}>
                      <span className="currency-symbol">$</span>
                      {currentSum ? Number(currentSum).toFixed(0) : '200'}
                      <img src={zkland_svg} className="up-icon" />
                    </span>
                  </span>
                </div>
              </div>
    )
}

export default Collateral