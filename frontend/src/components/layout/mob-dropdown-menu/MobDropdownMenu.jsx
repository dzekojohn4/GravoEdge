import React from 'react';
import ArrowDownIcon from '@/assets/icons/dropdown-arrow.svg?react';
import ReloadIcon from '@/assets/icons/reload.svg?react';
import OpenBotIcon from '@/assets/icons/bot.svg?react';
import TermsIcon from '@/assets/icons/terms.svg?react';

const menuItems = [
  { id: 1, text: 'Reload page', icon: <ReloadIcon className="md:mr-2 sm:mr-1.5 mr-1.5 w-[18px] h-[18px]" />, link: '#' },
  { id: 2, text: 'Open Bot', icon: <OpenBotIcon className="md:mr-2 mr-1.5 w-[18px] h-[18px]" />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <TermsIcon className="md:mr-2 mr-1.5 w-[18px] h-[18px]" />, link: '#' },
];

function MobDropdownMenu({isMenuOpen, toggleMenu}) {
  return (
    <div className="relative">
      <button
        className="after:hidden px-2 py-1 sm:px-2.5 sm:flex justify-center items-center sm:relative sm:bg-transparent sm:border-0"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
      >
        <ArrowDownIcon className="md:mr-2 mr-1.5 w-[18px] h-[18px]" />
      </button>

      {isMenuOpen && (
        <ul 
          className={`
            xs:-translate-y-[60%] !translate-x-[-50%] !translate-y-[-60%] 
            @max-xs:translate-x-[-50%] bg-overlay fixed !top-[280px] !left-[50%] 
            border-0 pointer-events-auto md:p-[18px] p-6 px-9 xs:p-[18px] sm:p-[18px] 
            w-[330px] h-[310px] md:w-[390px] md:h-[368px] @min-xs:w-[300px] @min-xs:h-[280px] 
            text-[var(--primary)]
            lg:animate-[fadeIn_0.3s_ease-in-out]
          `} 
          aria-labelledby="dropdownMenuButton1"
        >
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                className="h-[50px] w-3xs md:w-[342px] sm:w-[294px] md:h-[60px] 
                  flex items-center border border-footer-divider rounded-2xl text-xs 
                  md:text-sm bg-dark-purple font-semibold leading-[171%] md:mb-4 mb-3 
                  pointer-events-auto !transition-none px-6 md:py-4" 
                href={item.link}
              >
                {item.icon}
                {item.text}
              </a>
            </li>
          ))}
          <li>
            <button 
              className="h-[50px] w-3xs md:w-[342px] sm:w-[294px] md:h-[60px] 
                flex items-center border border-footer-divider rounded-2xl text-xs 
                md:text-sm bg-dark-purple font-semibold leading-[171%] md:mb-4 mb-3 
                pointer-events-auto relative !transition-none md:px-6 md:py-4 justify-center 
                z-[1] mt-[45px] cursor-pointer text-center text-white font-text
                before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 
                before:z-[-1] before:rounded-[16px] before:p-[1px]
                before:mask-[var(--mask-gradient)]
                bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]" 
              onClick={toggleMenu}
            >
              Cancel
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default MobDropdownMenu;