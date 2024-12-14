function TopCard(){
    return (<div className="top-cards-dashboard">
        <div className="card">
          <div className="card-header">
            <HealthIcon className="icon" />
            <span className="label">Health Factor</span>
          </div>
          <div className="card-value">
            <span className="top-card-value">{healthFactor}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <img src={newIcon} alt="Borrow Balance Icon" className="icon" />{' '}
            <span className="label">Borrow Balance</span>
          </div>
          <div className="card-value">
            <span className="currency-symbol">$</span>
            <span className="top-card-value">
              {' '}
              {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
            </span>
          </div>
        </div>
      </div>)
}

export default TopCard