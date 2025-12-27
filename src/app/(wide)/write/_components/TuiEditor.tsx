"use client";
import dynamic from "next/dynamic";
import React from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-lg w-full h-[500px]" />
  ),
});

interface TuiEditorProps {
  content: string;
  contentChange: (value: string) => void;
}

const TuiEditor: React.FC<TuiEditorProps> = ({ content, contentChange }) => {
  return (
    <div className="w-full" data-color-mode="light">
      <MDEditor
        height={500}
        value={content}
        onChange={(value) => contentChange(value || "")}
        preview="edit"
      />
    </div>
  );
};

export default TuiEditor;
