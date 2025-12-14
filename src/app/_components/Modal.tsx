"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useModal } from "../provider/ModalProvider";
import SignInModal from "../(wide)/signin/_components/SignInModal";

type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpen, modalType, closeModal } = useModal();
  const router = useRouter();
  console.log("modal 콘솔", modalType);
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const el = dialogRef.current;
      try {
        el.showModal();
      } catch {
        el.setAttribute("open", "");
      }

      // Disable body scroll when modal is open
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";

      return () => {
        if (el.open) el.close();
        document.body.style.overflow = overflow;
      };
    }
  }, [isOpen]);

  const safeClose = () => {
    closeModal();
    router.back();
  };

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;
  return createPortal(
    <dialog
      ref={dialogRef}
      className="max-w-[40rem] w-[90vw] max-h-[60vh] rounded-lg p-4 absolute left-1/2 top-1/2 -translate-1/2 overflow-x-hidden"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && safeClose()}
      onCancel={(e) => {
        e.preventDefault();
        safeClose();
      }}
      onClose={safeClose}
    >
      {modalType === "SignInModal" && <SignInModal />}
      {children}
    </dialog>,
    document.getElementById("modal-root")!
  );
}
