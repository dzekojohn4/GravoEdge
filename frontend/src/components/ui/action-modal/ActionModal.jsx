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
      className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50"
      onClick={cancelAction}
    >
      <div
        className="flex items-center justify-center shadow-primary-color overflow-hidden md:w-xl sm:w-lg w-full text-white px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl max-w-2xl w-full flex flex-col gap-6 text-center">
          <div className="text-center py-4 border-nav-divider-bg  bg-bg rounded-3xl max-h-80 text-sm md:rounded-2xl pt-4 h-56 border">
            <div className="text-primary text-center text-base border-b-nav-divider-bg  pb-2 border-b mb-6 w-full">
              {title}
            </div>
            <div className="px-2">
              <h6 className="text-sm px-2 ">{subTitle}</h6>
              {content.map((content, i) => (
                <p className="text-gray-500 text-base leading-6 max-w-96 mt-0 mx-auto mb-3" key={i}>
                  {content}
                </p>
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-between">
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
