import React from "react";
import ArrowDownDouble from "../../../assets/icons/arrow-down-double.svg"
import "./overview.css";
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const OverviewPage = () => {


    const handleScrollDown = () => {
        const scrollAmount = document.documentElement.scrollHeight * 0.3;

        window.scrollBy({
            top: scrollAmount,
            behavior: "smooth"
        });
    }

    return (
        <div className="overview-container">
            <nav className="sidebar">
                <h2 className="sidebar-title">Content</h2>
                <ul className="sidebar-list">
                    <li>
                        <Link to="/overview" className="active-link">
                            • Welcome
                        </Link>
                    </li>
                    <li style={{ width: "100%" }}>
                        <div className="list-label-container">

                        <a href="#how-it-works" className="list-label">• How It Works</a>
                        </div>
                        <ul className="sidebar-sublist">
                            <li>
                                <a href="#connect-wallet">◦ Connect Your Wallet</a>
                            </li>
                            <li>
                                <a href="#choose-service">◦ Choose a Service</a>
                            </li>
                            <li>
                                <a href="#transact-seamlessly">◦ Transact Seamlessly</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#supported-chains">• Supported Chains</a>
                    </li>
                </ul>
            </nav>


            <div className="scroll-button-container">
                <Button onClick={handleScrollDown} className="scroll-button">Sroll down <Image src={ArrowDownDouble} /> </Button>
            </div>

            {/* Main Content */}
            <main className="content">
                <h1 className="content-title">Overview</h1>

                {/* Welcome Section */}
                <section id="welcome" className="section">
                    <h2 className="section-title">• Welcome</h2>
                    <p className="section-text">
                        Welcome to [Product Name], the decentralized platform designed to empower you with seamless access to the Web3 ecosystem. Built on blockchain technology, [Product Name] provides a secure, transparent, and user-friendly experience for managing your digital assets, accessing decentralized finance (DeFi) services, and engaging with the broader Web3 community.
                    </p>
                    <p className="key-features-title">Key Features</p>
                    <ul className="key-features-list">
                        <li>
                            Secure Asset Management: Store, track, and manage your digital assets with a security-first approach, utilizing smart contracts to protect your funds.
                        </li>
                        <li>
                            DeFi Integration: Access a suite of decentralized finance tools, including staking, lending, and borrowing, all from one intuitive interface.
                        </li>
                        <li>
                            Cross-Chain Compatibility: Interact with assets across multiple blockchain networks without needing to switch platforms.
                        </li>
                        <li>
                            Personalized Notifications: Enable real-time notifications for essential updates, such as changes in your health factor, to stay informed on your account status.
                        </li>
                    </ul>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="section">
                    <h2 className="section-title">• How It Works</h2>
                    <ol className="how-it-works-list">
                        <li id="connect-wallet">
                            <span className="highlight">Connect Your Wallet:</span> Use any Web3-compatible wallet, such as MetaMask,
                            to connect to [Product Name] securely and begin exploring the platform.
                        </li>
                        <li id="choose-service">
                            <span className="highlight">Choose a Service:</span> Select from the various DeFi services, asset
                            management tools, and community engagement features.
                        </li>
                        <li id="#transact-seamlessly">
                            <span className="highlight">Transact Seamlessly:</span> Every transaction is processed transparently
                            on-chain, giving you control and visibility over your digital activities.
                        </li>
                    </ol>
                </section>
            </main>
        </div>
    );
};

export default OverviewPage;
