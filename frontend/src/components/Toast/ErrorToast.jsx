import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react'

const notifyError = (message, id, autoClose) => {
    toast.error(message, {toastId: id || undefined, autoClose: autoClose !== undefined ? autoClose : 3000} );
  };

const ErrorToast = () => {
  return (
    <div>
        <ToastContainer position='top-center' />
    </div>
  )
}

export {ErrorToast, notifyError}
