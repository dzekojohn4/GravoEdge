import React from 'react';
import { ReactComponent as SettingIcon } from 'assets/icons/settings.svg';


export default function GasFee() {
    return (
        <div className="main-card-footer">
            <div className="divider"></div>
            <div className="settings-fee-container">
                <div className="setting-circle">
                    <SettingIcon className="setting-icon" />
                </div>
                <div className="fee-title">Gas fee: 0.00 STRK</div>
            </div>
        </div>
    );
}
