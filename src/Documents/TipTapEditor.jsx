import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DocumentsStyles from "./Documents.module.css";

export default function TiptapEditor({ content, onContentChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (onContentChange) {
                onContentChange(html);
            }
        },
    });

    return (
        <div className={DocumentsStyles["tiptap-editor"]}>
            <EditorContent editor={editor} />
        </div>
    );
}