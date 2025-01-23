import React from "react"
import "./ReportBugModal.css"
import telegramIcon from "../../assets/icons/telegram icon.png"
import bg from "../../assets/images/background-form.png"
import { Button } from "components/ui/custom-button/Button"


export function ReportBugModal({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault()
        onClose()
    }

    return (
        <div onClick={onClose} style={{ backgroundImage: `url(${bg})`, backgroundSize: 'contain' }} className="modal-overlay">
            <form className="report-bug-form" onClick={(e) => {
                e.stopPropagation();
            }} onSubmit={handleSubmit} >
                <div className="modal-content">
                    <h2 >Report Bug</h2>


                    <p>Please describe the bug you've encountered</p>
                    <textarea placeholder="The bug I'm experiencing..." className="bug-textarea" />

                    <a className="dev-group-link" href="https://t.me/spotnet_dev">

                        <img src={telegramIcon} alt="telegram-icon" className="telegram-icon" />
                        Ask in our Dev group
                    </a>
                </div>
                <div className="button-group">
                    <Button variant="secondary" type="button" className="cancel-button" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="submit-button">
                        Send Report
                    </Button>
                </div>


            </form>
        </div>

    )
}
