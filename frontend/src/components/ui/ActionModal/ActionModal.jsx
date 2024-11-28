import React from 'react';
import './actionModal.css';
import { Button } from '../Button';
import { useEffect } from 'react';
const ActionModal = ({
  title,
  subTitle,
  content,
  cancelLabel = 'Cancel',
  cancelAction,
  submitLabel,
  submitAction,
  isLoading = false,
}) => {
  useEffect(() => {
    // Lock scrolling when component is rendered
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup to restore scrolling when component is unmounted
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={cancelAction}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box">
          <div className="modal-content">
            <div className="modal-title">{title}</div>
            <h2>{subTitle}</h2>
            {content.map((content, i) => (
              <p key={i}>{content}</p>
            ))}
          </div>
          <div className="modal-actions">
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
