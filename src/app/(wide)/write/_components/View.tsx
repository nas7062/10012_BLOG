import dynamic from "next/dynamic";
import "@/src/styles/markdown.module.css";
const MDEditorMarkdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted rounded-md h-64 w-full" />
    ),
  }
);

export default function Viewer({ content }: { content: string }) {
  return (
    <div
      className="wmde-markdown wmde-markdown-color
                 bg-background text-foreground "
    >
      <MDEditorMarkdown source={content} />
    </div>
  );
}
