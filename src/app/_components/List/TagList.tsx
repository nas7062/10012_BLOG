export default function TagList({
  tags,
  onDelete,
}: {
  tags?: string[];
  onDelete: (tagname: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags &&
        tags.map((tag, idx) => (
          <div
            onClick={() => onDelete(tag)}
            className="px-4 py-2 text-white bg-green-400 cursor-pointer hover:bg-green-500 rounded-2xl"
            key={idx}
          >
            {tag}
          </div>
        ))}
    </div>
  );
}
