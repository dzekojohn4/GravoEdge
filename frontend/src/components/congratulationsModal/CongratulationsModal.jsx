
import React from 'react';
import './CongratulationsModal.css';
import done from '../../assets/images/done-badge.svg';
import { useNavigate } from 'react-router-dom';
function CongratulationsModal({ message }) {
    const navigate = useNavigate();
    return (
        <div className="congratulationsModal">
            <h1>Congratulations</h1>
            <p>{message}</p>
            <img src={done} alt="" />
            <button className="gradient-button" onClick={() => navigate('/')}>
                <span>Back to homepage</span>
            </button>
        </div>
    );
}

export default CongratulationsModal;
