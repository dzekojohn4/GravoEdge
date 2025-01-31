import React from 'react';
import ZklendLogo from '@/assets/images/zklend_logo.svg?react';
import EkuboLogo from '@/assets/images/ekubo_logo.svg?react';
import Star from '@/assets/particles/star.svg?react';
const Partnership = () => {
  const logos = [];
  const logoCount = 20; 

  for (let i = 0; i < logoCount; i++) {
    logos.push(<ZklendLogo key={`zklend-${i}`} className="w-[150px] h-[100px] mx-5 shrink-0" />);
    logos.push(<EkuboLogo key={`ekubo-${i}`} className="w-[150px] h-[100px] mx-5 shrink-0" />);
  }

  const starData = [{ top: 10, left: 75, size: 15 }];

  return (
    <div className="relative bg-[var(--black)]">
      {starData.map((star, index) => (
        <Star
          key={index}
          className="absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}%`,
            height: `${star.size}%`,
          }}
        />
      ))}
      <h1 className="text-center font-semibold text-[48px] text-white mb-[130px]">Partnership</h1>
      <div className=" w-screen h-[150px] bg-gradient-to-r from-[var(--gradient-from)] via-purple-400 to-purple-500 relative flex items-center overflow-hidden">
        <div className=" partnership-logo flex items-center justify-start relative animate-scroll [&>*]:flex-shrink-0 [&>*]:w-[150px] [&>*]:h-[100px] [&>*]:mx-[20px]">
          {logos}
        </div>
      </div>
    </div>
  );
};

export default Partnership;
