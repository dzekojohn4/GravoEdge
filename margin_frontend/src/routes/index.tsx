import { Button } from "../ui/core/button";
import { Footer } from "../ui/layout/footer";
import { Header } from "../ui/layout/header";

export function Home() {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-black md:justify-between">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {
  return (
    <div className="mt-[100px] md:mt-0 pb-[112px] md:pb-0">
      <h1 className="hidden md:block text-center text-[64px] font-[PilotCommandSpaced] uppercase text-[#e5e5e5]">
        Trade, Earn, Grow
      </h1>
      <div className="space-y-8 md:hidden">
        <h1 className="text-center text-[64px] font-[PilotCommandSpaced] uppercase text-[#e5e5e5]">
          Trade
        </h1>
        <div className="h-3.5 w-3.5 rounded-full bg-white mx-auto" />
        <h1 className="text-center text-[64px] font-[PilotCommandSpaced] uppercase text-[#e5e5e5]">
          Earn
        </h1>
        <div className="h-3.5 w-3.5 rounded-full bg-white mx-auto" />
        <h1 className="text-center text-[64px] font-[PilotCommandSpaced] uppercase text-[#e5e5e5]">
          Grow
        </h1>
      </div>

      <p className="w-10/12 mx-auto mt-4 text-center font-[BricolageGrotesque] text-sm md:text-base font-medium text-[var(--text)]">
        Trade smarter, earn bigger, and grow your portfolio with confidence.
      </p>
      <div className="flex justify-center mt-12">
        <Button
          variant={"outline"}
          size={"lg"}
          className="w-[219px] text-[var(--text)] uppercase text-sm font-normal "
        >
          Launch app
        </Button>
      </div>
    </div>
  );
}
