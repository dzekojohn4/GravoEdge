import React, { useMemo, useCallback, useState } from 'react';
import { useMaxMultiplier } from 'hooks/useMaxMultiplier';
import './multiplier.css';


const MultiplierSelector = ({ setSelectedMultiplier, selectedToken, sliderValue }) => {
  const { data } = useMaxMultiplier();
  const [actualValue, setActualValue] = useState(1.0);

  const maxMultiplier = useMemo(() => {
    return data?.[selectedToken] || 5.0;
  }, [data, selectedToken]);

  const mapSliderToValue = (sliderValue) => {
    return maxMultiplier - sliderValue + 1;
  };

  const handleMultiplierChange = useCallback((e) => {
    const sliderValue = parseFloat(e.target.value);
    const value = mapSliderToValue(sliderValue).toFixed(1);
    setActualValue(value);
    setSelectedMultiplier(value);
  }, [setSelectedMultiplier]);

  const getSliderPercentage = useCallback(() => {
    return (((maxMultiplier - actualValue + 1) - 1) / (maxMultiplier - 1)) * 100;
  }, [sliderValue, maxMultiplier]);

  return (
    <div className='multiplier-card'>
      <div className='slider-container'>
        <div className='slider-labels'>
          <span>Max</span>
          <span>Low</span>
        </div>
        <div className='slider-with-tooltip'>
          <div 
            className='slider-tooltip' 
            style={{ left: `${getSliderPercentage()}%` }}
          >
            {sliderValue}x
          </div>
          <input
            type='range'
            min='1'
            max={maxMultiplier}
            step='0.1'
            value={maxMultiplier - actualValue + 1}
            onChange={handleMultiplierChange}
            className='multiplier-slider'
          />
        </div>
      </div>
    </div>
  );
};

export default MultiplierSelector;
