interface ModalProps {
  onDelete: () => void;
  onClose: () => void;
}
export default function DeleteCommentModal({ onDelete, onClose }: ModalProps) {
  return (
    <div className="flex flex-col  gap-4 p-4 ">
      <h2 className="text-2xl! font-semibold text-center">
        정말로 삭제하시겠어요??
      </h2>
      <p className="text-gray-700 text-center">삭제 시 되돌릴 수 없습니다.</p>
      <div className="flex justify-around gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white flex-1 cursor-pointer hover:bg-gray-400  transition-colors duration-300"
        >
          취소
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-400 text-white flex-1 cursor-pointer hover:bg-red-500 transition-colors duration-300"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
