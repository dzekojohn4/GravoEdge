import React from 'react';
import { Tabs } from '../ui/core/tab';
import { Title } from '../ui/layout/title';
import { Search } from '../ui/core/search';
import { Card } from '../ui/core/card';
import PoolCard from '../ui/core/poolCard';

function Pool() {
  const title = 'Pool';
  const subTitle =
    'Earn passive income by providing liquidity to top trading pairs. Choose a pool, deposit funds, and start earning.';
  const tabsData = [
    {
      label: 'All',
      content: (
        <div className="w-full">
          {/* Table for Large Screens */}
          <div className="w-full border-collapse border border-navbg rounded-2xl hidden lg:table">
            <PoolCard
              pair="STRK - ETH"
              type="Stable"
              fee="0.500%"
              liquidity="$1,250,000"
              apy="8.5%"
              risk="Low"
              layout="tableRow"
              className="lg:table-row hidden"
            />
          </div>

          {/* Card Layout for Small Screens */}
          <div className="lg:hidden">
            <PoolCard
              pair="STRK - ETH"
              type="Stable"
              fee="0.500%"
              liquidity="$1,250,000"
              apy="8.5%"
              risk="Low"
              layout="card"
            />
          </div>
        </div>
      ),
    },

    { label: 'Stable', content: <div>Details Content</div> },
    { label: 'Volatile', content: <div>Volatile Content</div> },
  ];
  function search() {
    console.log('searching...');
  }

  return (
    <div className="bg-pageBg text-baseWhite h-screen  md:w-11/12 xl:w-[1280px] px-10  pb-10 pt-6 mx-auto">
      <div className="lg:block hidden">
        <div className=" flex justify-start items-start w-lg text-start mb-4">
          <Title title={title} subtitle={subTitle} />
        </div>
        <div className="grid grid-cols-7 gap-4">
          <div className=" col-span-5">
            <Tabs tabs={tabsData} />
          </div>

          <div className=" col-span-2">
            <Search onSearch={search} />
          </div>
        </div>
      </div>
      <div className="lg:hidden ">
        <Search onSearch={search} />
        <Tabs tabs={tabsData} />
      </div>
    </div>
  );
}

export default Pool;
