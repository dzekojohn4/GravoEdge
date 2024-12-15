import './card.css';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';

function Card({ label, value = '', cardData = [] }) {
  return (
    <div className="card">
      <div className="card-header">
        {label == 'Health Factor' && <HealthIcon className="icon" />}
        {label == 'Borrow Balance' && <EthIcon className="icon" />}
        <span className="label">{label}</span>
      </div>
      <div className="card-value">
        {cardData.length > 0 ? (
          <>
            <span className="currency-symbol">$</span>
            <span className="top-card-value">
              {' '}
              {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
            </span>
          </>
        ) : (
          <span className="top-card-value">{value}</span>
        )}
      </div>
    </div>
  );
}

export default Card;
