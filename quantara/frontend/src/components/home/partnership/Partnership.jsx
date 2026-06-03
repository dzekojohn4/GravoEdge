import React from 'react';
import Star from '@/assets/particles/star.svg?react';

const Partnership = () => {
  const starData = [{ top: 10, left: 75, size: 15 }];

  return (
    <div className="relative">
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
      <h1 className="mb-[130px] text-center text-[48px] font-semibold text-white">Built on Stellar</h1>
      <div className="relative flex h-[150px] w-screen items-center justify-center overflow-hidden bg-gradient-to-r from-[var(--gradient-from)] via-purple-400 to-purple-500">
        <div className="text-center text-2xl font-semibold text-white opacity-80">
          Leveraging the Stellar ecosystem for fast, low-cost DeFi
        </div>
      </div>
    </div>
  );
};

export default Partnership;
