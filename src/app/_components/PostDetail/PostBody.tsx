import Viewer from "../../(wide)/write/_components/View";

interface PostBodyProps {
  content: string;
}

export function PostBody({ content }: PostBodyProps) {
  return (
    <div className="wmde-markdown wmde-markdown-color bg-background text-foreground">
      <Viewer content={content} />
    </div>
  );
}
