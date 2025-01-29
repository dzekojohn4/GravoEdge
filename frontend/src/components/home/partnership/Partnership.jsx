import React from 'react';
import './partnership.css';
import ZklendLogo from '@/assets/images/zklend_logo.svg?react';
import EkuboLogo from '@/assets/images/ekubo_logo.svg?react';
import Star from '@/assets/particles/star.svg?react';

const Partnership = () => {
  const logos = [];
  const logoCount = 20; // Number of logo pairs

  for (let i = 0; i < logoCount; i++) {
    logos.push(<ZklendLogo key={`zklend-${i}`} />);
    logos.push(<EkuboLogo key={`ekubo-${i}`} />);
  }

  const starData = [{ top: 10, left: 75, size: 15 }];

  return (
    <div className="partnership-container">
      {starData.map((star, index) => (
        <Star
          key={index}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}%`,
            height: `${star.size}%`,
          }}
        />
      ))}
      <h1 className="partner-title">Partnership</h1>
      <div className="partnership-content">
        <div className="partnership-logo">{logos}</div>
      </div>
    </div>
  );
};

export default Partnership;
