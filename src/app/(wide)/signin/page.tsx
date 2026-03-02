"use client";
import { useEffect, useRef } from "react";
import { useModal } from "../../../provider/ModalProvider";
import { usePathname } from "next/navigation";
import SignInModal from "./_components/SignInModal";

export default function LoginPage() {
  const { openModal } = useModal();
  const pathname = usePathname();
  const openedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/signin") return;
    if (openedRef.current) return;
    //if (isOpen) return;

    openedRef.current = true;
    openModal("SignInModal", { autoBack: true });
  }, [pathname, openModal]);

  return (
    
        <SignInModal />
      
  );
}
