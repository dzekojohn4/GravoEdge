import './dont_miss.css'
import React from "react";
import { ReactComponent as Rocket } from "../../../assets/icons/rocket.svg";
import { ReactComponent as Hand } from "../../../assets/images/hand.svg";
import { ReactComponent as Star } from "../../../assets/particles/star.svg";

const DontMiss = ({ walletId , onConnectWallet , onLogout }) => {
    const starData = [
        { top: 20, left: 5, size: 9 },
        { top: 75, left: 80, size: 12 },
    ]
    return(
        <div className='dont-miss__container'>
            <h1 className='miss-title'>Don't miss out</h1>
            <p className='miss-description'>
                Investing wisely would be the smartest move you'll make!
            </p>
            {starData.map((star, index) => (
                <Star key={index} style={{
                    position: 'absolute',
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    width: `${star.size}%`,
                    height: `${star.size}%`
                }}/>
            ))}
            {walletId ? (
                <div className='wallet-container'>
                    <div className='wallet-id'>
                        {`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}
                    </div>
                    <button className='gradient-button'
                            onClick={onLogout}
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className='miss-button'>
                    <button className='launch-button miss-btn'
                            onClick={onConnectWallet}
                    >
                        Launch App <Rocket/>
                    </button>
                    <Hand className='hand-icon'/>
                </div>
            )}
        </div>
    )
}

export default DontMiss