"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "../../provider/ModalProvider";
import Modal from "../../_components/Modal";

export default function SignupPage() {
  const { openModal, isOpen } = useModal();
  const pathname = usePathname();

  useEffect(() => {
    // pathname이 /signup이고 모달이 닫혀있을 때만 모달 열기
    if (pathname === "/signup" && !isOpen) {
      openModal("SignUpModal"); // 회원가입 모달 열기
    }
  }, [pathname, openModal, isOpen]);

  return <Modal />;
}
