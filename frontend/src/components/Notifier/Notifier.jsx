import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message, id, autoClose) => toast(message, {toastId: id || undefined, autoClose: autoClose !== undefined ? autoClose : 3000});

const Notifier = () => {
  return (
    <div>
      <ToastContainer position='top-center' />
    </div>
  );
};

export { Notifier, notify };
