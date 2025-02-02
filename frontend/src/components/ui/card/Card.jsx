function Card({ label, icon, value = '', cardData = [] }) {
  return (
    <div className="border-light-purple xs:h-auto flex h-[101px] grow flex-col items-center justify-center rounded-lg border-1 bg-transparent p-4 text-center sm:h-[90px] sm:w-full lg:w-[317px]">
      <div className="mb-2 flex items-center justify-center">
        {icon}
        <span className="text-gray ml-2 text-sm font-semibold sm:font-normal">{label}</span>
      </div>

      <div className="text-2xl font-semibold md:text-2xl">
        {cardData.length > 0 ? (
          <>
            <span className="mr-1">$</span>
            <span>{cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}</span>
          </>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
}

export default Card;
