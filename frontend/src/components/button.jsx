import React from 'react';
import Rocket from '@/assets/icons/rocket.svg?react';



const GradientButton = ({ 
  onClick, 
  children, 
  mobileWidth = 'w-[300px]',
  desktopWidth = 'lg:w-[400px]',
  icon = <Rocket />,
  className = ''
}) => {
  return (
    <button
      className={`
        bg-gradient-to-r from-[var(--button-gradient-from)] via-[var(--button-gradient-to)] to-[var(--button-gradient-to)]
        hover:bg-gradient-to-r hover:from-[var(--button-gradient-hover-from)] hover:via-[var(--button-gradient-from)] hover:to-[var(--button-gradient-hover-from)]
        border-none rounded-[8px] h-[52px] text-[20px] text-white font-[700] mt-[20px] 2xl:h-[60px] z-10 cursor-pointer
        ${mobileWidth} ${desktopWidth} ${className}
      `}
      onClick={onClick}
    >
      <div className="justify-center items-center cursor-pointer flex gap-[20px]">
        <span>{children}</span>
        {icon}
      </div>
    </button>
  );
};

export default GradientButton;