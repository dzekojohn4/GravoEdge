import React from 'react';
import ReportBugIcon from '../../assets/icons/customer-service-01.svg';

export function ReportBugButton({ onClick }) {
  return (
    <button
      className="border-border-color hover:bg-report-btn-bg-hover fixed top-[125px] right-[30px] z-10 flex h-[46px] cursor-pointer items-center gap-2 rounded-[12px] border-x border-y bg-[#11061E] px-6 py-3 transition-all"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <img src={ReportBugIcon} alt="bug-icon" className="inline h-4 w-4" />
      <p className="text-base font-normal text-[#e7ecf0]">Report Bug</p>
    </button>
  );
}
