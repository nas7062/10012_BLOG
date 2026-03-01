"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalType =
  | "SignInModal"
  | "SignUpModal"
  | "LoginModal"
  | "DeletePost"
  | "DeleteComment";

type ModalContextType = {
  isOpen: boolean;
  modalType: ModalType | null;
  modalData?: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setIsOpen(true);
    setModalData(data ?? null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, modalType, openModal, closeModal, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};
