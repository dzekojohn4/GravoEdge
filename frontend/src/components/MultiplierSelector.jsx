import React, { useMemo, useCallback, useState } from 'react';
import { useMaxMultiplier } from 'hooks/useMaxMultiplier';
import './multiplier.css';

const MultiplierSelector = ({ setSelectedMultiplier, selectedToken }) => {
  const { data, isLoading, error } = useMaxMultiplier();
  const [actualValue, setActualValue] = useState(1.0);

  const maxMultiplier = useMemo(() => {
    return data?.[selectedToken] || 5.0;
  }, [data, selectedToken]);

  const mapSliderToValue = (sliderValue) => {
    return maxMultiplier - sliderValue + 1;
  };

  const handleMultiplierChange = useCallback(
    (e) => {
      const sliderValue = parseFloat(e.target.value);
      const value = mapSliderToValue(sliderValue).toFixed(1);
      setActualValue(value);
      setSelectedMultiplier(value);
    },
    [setSelectedMultiplier, maxMultiplier]
  );

  const getSliderPercentage = useCallback(() => {
    return ((maxMultiplier - actualValue + 1 - 1) / (maxMultiplier - 1)) * 100;
  }, [actualValue, maxMultiplier]);

  if (isLoading) return <div className="slider-skeleton">Loading multiplier data...</div>;
  if (error) return <div className="error-message">Error loading multiplier data: {error.message}</div>;

  const style = {
    background: `linear - gradient(to right, rgba(0, 0, 0, 0) ${ getSliderPercentage() } %, black ${ getSliderPercentage() } %)`,
  };

  return (
    <div className="multiplier-card">
      <div className="slider-container">
        <div className="slider-labels">
          <span>Max</span>
          <span>Low</span>
        </div>
        <div className="slider-with-tooltip">
          <div className="multiplier-slider-outer">
            <div className="multiplier-slider-inner">
              <input
                type="range"
                min="1"
                max={maxMultiplier}
                step="0.1"
                value={maxMultiplier - actualValue + 1}
                onChange={handleMultiplierChange}
                style={style}
                className="multiplier-slider"
              />
            </div>
          </div>
        </div>
        <div className="range-meter">
          {Array.from({ length: 11 }).map((_, index) => (
            <div key={index} className="meter-inner">
              <div className="meter-marks"></div>
              <div className="meter-label">{index}x</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplierSelector;