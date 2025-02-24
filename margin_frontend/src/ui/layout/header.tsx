import React from "react";
import { Button } from "../core/button";

const navlink = [
  {
    title: "Pool",
    link: "/pool",
  },
  {
    title: "Trade",
    link: "/trade",
  },
];
export function Header() {
  return (
    <div className="h-[88px] md:h-[120px] flex items-center justify-between px-4 md:px-14 lg:px-20 w-full">
      <h4 className="logo uppercase font-[InstrumentSans] text-white font-bold text-[13px] leading-[15.86px]">
        Margin
      </h4>
      <nav className="items-center hidden gap-4 md:flex">
        {navlink.map((link, index) => (
          <React.Fragment>
            <div className={""} key={index}>
              <a
                href={link.link}
                className="text-[#B4B4B4] text-sm font-normal font-[BricolageGrotesque]"
              >
                {link.title}
              </a>
            </div>
            {index === 0 && <div className="w-[2px] h-[18px] bg-[#252525]" />}
          </React.Fragment>
        ))}
      </nav>
      <Button
        variant={"outline"}
        className="h-12 w-[161px] text-[var(--text)] uppercase text-sm font-normal mt-1"
      >
        Connect Wallet
      </Button>
    </div>
  );
}
