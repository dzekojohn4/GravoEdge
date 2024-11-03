import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosInstance } from 'utils/axios';
import { ZETH_ADDRESS } from 'utils/constants';
import { ReactComponent as CollateralIcon } from 'assets/icons/collateral.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as UsdIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as BorrowIcon } from 'assets/icons/borrow.svg';
import { ReactComponent as StrkIcon } from 'assets/icons/strk.svg';

const fetchCardData = async (walletId) => {
  if (!walletId) {
    console.error('fetchCardData: walletId is undefined');
    return null;
  }
  try {
    const response = await axiosInstance.get(`/api/dashboard?wallet_id=${walletId}`);
    return response.data;
  } catch (error) {
    console.error('Error during getting the data from API', error);
    return null;
  }
};

export const useDashboardData = (walletId) => {
  const [cardData, setCardData] = useState([
    {
      title: 'Collateral & Earnings',
      icon: CollateralIcon,
      balance: '0.00',
      currencyName: 'Ethereum',
      currencyIcon: EthIcon,
    },
    {
      title: 'Borrow',
      icon: BorrowIcon,
      balance: '0.00',
      currencyName: 'USD Coin',
      currencyIcon: UsdIcon,
    },
  ]);

  const [healthFactor, setHealthFactor] = useState('0.00');
  const [currentSum, setCurrentSum] = useState(0);

  const { isLoading } = useQuery({
    queryKey: ['dashboardData', walletId],
    queryFn: () => fetchCardData(walletId),
    enabled: !!walletId,
    onSuccess: (data) => {
      if (data && data.zklend_position && data.zklend_position.products) {
        const positions = data.zklend_position.products[0].positions || [];
        const healthRatio = data.zklend_position.products[0].health_ratio;

        const updatedCardData = positions.map((position, index) => {
          const isFirstCard = index === 0;
          const tokenAddress = position.tokenAddress;

          if (isFirstCard) {
            const isEthereum = tokenAddress === ZETH_ADDRESS;
            const balance = parseFloat(position.totalBalances[Object.keys(position.totalBalances)[0]]);
            setCurrentSum(balance);

            return {
              title: 'Collateral & Earnings',
              icon: CollateralIcon,
              balance: balance,
              currencyName: isEthereum ? 'Ethereum' : 'STRK',
              currencyIcon: isEthereum ? EthIcon : StrkIcon,
            };
          }

          return {
            title: 'Borrow',
            icon: BorrowIcon,
            balance: position.totalBalances[Object.keys(position.totalBalances)[0]],
            currencyName: 'USD Coin',
            currencyIcon: UsdIcon,
          };
        });

        setCardData(updatedCardData);
        setHealthFactor(healthRatio);
      } else {
        console.error('Data is missing or incorrectly formatted');
      }
    },
  });

  return { cardData, healthFactor, currentSum, isLoading };
};
