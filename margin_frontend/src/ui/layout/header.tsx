import React, { useState } from "react";
import WalletSection from "../core/wallet-section";
import { logout } from "../../services/wallet";
import { useWalletStore } from "../../stores/useWalletStore";
import { useConnectWallet } from "../hooks/useConnectWallet";

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
  const { setWalletId, removeWalletId } = useWalletStore();

  const [showModal, setShowModal] = useState(false);

  const connectWalletMutation = useConnectWallet(setWalletId);

  const handleConnectWallet = () => {
    console.log(showModal);
    connectWalletMutation.mutate();
  };

  const handleLogout = () => {
    logout();
    removeWalletId();
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="h-[88px] md:h-[120px] rounded-b-4xl lg:bg-navbg flex items-center justify-between px-4 md:px-14 lg:px-20 w-full">
      <h4 className="font-bold uppercase font-instrumentsans text-baseWhite text-logo leading-logo">
        Margin
      </h4>
      <nav className="items-center hidden gap-4 md:flex">
        {navlink.map((link, index) => (
          <React.Fragment key={index}>
            <a
              href={link.link}
              className="text-sm font-normal text-navLinkColor font-bricolageGrotesque"
            >
              {link.title}
            </a>
            {index === 0 && (
              <div className="w-[2px] h-[18px] bg-navSeperatorColor" />
            )}
          </React.Fragment>
        ))}
      </nav>
      <WalletSection
        onConnectWallet={handleConnectWallet}
        onLogout={handleLogout}
      />
    </div>
  );
}
