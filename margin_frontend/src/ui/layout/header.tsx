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
      <h4 className="font-bold uppercase font-instrumentsans text-text text-logo leading-logo">
        Margin
      </h4>
      <nav className="items-center hidden gap-4 md:flex">
        {navlink.map((link, index) => (
          <>
            <div key={index}>
              <a
                href={link.link}
                className="text-sm font-normal text-nav-text font-bricolageGrotesque"
              >
                {link.title}
              </a>
            </div>
            {index === 0 && <div className="w-[2px] h-[18px] bg-seperator" />}
          </>
        ))}
      </nav>
      <Button
        variant={"outline"}
        className="h-12 w-[161px] text-text uppercase text-sm font-normal mt-1"
      >
        Connect Wallet
      </Button>
    </div>
  );
}
