import React from "react"
import "./ReportBugModal.css"

export function ReportBugModal({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault()
        onClose()
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Report Bug</h2>
                <form onSubmit={handleSubmit}>
                    <p>Please describe the bug you've encountered</p>
                    <textarea placeholder="The bug I'm experiencing..." className="bug-textarea" />

                    <div className="dev-group-link">
                        <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                        Ask in our Dev group
                    </div>

                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Send Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
