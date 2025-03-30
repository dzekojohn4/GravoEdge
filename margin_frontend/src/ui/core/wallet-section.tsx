import { useState, useEffect, useRef } from "react";

import { Button } from "./button";
import { useWalletStore } from "../../stores/useWalletStore";

// TODO: Improve this component

const WalletSection = ({
  onConnectWallet,
  onLogout,
}: {
  onConnectWallet: () => void;
  onLogout: () => void;
}) => {
  const { walletId } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(
          event.target instanceof Node && menuRef.current.contains(event.target)
        ) &&
        !(event.target instanceof Element && event.target.closest(".menu-dots"))
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Wallet Container */}
      {(isMobile || walletId) && (
        <div
          ref={menuRef}
          className={`relative ${
            isMobile
              ? "h-[50px] w-[50px] rounded-full bg-[#201338] lg:h-[40px] lg:w-[40px]"
              : "relative h-[57px] w-[274px] p-[1px]"
          }`}
        >
          {!isMobile && (
            <>
              <div className="from-brand to-pink absolute inset-0 rounded-[900px] bg-gradient-to-r" />
              <div className="bg-bg absolute inset-[1px] rounded-[900px]" />
            </>
          )}

          <div
            className={`relative flex h-full w-full items-center justify-center rounded-[900px] lg:justify-between ${!isMobile ? "px-6" : ""}`}
          >
            {walletId && !isMobile && (
              <Button
                onClick={() => {
                  onLogout();
                }}
                variant={"outline"}
                className="w-[164px]"
                size={"md"}
              >
                {`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}
              </Button>
            )}
            <span
              className="text-primary menu-dots relative -top-[1px] inline-block cursor-pointer p-2.5 text-2xl"
              onClick={toggleMenu}
              onKeyDown={toggleMenu}
            >
              &#x22EE;
            </span>

            {isMenuOpen && (
              <div className="bg-header-button-bg absolute top-20 right-0 z-50 flex w-[300px] flex-col items-center justify-start rounded-[10px] p-4 transition-all duration-300 md:w-[285px]">
                {isMobile && !walletId && (
                  <Button variant={"outline"} className="w-[164px]" size={"md"}>
                    Connect Wallet
                  </Button>
                )}

                {walletId && (
                  <div className="relative p-[1px]">
                    <div className="from-brand to-pink absolute inset-0 rounded-[900px] bg-gradient-to-r" />
                    <div className="bg-bg absolute inset-[1px] rounded-[900px]" />
                    <Button
                      variant={"outline"}
                      className="w-[164px]"
                      size={"md"}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!isMobile && !walletId && (
        <Button
          onClick={onConnectWallet}
          variant={"outline"}
          className="w-[164px]"
          size={"md"}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletSection;
