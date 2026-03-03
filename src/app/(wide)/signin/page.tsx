"use client";

import { useEffect, useRef } from "react";
import { useModal } from "../../../provider/ModalProvider";
import { useSearchParams } from "next/navigation";
import SignInModal from "./_components/SignInModal";

export default function LoginPage() {
  const { openModal } = useModal();
  const openedRef = useRef(false);
  const sp = useSearchParams();

  const e2e = sp.get("e2e") === "1";

  useEffect(() => {
    if (e2e) return;
    if (openedRef.current) return;
    openedRef.current = true;
    openModal("SignInModal", { autoBack: true });
  }, [openModal, e2e]);


  if (e2e) return <SignInModal />;

  return null;
}