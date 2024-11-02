import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { ReactComponent as TwitterIcon } from 'assets/icons/twitter.svg';
import { ReactComponent as TelegramIcon } from 'assets/icons/telegram.svg';
import { ReactComponent as DiscordIcon } from 'assets/icons/discord.svg';
import './footer.css';

const SocialCard = ({ href, Icon, name }) => (
  <div className="social-card">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit our ${name} page`}
    >
      <Icon />
      <p>{name}</p>
    </a>
  </div>
);

function Footer() {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: 'https://x.com'
    },
    {
      name: 'Discord',
      icon: DiscordIcon,
      href: 'https://discord.com'
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: 'https://t.me/djeck_vorobey1'
    }
  ];

  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <div className='footer-logo'>
          <Link to='/' aria-label='Go to homepage'>
            <Logo />
          </Link>
        </div>
        <div>
          <h2 className='follow-us-text'>Follow us on</h2>
          <div className='footer-social-cards'>
            {socialLinks.map((social) => (
              <SocialCard
                key={social.name}
                href={social.href}
                Icon={social.icon}
                name={social.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="line-text-container">
        <div className="footer-line" aria-hidden="true" />
        <div className="footer-text">©{new Date().getFullYear()}. Spotnet All Rights Reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;