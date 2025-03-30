import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { TypeOptions } from "react-toastify";

const defaultStyles = {
  success: { backgroundColor: "green", color: "white" },
  error: { backgroundColor: "red", color: "white" },
  warning: { backgroundColor: "orange", color: "white" },
  info: { backgroundColor: "blue", color: "white" },
};

const ToastWithLink = (message: string, link: string, linkMessage: string) => (
  <div>
    <span>{message}</span>{" "}
    <a target="_blank" href={link} rel="noreferrer">
      {linkMessage}
    </a>
  </div>
);

const notify = (message: string, type = "info", autoClose = 3000) =>
  toast(message, {
    type: type as TypeOptions,
    autoClose,
    style:
      defaultStyles[type as keyof typeof defaultStyles] || defaultStyles.info,
  });

const Notifier = () => {
  return (
    <div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export { Notifier, notify, ToastWithLink };
