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
      className="fixed top-0 left-0 z-[55555] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={cancelAction}
    >
      <div
        className="shadow-primary-color flex w-lg items-center justify-center overflow-hidden text-white md:w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full max-w-[330px] flex-col gap-4 rounded-2xl text-center sm:w-8/12 sm:max-w-md">
          <div className="border-nav-divider-bg bg-bg h-fit rounded-2xl border py-4 pt-4 text-center text-sm md:rounded-2xl">
            <div className="text-primary border-b-nav-divider-bg mb-6 w-full border-b pt-1 pb-2 text-center text-xs">
              {title}
            </div>
            <div className="grid min-h-28 place-content-center px-2">
              <h6 className="text-sm font-semibold">{subTitle}</h6>
              {content.map((content, i) => (
                <p className="mx-auto mt-0 mb-3 max-w-96 text-base leading-6 text-gray-500" key={i}>
                  {content}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-4">
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
