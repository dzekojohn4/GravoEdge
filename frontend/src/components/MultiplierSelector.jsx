import React, { useState, useCallback, useMemo } from 'react';
import { useMaxMultiplier } from 'hooks/useMaxMultiplier';
import './multiplier.css';

const MultiplierSelector = ({ min = 0, max = 10, step = 1, defaultValue = 1, setSelectedMultiplier, selectedToken }) => {
    const { data, isLoading, error } = useMaxMultiplier();
    const [value, setValue] = useState(defaultValue);


    const maxMultiplier = useMemo(() => {
        return data?.[selectedToken] || 11.0;
    }, [data, selectedToken]);

    const handleMultiplierChange = useCallback((e) => {
        setValue(Number(e.target.value));
        setSelectedMultiplier(value);
    }, [setSelectedMultiplier, value]);

    const steps = Array.from(
        { length: Math.floor((max - min) / step) + 1 },
        (_, i) => min + (i * step)
    );

    console.log(maxMultiplier);
    const TOTAL_MARKS = 11;

    const getTrackPercentage = useCallback(() => {
        return ((value - min + 0.15) / (max - min + 0.25)) * 100;
    }, [value, min, max]);

    if (isLoading) return <div className="slider-skeleton">Loading multiplier data...</div>;
    if (error) return <div className="error-message">Error loading multiplier data: {error.message}</div>;

    return (
        <div className="step-slider-container">
            <div className="slider-labels">
                <span>Min</span>
                <span>Max</span>
            </div>
            <div className="slider-wrapper">
                <div
                    className="slider-track-fill"
                    style={{ 'width': `${getTrackPercentage()}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleMultiplierChange}
                    className="step-slider"
                />
                <div className="step-markers">
                    {steps.map((stepValue) => (
                        <div
                            key={stepValue}
                            className={`step-mark ${stepValue === value ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <div className="step-multipliers">
                    {Array.from({ length: TOTAL_MARKS }).map((_, index) => (
                        <div
                            key={index}
                            className={`step-multiplier ${index === value ? 'active' : ''}`}
                        >x{index}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultiplierSelector;