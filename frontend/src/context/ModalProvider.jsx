import React, { createContext, useContext, useState } from "react";

// Create the Modal Context
const ModalContext = createContext();

// Modal Provider Component
export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // Open the modal with optional content
    const openModal = (content) => {
        setModalContent(content || null);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
            {children}
            {isModalOpen && modalContent}
        </ModalContext.Provider>
    );
};

// Custom hook to use Modal Context
export const useModal = () => {
    return useContext(ModalContext);
};
