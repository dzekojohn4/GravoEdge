import "./deposited.css";
import { ReactComponent as EthIcon } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from '../../../assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from '../../../assets/icons/usd_coin.svg';

function Deposited({ data }) {
    return (
        <div className="tab-content">
            <div className="deposited-info">
                <div>
                    <span className="icon"><EthIcon /></span>
                    <p className="currency-name">ETH</p>
                    <p className="currency-value">{data.eth}</p>
                </div>

                <div className="info-divider" />

                <div>
                    <span className="icon"><StrkIcon /></span>
                    <p className="currency-name">STRK</p>
                    <p className="currency-value">{data.strk}</p>
                </div>

                <div className="info-divider" />

                <div>
                    <span className="icon"><UsdIcon /></span>
                    <p className="currency-name">USDC</p>
                    <p className="currency-value">{data.usdc}</p>
                </div>

                <div className="info-divider" />

                <div>
                    <span className="icon"><EthIcon /></span>
                    <p className="currency-name">USDT</p>
                    <p className="currency-value">{data.usdt}</p>
                </div>
            </div>
        </div>
    )
}

export default Deposited;