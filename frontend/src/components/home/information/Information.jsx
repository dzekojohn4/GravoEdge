import './information.css';
import React, { useEffect, useState } from 'react';
import StarMaker from '@/components/layout/star-maker/StarMaker';
import { axiosInstance } from '@/utils/axios';

const Information = () => {
  const [data, setData] = useState({ total_opened_amount: 0, unique_users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/get_stats`);
        setData({
          total_opened_amount: response.data.total_opened_amount,
          unique_users: response.data.unique_users,
        });
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const starData = [
    { top: 9, left: -6.2, size: 20 },
    { top: 30, left: 39, size: 15 },
    { top: -8, left: 85, size: 18 },
    { top: 74, left: 43, size: 22 },
  ];

  const formatCurrency = (value) => {
    if (value < 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="h-auto flex items-center justify-center px-[3em] md:px-[5em]">
      <div className=" relative w-[100%] max-w-6xl flex flex-col lg:flex-row justify-around lg:mt-[190px] lg:mb-[180px] mt-[4em] gap-[2em]  ">
        <div className=" flex flex-col lg:w-[420px] h-[250px] bg-[linear-gradient(135deg,_rgba(116,_214,_253,_0.5)_0%,_rgba(11,_12,_16,_0.5)_100%)] 
              rounded-[20px] shadow-card backdrop-blur-[21.09375px] border border-[#4e7787] text-[38px] text-white text-center font-[600] p-[0.1em] "> 
          <h1>TVL</h1>
          <h3 className={loading ? 'text-[35px] min-h-35px font-text font-[600] leading-[95%] text-center items-center mb-0 mt-[3px]' : ''}>
            {loading ? 'Loading...' : error ? `Error: ${error}` : formatCurrency(data.total_opened_amount)}
          </h3>
        </div>
        <div className="infos">
          <div className="card-gradient"></div>
          <div className="card-gradient"></div>
        </div>
        <div className="flex flex-col lg:w-[420px] h-[250px] bg-[linear-gradient(135deg,_rgba(116,_214,_253,_0.5)_0%,_rgba(11,_12,_16,_0.5)_100%)] 
              rounded-[20px] shadow-card backdrop-blur-[21.09375px] border border-[#4e7787] text-[38px] font-[600] p-[0.1em] text-white text-center">
          <h1>Users</h1>
          <h3 className={loading ? '  text-[35px] min-h-35px font-text font-[600] leading-[95%] text-center items-center mb-0 mt-[3px]' : ''}>
            {loading ? 'Loading...' : error ? `Error: ${error}` : data.unique_users}
          </h3>
        </div>
        <StarMaker starData={starData} />
      </div>
    </div>
  );
};

export default Information;
