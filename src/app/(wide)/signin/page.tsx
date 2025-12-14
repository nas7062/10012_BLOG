"use client";
import { useEffect } from "react";
import SignInModal from "./_components/SignInModal";
import { useModal } from "../../provider/ModalProvider";

export default function LoginPage() {
  const { openModal } = useModal();

  useEffect(() => {
    openModal("SignInModal"); // 로그인 모달 열기
  }, [openModal]);
  return <SignInModal />;
}
