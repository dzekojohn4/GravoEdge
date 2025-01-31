import React from 'react';
import { Button } from '@/components/ui/custom-button/Button';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

const ActionModal = ({
  isOpen,
  title,
  subTitle,
  content = [],
  cancelLabel = 'Cancel',
  cancelAction,
  submitLabel,
  submitAction,
  isLoading = false,
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-[#00000080] backdrop-blur-sm z-[9999]"
      onClick={cancelAction}
    >
      <div
        className="flex items-center justify-center shadow-[#0b0c10] overflow-hidden max-[1024]:w-[580px] max-[768px]:w-[500px] max-[320px]:w-[300px] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl max-w-[700px] w-full flex flex-col gap-6 text-center max-[768px]:rounded-[16px] max-[768px]:gap-[16px] max-[320px]:w-[300px] ">
          <div className="text-center py-4 border-[#36294e]  bg-[#120721] rounded-3xl min-h-[300px] max-[1024px]:text-sm max-[1024px]:max-[1024px]:rounded-[16px] max-[1024px]:pt-[16px] max-[768px]:h-[200px]">
            <div className="text-[#fff] text-center text-base border-b-[#ffffff1a] pb-2 border-b mb-[24px] w-full">
              {title}
            </div>
            <h6 className="text-sm px-2 ">{subTitle}</h6>
            {content.map((content, i) => (
              <p className="text-gray-500 text-base leading-6 max-w-[380px] mt-0 mx-auto mb-3 max-[768px]:text-[12px]" key={i}>
                {content}
              </p>
            ))}
          </div>
          <div className="flex gap-4 max-[1024px]:gap-[14px] max-[768px]:gap-[8px] max-[768px]:justify-center">
            <Button variant="secondary" size="md" className="modal-btn" onClick={cancelAction} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="md" onClick={submitAction} disabled={isLoading}>
              {isLoading ? 'Loading...' : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
