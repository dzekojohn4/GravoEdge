import React from 'react';

const Spinner = ({ loading }) => {
  return (
    loading && (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#00000080] z-[999]">
        <div className="flex justify-center items-center rounded-[8px] py-3 px-[34px] w-[250px] h-[68px] bg-[#393939]">
          <div className="h-9 w-9 mr-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="font-semibold text-[28px] text-[#fff]">Loading...</span>
        </div>
      </div>
    )
  );
};

export default Spinner;
