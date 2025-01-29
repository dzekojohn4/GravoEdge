import React, { useState } from 'react';
import MetricCard from '@/components/vault/stake-card/StakeCard';
import STRK from '@/assets/icons/strk.svg';
import USDCc from '@/assets/icons/apy_icon.svg';
import './stake.css';
import { VaultLayout } from '@/components/vault/VaultLayout';
import { Button } from '@/components/ui/custom-button/Button';
import GasFee from '@/components/vault/gas-fee/GasFee';
import BalanceCards from '@/components/ui/balance-cards/BalanceCards';

function Stake() {
  const [selectedNetwork, setSelectedNetwork] = useState('Starknet');
  const [amount, setAmount] = useState('0');
  const [showDrop, setShowDrop] = useState(false);

  const networks = [{ name: 'Starknet', image: STRK }];
  const handleChange = (network) => {
    setSelectedNetwork(network.name);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };
  return (
    <VaultLayout>
      <div className="stake-wrapper bg-cover bg-39p min-h-[125vh] h-full flex justify-center w-[calc(100vw-372px)] ml-[372px]    ">
        <div className="stake-container w-full max-w-[390px] h-[610px] my-0 mx-auto  ">
          <div className="balance-display-container">
            <div className="large-screen-balance block">
              <div className="main-container w-[642px] gap-6 pt-[37px] rounded-[20px] text-[#fff] text-center flex justify-center flex-col items-center  ">
                <div className="top-cards flex gap-6 ">
                  <MetricCard title="STRK Balance" value="0.046731" icon={STRK} />
                  <MetricCard title="APY Balance" value="0.046731" icon={USDCc} />
                </div>
              </div>
            </div>
            <div className="mobile-screen-balance none">
              <BalanceCards />
            </div>
          </div>
          <div className="form mb-8 w-full block my-0 mx-auto ">
            <h1 className="stake-title text-sm font-normal text-white block mx-0 my-auto text-center items-center py-6 px-0 ">Please submit your leverage details</h1>
            <div className="main-stake-card p-1 h-auto flex flex-col gap-6 border border-[#36294e] rounded-lg  ">
              <div
                onClick={() => setShowDrop(!showDrop)}
                className={showDrop ? 'clicked-network-selector-container relative w-full' : 'network-selector-container group '}
              >
                <div className="network-selector flex items-center justify-between gap-3 bg-[#120721] border-b-[#36294e] text-white py-3 px-4 cursor-pointer text-[1rem] w-full relative z-[10] ">
                  <div className="selected-network flex items-center gap-3">
                    <img
                      src={networks.find((network) => network.name === selectedNetwork)?.image}
                      alt={selectedNetwork}
                      className="network-icon w-6 h-6 rounded-full  "
                    />
                    <span>{selectedNetwork}</span>
                  </div>
                  <svg
                    className="chevron transition-transform duration-300 ease-in-out ml-auto  group-hover:rotate(180deg) transform "
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="network-dropdown none absolute top-[100%] left-0 w-full bg-[#83919f] rounded-sm z-[1] shadow-custom group-hover:block ">
                  {networks.map((network) => (
                    <div key={network.name} className="network-option py-[0.75rem] px-[1rem] flex items-center gap-[0.75rem] cursor-pointer rounded-[2rem] transition-transform duration-300 ease-in-out bg-[#FFFFFF33
] " onClick={() => handleChange(network)}>
                      <img src={network.image} alt={network.name} className="network-icon" />
                      <span>{network.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="amount-input relative w-full max-w-[400px] my-8 mx-auto text-center " aria-labelledby="amount-input-label">
                <input
                  type="text"
                  id="amount-field"
                  value={amount}
                  onChange={handleAmountChange}
                  pattern="^\d*\.?\d*$"
                  className="amount-field bg-transparent border-none text-[#83919f] text-[64px] font-medium outline-none text-center w-full "
                  aria-describedby="currency-symbol"
                  placeholder="0.00"
                />
                <span id="currency-symbol" className="currency absolute text-[#393942] right-[31%] top-[18%] transform translate-y-[-50%] opacity-[0.5] text-base leading-[20.83px] z-[999999] ">
                  STRK
                </span>
              </div>

              <div className="apy-rate text-[#393942] text-[0.875rem] mb-5 text-center  ">$0.00 APY / year</div>
              <div className="parent-divider1">
                <div className="divider1 h-[1px] w-[80%] m-auto bg-[#201338] "></div>
              </div>

              <GasFee />
            </div>
          </div>
          <div className="can-stk">
            <Button variant="secondary" size="lg" className="cancel none">
              {' '}
              Cancel
            </Button>
            <Button variant="secondary" size="lg" className="stake-button1 w-[642px] h-[60px] py-4 px-6 rounded-lg font-semibold text-sm mt-8 ">
              Stake
            </Button>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}

export default Stake;
