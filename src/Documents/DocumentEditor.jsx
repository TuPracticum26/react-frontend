import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import TiptapEditor from "./TiptapEditor";
import DocumentsStyles from "./Documents.module.css";
import useGetDocument from "../hooks/useGetDocument";
import useUpdateDocument from "../hooks/useUpdateDocument";

export default function DocumentEditor() {
    const { documentId } = useParams({ from: "/documents/$documentId" });
    const navigate = useNavigate();
    const { document, loading } = useGetDocument(documentId);
    const { updateDocument, isUpdating } = useUpdateDocument();

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // Зареждане на документа
    useEffect(() => {
        if (document) {
            setContent(document.content || "<p>Започнете да пишете...</p>");
            setTitle(document.title || "Без заглавие");
        }
    }, [document]);

    const handleContentChange = (newContent) => {
        setContent(newContent);

        // Автоматично запазване при спиране на писането
        if (window.contentTimeout) clearTimeout(window.contentTimeout);
        window.contentTimeout = setTimeout(() => {
            updateDocument(documentId, { content: newContent });
        }, 1500);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Автоматично запазване на заглавието
        if (window.titleTimeout) clearTimeout(window.titleTimeout);
        window.titleTimeout = setTimeout(() => {
            updateDocument(documentId, { title: newTitle });
        }, 1000);
    };

    const handleBack = () => {
        navigate({ to: "/documents" });
    };

    if (loading) {
        return <div className={DocumentsStyles.loading}>Зареждане на документа...</div>;
    }

    return (
        <div className={DocumentsStyles["document-editor-container"]}>
            <div className={DocumentsStyles["editor-header"]}>
                <button onClick={handleBack} className={DocumentsStyles["back-button"]}>
                    ← Назад към документите
                </button>
                {isUpdating && (
                    <span className={DocumentsStyles["saving-indicator"]}>Запазване...</span>
                )}
            </div>

            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className={DocumentsStyles["document-title-input"]}
                placeholder="Заглавие на документа"
            />

            <TiptapEditor
                content={content}
                onContentChange={handleContentChange}
            />
        </div>
    );
}