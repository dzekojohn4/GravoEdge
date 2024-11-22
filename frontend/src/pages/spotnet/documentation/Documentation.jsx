import React from 'react';
import './documentation.css';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  
  const tableOfContents = [
    {
      title: 'Introduction',
      link: '#introduction'
    },
    {
      title: 'Overview',
      link: '#overview',
      subItems: [
        { title: 'Cosmos Overview', link: '#cosmos-1' },
        { title: 'Cosmos Overview', link: '#cosmos-2' },
        { title: 'Cosmos Overview', link: '#cosmos-3' },
        { title: 'Cosmos Overview', link: '#cosmos-4' }
      ]
    },
    {
      title: 'Getting Started',
      link: '#getting-started'
    },
    {
      title: 'Features Overview',
      link: '#features'
    },
    {
      title: 'The Hub And Zones',
      link: '#hub-1'
    },
    {
      title: 'The Hub And Zones',
      link: '#hub-2'
    },
    {
      title: 'The Hub And Zones',
      link: '#hub-3'
    },
    {
      title: 'The Hub And Zones',
      link: '#hub-4'
    },
    {
      title: 'The Hub And Zones',
      link: '#hub-5'
    }
  ];

  return (
    <div className="documentation-container">
      <div className="table-of-contents">
        <h3 className="toc-title">Table of Content</h3>
        <nav className="toc-nav">
          {tableOfContents.map((item, index) => (
            <div key={index} className="toc-item">
              <a href={item.link} className="toc-link">• {item.title}</a>
              {item.subItems && (
                <div className="toc-subitems">
                  {item.subItems.map((subItem, subIndex) => (
                    <a 
                      key={subIndex} 
                      href={subItem.link} 
                      className="toc-sublink"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <h1 className="main-title">zkLend Documentation</h1>

        <section id="introduction">
          <h2 className="section-title">• Introduction</h2>
          <p className="section-text">
            Welcome to [Product Name] Documentation<br/>
            [Product Name] is a decentralized platform designed to [describe purpose, e.g., "empower users to securely manage digital assets and access DeFi tools effortlessly"]. This documentation provides a comprehensive guide on using [Product Name] and making the most of its features.
          </p>
        </section>

        <section id="overview">
          <h2 className="section-title">• Overview</h2>
          <p className="section-text">
            What is [Product Name]?<br/>
            [Product Name] is a Web3 platform that leverages blockchain technology to [describe primary functionalities, e.g., "facilitate secure transactions, staking, and asset management without intermediaries"].
          </p>
          <p className="section-text">
            Core features include:
          </p>
          <ul className="feature-list">
            <li>• Decentralized Finance (DeFi): Access a suite of DeFi services, including lending, borrowing, and yield farming.</li>
            <li>• Security-First Design: Built on smart contracts to ensure safety and transparency.</li>
            <li>• Cross-Chain Compatibility: [Product Name] supports multiple blockchains for a seamless user experience.</li>
          </ul>
        </section>

        <section id="getting-started">
          <h2 className="section-title">• Getting Started</h2>
          <p className="section-text">Setting Up Your Wallet</p>
          <ol className="setup-steps">
            <li>1. Download a compatible Web3 wallet (e.g., MetaMask).</li>
            <li>2. Fund your wallet with the supported cryptocurrency.</li>
          </ol>
        </section>
      </div>

      <div className="scroll-indicator">
        <button className="scroll-down">
          Scroll down
          <span className="scroll-icon">↓</span>
        </button>
      </div>
    </div>
  );
};

export default Documentation;