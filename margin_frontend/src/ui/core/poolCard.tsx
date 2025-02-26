// import { ReactNode } from 'react';
import { Button } from '../core/button';

interface PoolProps {
  pair: string;
  type: string;
  fee: string;
  liquidity: string;
  apy: string;
  risk: string;
  className?: string;
  layout?: 'card' | 'tableRow';
}

export default function PoolCard({
  pair,
  type,
  fee,
  liquidity,
  apy,
  risk,
  className = '',
  layout,
}: PoolProps) {
  if (layout === 'tableRow') {
    return (
      <table className="w-full border-collapse border border-navbg rounded-2xl">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-btnBorderColor text-sm">
              Pool
            </th>
            <th className="px-4 py-2 text-left text-btnBorderColor text-sm">
              APY
            </th>
            <th className="px-4 py-2 text-left text-btnBorderColor text-sm">
              Risk Level
            </th>
            <th className="px-4 py-2 text-left text-btnBorderColor text-sm">
              Liquidity
            </th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Pair Column */}
            <td className="px-4 py-2 flex items-center gap-3">
              <div className="flex">
                <img
                  src="src/assets/img/strkLogo.png"
                  alt=""
                  className="w-6 h-6"
                />
                <img
                  src="src/assets/img/ethLogo.png"
                  alt=""
                  className="w-6 h-6 z-10 ml-[-10px]"
                />
              </div>
              <div>
                <p>{pair}</p>
                <div className="flex gap-4">
                  <span>{type}</span>
                  <span>{fee}</span>
                </div>
              </div>
            </td>

            <td className="px-4 py-2 text-green-500">{apy}</td>
            <td className="px-4 py-2">{risk}</td>

            <td className="px-4 py-2">{liquidity}</td>
            {/* APY */}

            <td className="px-4 py-2">
              <Button variant={'outline'} size={'sm'}>
                Deposit
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (layout === 'card')
    return (
      <div
        className={`bg-navbg shadow-md rounded-lg p-4 max-w-[500px] ${className}`}
      >
        <div className="flex justify-between items-center border-b border-inactiveTab w-full">
          <div className="flex justify-between relative w-full">
            <div className="flex gap-5">
              <div className="flex">
                <img
                  src="src/assets/img/strkLogo.png"
                  alt=""
                  className="w-8 h-8"
                />
                <img
                  src="src/assets/img/ethLogo.png"
                  alt=""
                  className="w-8 h-8 z-10 ml-[-14px]"
                />
              </div>
              <div>
                <p className="text-base">{pair}</p>
                <div className="flex gap-4">
                  <span className="text-sm">{type}</span>
                  <span className="text-sm">{fee}</span>
                </div>
              </div>
            </div>
            <Button variant={'outline'} size={'sm'} className="gap-2">
              <span className="h-2 w-2 bg-navLinkColor"></span> Degon
            </Button>
          </div>
        </div>
        <div className="flex justify-between py-3">
          <div>
            <p className="text-sm">Liquidity</p>
            <div>{liquidity}</div>
          </div>
          <div>
            <p className="text-sm">APY</p>
            <div className="text-green-500">{apy}</div>
          </div>
          <div>
            <p className="text-sm">Risk Level</p>
            <div>{risk}</div>
          </div>
        </div>
        <Button variant={'outline'} size={'md'} className="w-full">
          DEPOSIT
        </Button>
      </div>
    );
}
