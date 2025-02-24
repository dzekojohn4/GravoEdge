const socials = [
  {
    icon: "./src/assets/images/DiscordLogo.png",
    link: "https://discord.com/",
  },
  {
    icon: "./src/assets/images/XLogo.png",
    link: "https://twitter.com/SpotNet_123",
  },
  {
    icon: "./src/assets/images/TelegramLogo.png",
    link: "https://t.me/djeck_vorobey1",
  },
];
export function Footer() {
  return (
    <div className="hidden md:w-11/12 xl:w-[1280px] px-10 pb-10 pt-6 mx-auto h-[88px] md:flex  justify-between">
      <h4 className="font-bold uppercase font-instrumentsans text-text text-logo leading-logo">
        Margin
      </h4>
      <div className="flex items-center h-6 gap-6">
        {socials.map((social, index) => (
          <a href={social.link} key={index}>
            <img src={social.icon} alt="" className="w-6 h-6" />
          </a>
        ))}
      </div>
    </div>
  );
}
