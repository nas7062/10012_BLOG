"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { useModal } from "../provider/ModalProvider";
import SignInModal from "../(wide)/signin/_components/SignInModal";
import SignUpModal from "../(wide)/signup/_components/SignUpModal";
import LoginModal from "./LoginModal";
import DeletePostModal from "../(narrow)/[name]/posts/_components/DeletePostModal";
import DeleteCommentModal from "../(narrow)/[name]/posts/_components/DeleteCommentModal";

type ModalProps = {
  children?: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpen, modalType, closeModal, modalData } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const isAutoOpeningRef = useRef(false); // 모달이 자동으로 열리는지 추적

  console.log(modalType, modalData);
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const el = dialogRef.current;
      try {
        el.showModal();
      } catch {
        el.setAttribute("open", "");
      }

      // 모달이 열릴 때 body 스크롤 비활성화
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";

      return () => {
        if (el.open) el.close();
        document.body.style.overflow = overflow;
      };
    }
  }, [isOpen]);

  // signin/signup 페이지에서 모달이 자동으로 열릴 때 플래그 설정
  useEffect(() => {
    if ((pathname === "/signin" || pathname === "/signup") && !isOpen) {
      // 모달이 곧 열릴 예정이므로 자동 열기 플래그 설정
      isAutoOpeningRef.current = true;
      // 모달이 열린 후 플래그 리셋
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

  if (typeof window === "undefined") return null;

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("modal-root element not found");
    return null;
  }

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
      {modalType === "SignUpModal" && <SignUpModal />}
      {modalType === "LoginModal" && <LoginModal />}
      {modalType === "DeletePost" && (
        <DeletePostModal onDelete={modalData?.onDelete} onClose={closeModal} />
      )}

      {modalType === "DeleteComment" && (
        <DeleteCommentModal
          onDelete={modalData?.onDelete}
          onClose={closeModal}
        />
      )}
      {children}
    </dialog>,
    modalRoot
  );
}
