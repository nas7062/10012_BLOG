"use client";
import { useEffect, useRef } from "react";
import { useModal } from "../../provider/ModalProvider";
import { usePathname } from "next/navigation";

export default function LoginPage() {
  const { openModal, isOpen } = useModal();
  const pathname = usePathname();
  const openedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/signin") return;
    if (openedRef.current) return;
    if (isOpen) return;

    openedRef.current = true;
    openModal("SignInModal", { autoBack: true });
  }, [pathname, isOpen, openModal]);

  return null;
}
