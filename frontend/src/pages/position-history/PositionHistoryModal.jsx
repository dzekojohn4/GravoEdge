import React from 'react';

function PositionHistoryModal({ position, onClose, index, tokenIcon, statusStyles }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2E] rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg font-semibold">
            <span>
              <span>{index}.</span>
              {tokenIcon[position.token_symbol]}
              {position.token_symbol}
            </span>
            <span className="ml-2">{position.amount}</span>
            <span className={`ml-2 ${statusStyles[position.status.toLowerCase()] || ''}`}>
              {position.status}
            </span>
          </p>

          <button onClick={onClose} className="text-white text-xl hover:text-gray-400 transition-colors" aria-label="Close Account Info Modal Box">
            ✕
          </button>
        </div>
        <hr className="border-t border-gray-700 mb-4" />
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <p>Start Price</p>
            <span>{position.start_price}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Multiplier</p>
            <span>{position.multiplier}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Liquidated</p>
            <span>{position.is_liquidated ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Created At</p>
            <span>{position.created_at}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Closed At</p>
            <span>{position.closed_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionHistoryModal;