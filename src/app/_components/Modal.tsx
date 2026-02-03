"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useModal } from "../provider/ModalProvider";


export const MODAL_REGISTRY = {
  SignInModal: dynamic(() =>
    import("../(wide)/signin/_components/SignInModal")
  ),
  SignUpModal: dynamic(() =>
    import("../(wide)/signup/_components/SignUpModal")
  ),
  LoginModal: dynamic(() => import("./LoginModal")),
  DeletePost: dynamic(() =>
    import("../(narrow)/[name]/posts/_components/DeletePostModal")
  ),
  DeleteComment: dynamic(() =>
    import("../(narrow)/[name]/posts/_components/DeleteCommentModal")
  ),
} as const;

export type ModalType = keyof typeof MODAL_REGISTRY;



type ModalProps = {
  children?: React.ReactNode;
};

export default function Modal({ children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpen, modalType, closeModal, modalData } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const isAutoOpeningRef = useRef(false);



  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const el = dialogRef.current;

    try {
      el.showModal();
    } catch {
      el.setAttribute("open", "");
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (el.open) el.close();
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);


  useEffect(() => {
    if ((pathname === "/signin" || pathname === "/signup") && !isOpen) {
      isAutoOpeningRef.current = true;
      const timer = setTimeout(() => {
        isAutoOpeningRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  const safeClose = () => {
    closeModal();

    const shouldBack =
      (pathname === "/signin" || pathname === "/signup") &&
      isAutoOpeningRef.current;

    if (shouldBack) {
      setTimeout(() => router.back(), 0);
    }
  };

  if (!isOpen || typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  

  const ModalComponent =
    modalType ? MODAL_REGISTRY[modalType] : null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="max-w-[450px] w-[92vw] max-h-[60vh] shadow-xl border border-gray-100 bg-linear-to-br rounded-2xl from-emerald-500 via-green-300 to-teal-400 backdrop-blur-sm p-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      onClick={(e) => e.target === e.currentTarget && safeClose()}
      onCancel={(e) => {
        e.preventDefault();
        safeClose();
      }}
      onClose={safeClose}
    >
      {ModalComponent && (
        <ModalComponent {...modalData} onClose={safeClose} />
      )}
      {children}
    </dialog>,
    modalRoot
  );
}
