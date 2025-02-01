import React from 'react';
import Hand from '@/assets/images/hand.svg?react';
import Star from '@/assets/particles/star.svg?react';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/components/layout/notifier/Notifier';
import { useWalletStore } from '@/stores/useWalletStore';
import JoinButton from '../../gradientbutton';

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
    <div className=" h-auto  flex items-center justify-center flex-col mb-[50px] mt-[60px] lg:mb-[250px]">
      <div
        className=" absolute           
    h-[100px]          
    w-[20%]            
    left-0
    bottom-10           
    -translate-x-1/2   
    rounded-[2000px_2000px_0_0]  
    blur-[100px]                  
    bg-gradient-to-r 
    from-[var(--gradient-from)] 
    to-[var(--gradient-to)] "
      ></div>
      <div className="text-container">
        <h1 className=" text-center text-white text-[48px] font-[600]">Don&apos;t miss out</h1>
        <p className=" text-white text-[20px] mb-0 text-center font-[400]">
          Investing wisely would be the smartest move you&apos;ll make!
        </p>
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
        <JoinButton onClick={handleLaunchApp}>Launch App</JoinButton>
        <Hand className=" absolute lg:right-[-53px] lg:w-[135px] lg:h-[135px] top-[26px] right-[-44px] w-[114px] h-[114px]  " />
      </div>
      <div
        className=" absolute           
    h-[100px]          
    w-[20%]            
    right-0
    bottom-10           
    translate-x-1/2   
    rounded-[2000px_2000px_0_0]  
    blur-[100px]                  
    bg-gradient-to-r 
    from-[var(--gradient-from)] 
    to-[var(--gradient-to)] "
      ></div>
    </div>
  );
};

export default DontMiss;
