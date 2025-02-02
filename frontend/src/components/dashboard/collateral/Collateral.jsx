import React from 'react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import { TrendingDown, TrendingUp } from 'lucide-react';

function Collateral({ data, startSum, currentSum, getCurrentSumColor }) {
  return (
    <div className="h-fit w-full text-left text-base font-normal">
      <div className="flex h-fit w-fit flex-col gap-2 text-base">
        <div className="flex items-center">
          {React.createElement(data[0]?.currencyIcon || CollateralIcon, {
            className: 'w-8 h-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-2',
          })}

          <span className="text-secondary text-lg">{data[0]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="font-normal text-gray-500">Balance: </span>
          <span className="text-secondary ml-1">{data[0]?.balance ? Number(data[0].balance).toFixed(8) : '0.00'}</span>
        </span>
        <span>
          <span className="font-normal text-gray-500">Start sum: </span>
          <span className="text-secondary ml-1">
            <span className="mr-1">$</span>
            {startSum ? Number(startSum).toFixed(2) : '0.00'}
          </span>
        </span>
        <span className="flex">
          <span className="mr-2 font-normal text-gray-500">Current sum: </span>
          <span className={`flex ${currentSum > 0 ? 'text-green-500' : getCurrentSumColor()}`}>
            <span>$</span>
            {currentSum ? Number(currentSum).toFixed(8) : '0.00'}
            {currentSum > startSum && currentSum !== 0 && <TrendingUp className="ml-2 h-6 w-6 text-green-500" />}
            {currentSum < startSum && currentSum !== 0 && <TrendingDown className="ml-2 h-6 w-6 text-red-500" />}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Collateral;
