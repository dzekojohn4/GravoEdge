import React from 'react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import { TrendingDown, TrendingUp } from 'lucide-react';


function Collateral({ data, startSum, currentSum, getCurrentSumColor }) {
  return (
    <div className=" text-left text-base font-normal w-full  h-fit">
      <div className="flex flex-col gap-2 w-fit h-fit text-base">
        <div className="flex items-center">
          {React.createElement(data[0]?.currencyIcon || CollateralIcon, {
            className: 'w-8 h-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-2',
          })}
    
          <span className="text-lg text-secondary">{data[0]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="text-gray-500 font-normal">Balance: </span>
          <span className="text-secondary ml-1">
            {data[0]?.balance ? Number(data[0].balance).toFixed(8) : '0.00'}
          </span>
        </span>
        <span>
          <span className="text-gray-500 font-normal">Start sum: </span>
          <span className="text-secondary ml-1">
            <span className="mr-1">$</span>
            {startSum ? Number(startSum).toFixed(2) : '0.00'}
          </span>
        </span>
        <span>
          <span className="text-gray-500 font-normal">Current sum: </span>
          <span className={currentSum > 0 ? 'text-green-500' : getCurrentSumColor()}>
            <span className="mr-1">$</span>
            {currentSum ? Number(currentSum).toFixed(8) : '0.00'}
            {currentSum > startSum && currentSum !== 0 && <TrendingUp className="text-green-500 w-6 h-6 ml-2" />}
            {currentSum < startSum && currentSum !== 0 && <TrendingDown className="text-red-500 w-6 h-6 ml-2" />}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Collateral;
