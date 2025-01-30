import './dontMiss.css';
import React from 'react';
import Rocket from '@/assets/icons/rocket.svg?react';
import Hand from '@/assets/images/hand.svg?react';
import Star from '@/assets/particles/star.svg?react';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/components/layout/notifier/Notifier';
import { useWalletStore } from '@/stores/useWalletStore';

const DontMiss = () => {
  const { walletId } = useWalletStore();
  const navigate = useNavigate();
  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet', 'warning');
    }
  };

  const starData = [
    { top: 45, left: 8, size: 25 },
    { top: 150, left: 70, size: 25 },
  ];

  return (
    <div className=" h-auto px0p[] flex items-center justify-center flex-col mb-[50px] mt-[60px] lg:mb-[250px]">
      <div className="text-container">
        <h1 className=" text-center text-white text-[48px] font-[600]">Don&apos;t miss out</h1>
        <p className=" text-white text-[20px] mb-0 text-center font-[400]">Investing wisely would be the smartest move you&apos;ll make!</p>
      </div>

      {starData.map((star, index) => (
        <Star
          key={index}
          className="miss-star lg:absolute hidden"
          style={{
            '--star-top': `${star.top}% `,
            '--star-left': `${star.left}%`,
            '--star-size': `${star.size}%`,
          }}
        />
      ))}
      <div className="relative ">
        <button className="bg-[linear-gradient(55deg,#74d6fd_0%,#e01dee_100%)] hover:bg-[linear-gradient(55deg,#58c4ef_0%,#58c4ef_100%)]  border-none rounded-[8px] h-[52px] lg:w-[400px] w-[300px] text-[20px] text-white font-[700] mt-[20px] h-[60px] z-10 hover-pointer "   onClick={handleLaunchApp}>
          <div className="flex justify-center items-center hover-pointer flex gap-[20px]">
            <span className="">Launch App</span>
            <Rocket className="" />
          </div>
        </button>
        <Hand className=" absolute lg:right-[-53px] lg:w-[135px] lg:h-[135px] top-[26px] right-[-44px] w-[114px] h-[114px]  " />
      </div>
    </div>
  );
};

export default DontMiss;
