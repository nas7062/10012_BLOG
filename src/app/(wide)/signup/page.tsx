"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "../../provider/ModalProvider";

export default function SignupPage() {
  const { openModal, isOpen } = useModal();
  const pathname = usePathname();
  const openedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/signup") return;
    if (openedRef.current) return;
    if (isOpen) return;

    openedRef.current = true;
    openModal("SignUpModal", { autoBack: true });
  }, [pathname, isOpen, openModal]);

  return null;
}
