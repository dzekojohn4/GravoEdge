import React from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg?react';

export default function PositionPagination({
  currentPage,
  setCurrentPage,
  isPending,
  tableData,
  positionsOnPage,
}) {
  const totalItems = tableData?.total_count || 0;
  const totalPages = Math.ceil(totalItems / positionsOnPage);
  const range = (length, startIdx = 1) =>
    [...Array(length).keys()].map((i) => i + startIdx);

  const setPage = (page) => {
    if (isPending || page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center gap-12 mt-[-4]">
      <button
        className={`flex justify-center items-center w-6 h-6 rounded-full bg-[#36294E] ${
          currentPage === 1 ? 'bg-[#2B1A3D] cursor-default' : 'cursor-pointer'
        }`}
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon className={`stroke-current ${currentPage === 1 ? 'text-[#41304A]' : 'text-[#6B5A8A]'}`} />
      </button>
      <div className="flex items-center justify-center gap-4">
        {range(totalPages).map((page) => (
          <button
            className={`text-xs font-normal text-[#41304A] cursor-pointer ${
              currentPage === page ? 'font-semibold text-[#6B5A8A]' : ''
            }`}
            key={page}
            onClick={() => setPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className={`flex justify-center items-center w-6 h-6 rounded-full bg-[#36294E]  ${
          currentPage === totalPages ? 'bg-[#2B1A3D] cursor-default' : 'cursor-pointer'
        }`}
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowRightIcon className={`stroke-current ${currentPage === totalPages ? 'text-[#41304A]' : 'text-[#6B5A8A]'}`} />
      </button>
    </div>
  );
}