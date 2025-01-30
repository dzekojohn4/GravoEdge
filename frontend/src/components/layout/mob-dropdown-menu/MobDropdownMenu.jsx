import React from 'react';
import ArrowDownIcon from '@/assets/icons/dropdown-arrow.svg?react';
import ReloadIcon from '@/assets/icons/reload.svg?react';
import OpenBotIcon from '@/assets/icons/bot.svg?react';
import TermsIcon from '@/assets/icons/terms.svg?react';
import './mobDropdownMenu.css';

const menuItems = [
  { id: 1, text: 'Reload page', icon: <ReloadIcon className="dpd-icon md:mr-2 sm:mr-1.5 w-5 h-5" />, link: '#' },
  { id: 2, text: 'Open Bot', icon: <OpenBotIcon className="dpd-icon md:mr-2 sm:mr-1.5 w-5 h-5 " />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <TermsIcon className="dpd-icon md:mr-2 sm:mr-1.5 w-5 h-5" />, link: '#' },
];

function MobDropdownMenu({isMenuOpen, toggleMenu}) {
  return (
    <div className="relative">
      <button
        className="dropdown-toggle px-9 py-1 sm:px-2.5 sm:flex justify-center items-center sm:relative sm:bg-transparent sm:border-0 "
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        // aria-expanded="false"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
      >
        <ArrowDownIcon className="dpd-icon md:mr-2 sm:mr-1.5 w-5 h-5" />
      </button>
      {isMenuOpen && ( 
        <ul className="dropdown-menu rounded-3xl  !fixed !top-[280px] !left-[50%] border-0 pointer-events-auto dropdown-items p-6 xs:p-[18px] sm:p-[22px] w-[330px] h-[310px] md:w-[390px] md:h-[368px] @min-xs:w-[300px] @min-xs:h-[280px] " aria-labelledby="dropdownMenuButton1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a className="dropdown-item  flex items-center border border-[#201338] rounded-2xl text-xs md:text-sm bg-[#120721] font-semibold leading-[171%] md:mb-4 mb-3 pointer-events-auto !transition-none md:px-6 md:py-4" href={item.link}>
                {item.icon}
                {item.text}
              </a>
            </li>
          ))}
          <li>
            <button className="dropdown-item flex items-center border border-[#201338] rounded-2xl text-xs md:text-sm bg-[#120721] font-semibold leading-[171%] md:mb-4 mb-3 pointer-events-auto  !transition-none md:px-6 md:py-4 cancel-btn mt-[45px] cursor-pointer text-center" onClick={toggleMenu}>Cancel</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default MobDropdownMenu;