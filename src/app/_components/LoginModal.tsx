import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function LoginModal() {
  const router = useRouter();
  return (
    <Modal>
      <div className="flex flex-col  gap-4 p-4">
        <h2 className="text-lg!  sm:text-2xl! font-semibold text-center">
          로그인을 해야만 가능합니다.
        </h2>
        <p className="text-gray-500 text-center">
          로그인 후 다양한 기능과 나만의 기록을 남겨봐요.
        </p>
        <div className="flex justify-around gap-4 ">
          <button className="px-4 py-2 bg-gray-500 text-white flex-1 cursor-pointer hover:bg-gray-400  transition-colors duration-300">
            취소
          </button>
          <button
            onClick={() => {
              router.push("/signin");
            }}
            className="px-4 py-2 bg-green-400 text-white flex-1 cursor-pointer hover:bg-green-500 transition-colors duration-300"
          >
            로그인 하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
