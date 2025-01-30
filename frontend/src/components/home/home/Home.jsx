import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmallStar from '@/assets/particles/small_star.svg?react';
import StarMaker from '@/components/layout/star-maker/StarMaker';
import Decoration from '@/assets/particles/deco.svg?react';
import Starknet from '@/assets/particles/starknet.svg?react';
import Rocket from '@/assets/icons/rocket.svg?react';
import './home.css';
import { useWalletStore } from '@/stores/useWalletStore';
import { notify } from '@/components/layout/notifier/Notifier';

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
              key={index}
              className={`decoration decoration-${index}`}
              style={{
                '--top': `${decoration.top}vh`,
                '--left': `${decoration.left}vw`,
              }}
            />
          ))}
        </div>
        <div className="top-gradient"></div>
        <div>
          {starsData.map((star, index) => (
            <SmallStar
              key={index}
              className="small-star"
              style={{
                '--top': `${star.top}%`,
                '--left': `${star.left}%`,
              }}
            />
          ))}
          <StarMaker starData={starData} />

          <Starknet className="starknet" />
        </div>
        <div className=" flex mx-auto md:mt-[5em] lg:mt-0 flex-col items-center justify-center px-[1em]">
          <h2 className=" lg:leading-[75px] leading-[50px] font-text text-[50px] lg:text-[70px] mx-auto text-center text-[#fff]">
            <span className="text-blue-400">Earn</span> by leveraging your <br /> assets
            <span className="bg-[linear-gradient(73deg,_#74d6fd_1.13%,_#e01dee_103.45%)] bg-clip-text text-transparent"> with Spotnet</span>
          </h2>
          <h5 className="text-white lg:text-[20px] mt-[1em]">
            Maximize the potential of your resources and start earning today. Join <br /> Spotnet and unlock new
            opportunities to grow your wealth!
          </h5>
        </div>

        <button className="bg-[linear-gradient(55deg,#74d6fd_0%,#e01dee_100%)] hover:bg-[linear-gradient(55deg,#58c4ef_0%,#58c4ef_100%)]  border-none rounded-[8px] h-[52px] lg:w-[400px] w-[300px] text-[20px] text-white font-[700] mt-[20px] h-[60px] z-10 hover-pointer "   onClick={handleLaunchApp}>
          <div className="flex justify-center items-center hover-pointer flex gap-[20px]">
            <span className="">Launch App</span>
            <Rocket className="" />
          </div>
        </button>
        <div className="bottom-gradient"></div>
      </div>
    </div>
  );
}

export default Home;
