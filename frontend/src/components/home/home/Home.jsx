import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmallStar from '@/assets/particles/small_star.svg?react';
import StarMaker from '@/components/layout/star-maker/StarMaker';
import Decoration from '@/assets/particles/deco.svg?react';
import Starknet from '@/assets/particles/starknet.svg?react';
import { useWalletStore } from '@/stores/useWalletStore';
import { notify } from '@/components/layout/notifier/Notifier';
import LaunchButton from '../../gradientbutton';

function Home() {
  const { walletId } = useWalletStore();

  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet', 'warning');
    }
  };

  const starsData = [
    { top: 15, left: 20 },
    { top: 20, left: 40 },
    { top: 15, left: 70 },
    { top: 15, left: 0 },
    { top: 90, left: 80 },
    { top: 60, left: 85 },
    { top: 40, left: 106 },
    { top: 85, left: 100 },
    { top: 90, left: 0 },
    { top: 75, left: 20 },
    { top: 50, left: 5 },
  ];

  const starData = [
    { top: 0, left: 5, size: 5 },
    { top: 26, left: 0, size: 7 },
    { top: 90, left: 10, size: 8 },
    { top: 0, left: 76, size: 8 },
    { top: 30, left: 88, size: 8 },
    { top: 70, left: 84, size: 10 },
  ];

  const decorationData = [
    { top: -5, left: -30 },
    { top: -5, left: 3 },
    { top: -15, left: 60 },
    { top: -14, left: 55 },
  ];

  return (
    <div className=" relative flex flex-row justify-center color-white text-center w-[100%] hover-pointer  ">
      <div className=" mt-[400px] mb-[200px] h-[100%]">
        <div>
          {decorationData.map((decoration, index) => (
            <Decoration
              className={`decoration absolute z-[-1] top-[var(--top)] left-[var(--left)] w-[var(--size)] h-[--size] decoration-${index}`}
              style={{
                '--top': `${decoration.top}vh`,
                '--left': `${decoration.left}vw`,
              }}
            />
          ))}
        </div>
        <div
          className="    absolute           
    h-[100px]          
    w-[60%]            
    left-1/2           
    -translate-x-1/2   
    rounded-[2000px_2000px_0_0]  
    blur-[100px]     
    -z-10             
    bg-gradient-to-r 
    from-[var(--gradient-from)] 
    to-[var(--gradient-to)] top-0"
        ></div>
        <div>
          {starsData.map((star, index) => (
            <SmallStar
              key={index}
              className=" absolute z-1 top-[var(--top)] left-[var(--left)]"
              style={{
                '--top': `${star.top}%`,
                '--left': `${star.left}%`,
              }}
            />
          ))}
          <StarMaker starData={starData} />

          <Starknet className=" absolute top-0 right-[20px] z-[-1]" />
        </div>
        <div className=" flex mx-auto md:mt-[5em] lg:mt-0 flex-col items-center justify-center px-[1em]">
          <h2 className=" lg:leading-[75px] leading-[50px] font-text text-[50px] lg:text-[70px] mx-auto text-center text-[var(--primary)]">
            <span className="text-blue-400">Earn</span> by leveraging your <br /> assets
            <span
              className="bg-gradient-to-r from-[var(--button-gradient-from)] via-[var(--button-gradient-from)] to-[var(--button-gradient-to)]
        hover:bg-gradient-to-r hover:from-[var(--button-gradient-hover-from)] bg-clip-text text-transparent"
            >
              {' '}
              with Spotnet
            </span>
          </h2>
          <h5 className="text-white lg:text-[20px] mt-[1em]">
            Maximize the potential of your resources and start earning today. Join <br /> Spotnet and unlock new
            opportunities to grow your wealth!
          </h5>
        </div>
        <LaunchButton onClick={handleLaunchApp}>Launch App</LaunchButton>

        <div
          className="   absolute           
    h-[100px]          
    w-[60%]            
    left-1/2           
    -translate-x-1/2   
    rounded-[2000px_2000px_0_0]  
    blur-[100px]     
    -z-10             
    bg-gradient-to-r 
    from-[var(--gradient-from)] 
    to-[var(--gradient-to)] bottom-[-10%]"
        ></div>
      </div>
    </div>
  );
}

export default Home;
