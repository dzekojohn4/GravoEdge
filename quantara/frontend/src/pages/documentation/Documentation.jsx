import React, { useEffect } from 'react';
import ScrollButton from '@/components/ui/scroll-button/ScrollButton';
import Sections from '@/components/layout/sections/Sections';
import Sidebar from '@/components/layout/sidebar/Sidebar';

const Documentation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { id: 'Introduction', name: 'Introduction', link: '#introduction' },
    {
      id: 'Overview',
      name: 'Overview',
      link: '#overview',
    },
    { id: 'how-it-performs', name: 'How it performs', link: '#how-it-performs' },
    { id: 'getting-started', name: 'Getting Started: Setting up your wallet', link: '#getting-started' },
  ];

  const sectionsData = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: [
        {
          type: 'text',
          value: 'Welcome to GravoEdge documentation.',
        },
        {
          type: 'text',
          value:
            'GravoEdge is a decentralized platform designed to help users easily amplify their investments in digital assets like ETH. \n This documentation provides a comprehensive guide on using GravoEdge and making the most of its features.',
        },
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      content: [
        {
          type: 'text',
          value: 'What is GravoEdge?',
        },
        {
          type: 'text',
          value:
            'GravoEdge is a Web3 platform that leverages blockchain technology to facilitate secure transactions, staking, and asset management without intermediaries, enabling users to amplify their investments in digital assets through decentralized lending protocols and automated market makers (AMMs).',
        },
        {
          type: 'text',
          value: 'Core features include:',
        },
        {
          type: 'list',
          items: [
            'Decentralized Finance (DeFi): Access a suite of DeFi services, including lending, borrowing, and yield farming.',
            'Security-First Design: Built on smart contracts to ensure safety, transparency, and user control over assets without intermediaries.',
            'Cross-Chain Compatibility: GravoEdge supports multiple blockchain ecosystems for a seamless and efficient user experience, providing more liquidity and flexibility across the DeFi ecosystem.',
          ],
        },
      ],
    },
    {
      id: 'how-it-performs',
      title: 'How it performs',
      content: [
        {
          type: 'text',
          value: 'Leverage Strategy',
        },
        {
          type: 'list',
          items: [
            'You deposit collateral into the platform lending protocol.',
            'The protocol borrows against your collateral, swaps through AMMs, and re-deposits to increase your position.',
            'This process can be repeated 2 to 5 times, depending on the leverage multiplier you choose, to increase your collateral and borrowing capacity.',
          ],
        },
        {
          type: 'text',
          value: 'Once your position is opened, you can view it on the Dashboard page. There, you’ll see:',
        },
        {
          type: 'list',
          items: [
            'Health Factor: A measure of how safe your position is (the higher, the better).',
            'Collateral: The value of your assets in the position.',
            'Borrowed Amount: The total amount you have borrowed.',
          ],
        },
        {
          type: 'text',
          value: 'About position',
        },
        {
          type: 'list',
          items: [
            'If you wish to close your position, simply click on `Redeem` in the Dashboard page. This will allow you to withdraw your collateral and repay the loan.',
            'Currently, GravoEdge only allows you to open a single position.',
            'If your health ratio level reaches zero, your position may be liquidated by the protocol.',
            'You also have the option to enable notifications on Telegram, so you will be alerted if your health ratio reaches a dangerous level.',
          ],
        },
      ],
    },
    {
      id: 'powered-by-stellar',
      title: 'Powered by Stellar',
      content: [
        {
          type: 'text',
          value:
            'GravoEdge is built on the **Stellar network**, a decentralized, open-source blockchain designed for fast, low-cost, and energy-efficient transactions. Stellar\'s consensus protocol enables near-instant settlement with minimal fees, making it ideal for DeFi applications.',
        },
        {
          type: 'text',
          value:
            'By leveraging Stellar\'s **Soroban smart contracts**, GravoEdge delivers automated leverage strategies with:',
        },
        {
          type: 'list',
          items: [
            'Fast transaction finality',
            'Low and predictable fees',
            'Built-in compliance features',
            'Protocol-agnostic adapter architecture',
          ],
        },
        {
          type: 'text',
          value:
            'The Stellar ecosystem provides the scalability and security needed for professional-grade DeFi, enabling GravoEdge to offer capital-efficient leverage tools without compromising on safety or user experience.',
        },
      ],
    },
    {
      id: 'getting-started',
      title: 'Getting Started: Setting Up Your Wallet',
      content: [
        {
          type: 'text',
          value:
            'To get started with GravoEdge and fully leverage its features, you’ll need to set up a compatible Web3 wallet. Follow the steps below to set up your wallet and connect it to GravoEdge:',
        },

        {
          type: 'text',
          value: 'Download a Compatible Web3 Wallet',
        },
        {
          type: 'list',
          items: [
            'MetaMask: MetaMask is one of the most popular Web3 wallets that allows you to interact with decentralized applications (dApps) like GravoEdge. You can download MetaMask as a browser extension for Chrome, Firefox, or Brave, or as a mobile app for iOS and Android.',
            'Other Wallets: GravoEdge supports multiple Web3 wallets. You may also choose other wallets like WalletConnect, Coinbase Wallet, or Trust Wallet, depending on your preferences and device compatibility.',
          ],
        },

        {
          type: 'text',
          value: 'Fund Your Wallet with Supported Cryptocurrency',
        },

        {
          type: 'list',
          items: [
            'Once your wallet is installed, you need to fund it with supported cryptocurrencies such as ETH or stablecoins (e.g., USDC). You can transfer funds from a cryptocurrency exchange (like Coinbase, Binance, or Kraken) by withdrawing them to your wallet address. Alternatively, you can purchase cryptocurrency directly within the wallet using third-party services or transfer assets between blockchains using a bridge.',
          ],
        },

        {
          type: 'text',
          value: 'Connect Your Wallet to GravoEdge',
        },
        {
          type: 'list',
          items: [
            "After funding your wallet, go to the GravoEdge platform and look for the “Connect Wallet” button, typically found in the top-right corner of the homepage. Select your wallet type (e.g., MetaMask, WalletConnect) and follow the prompts to authorize the connection. Your wallet will ask for permission to connect with GravoEdge; confirm this request to allow your wallet to interact with the platform. Once connected, you'll have full access to GravoEdge’s features.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-row">
      <div className="lg:w-[375px]">
        <Sidebar title="Table of Contents" items={tableOfContents} />
      </div>

      <div className="relative ml-4 min-h-screen flex-1 px-7 py-6 md:px-4 md:py-12">
        <h1 className="mt-16 mb-8 text-3xl font-bold text-white">GravoEdge Documentation</h1>
        <div className="ml-8">
          <Sections sections={sectionsData} />
        </div>
      </div>

      <ScrollButton />
    </div>
  );
};

export default Documentation;
