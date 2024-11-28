import React from 'react';
import './actionModal.css'
import { Button } from '../Button';
const ActionModal = ({title, subTitle, content, cancelLabel="Cancel", cancelAction, submitLabel, submitAction, isLoading = false}) =>{
    return (
    <div className="modal-overlay">
    <div className="modal-wrapper">
      <div className="modal-box">
        <div className="modal-content">
          <div className="modal-title">{title}</div>
          <h2>
            {subTitle}
          </h2>
          {
            content.map((content, i)=><p key={i}>{content}</p>)
          }
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
  )
}

export default ActionModal;