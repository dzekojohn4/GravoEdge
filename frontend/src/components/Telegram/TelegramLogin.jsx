import React, { useState, useEffect } from 'react';
import './telegramLogin.css';

const TelegramLogin = ({ user, onLogin }) => {
    useEffect(() => {
        const initTelegramLogin = () => {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const user = tg.initDataUnsafe?.user;
            if (user) {
                onLogin(user);
            }
        };

        initTelegramLogin();
    }, [onLogin]);

    const handleLogin = () => {
        window.Telegram.Login.auth({
            bot_id: "BOT_ID",
            request_access: 'write'
        }, onLogin)
    };
    window.console.log(user.photo_url);
    return (
        <div className="telegram-login">
            {user ? (
                <div className="user-info">
                    <img src={user.photo_url} alt={user.first_name} className="user-photo" />
                    <span className="user-name">{user.first_name}</span>
                </div>
            ) : (
                <button className="btn-telegram" onClick={handleLogin}>
                    Login with Telegram
                </button>
            )}
        </div>
    );
};

export default TelegramLogin;
