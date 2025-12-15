"use client";
import { useEffect } from "react";
import { useModal } from "../../provider/ModalProvider";
import { usePathname } from "next/navigation";
import Modal from "../../_components/Modal";

export default function LoginPage() {
  const { openModal, isOpen } = useModal();
  const pathname = usePathname();

  useEffect(() => {
    // pathname이 /signin이고 모달이 닫혀있을 때만 모달 열기
    if (pathname === "/signin" && !isOpen) {
      openModal("SignInModal");
    }
  }, [pathname, openModal, isOpen]);

  return <Modal />;
}
