import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import TiptapEditor from "./TiptapEditor";
import DocumentsStyles from "./Documents.module.css";
import useGetDocument from "../hooks/useGetDocument";
import useUpdateDocument from "../hooks/useUpdateDocument";

// Импортираме функциите от твоя auth.js файл
import { getToken, isAuthenticated } from "../utils/auth"; 

export default function DocumentEditor() {
    // ВАЖНО: Увери се, че параметърът тук съвпада с дефиницията в маршрута ($documentId или $docId)
    const { documentId } = useParams({ from: "/documents/$documentId" });
    const navigate = useNavigate();

    // 1. Използваме готовата функция от auth.js
    const token = getToken();

    // 2. Подаваме токена на хуковете
    const { document, loading, error } = useGetDocument(documentId, token);
    const { updateDocument, isUpdating } = useUpdateDocument(token);

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // 3. Защита: Използваме isAuthenticated() за проверка
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate({ to: "/login" });
        }
    }, [navigate]);

    // Зареждане на данните в стейта
    useEffect(() => {
        if (document) {
            setContent(document.content || "");
            setTitle(document.title || "Без заглавие");
        }
    }, [document]);

    const handleContentChange = (newContent) => {
        setContent(newContent);

        // Debounce за автоматично запазване
        if (window.contentTimeout) clearTimeout(window.contentTimeout);
        window.contentTimeout = setTimeout(() => {
            if (isAuthenticated()) {
                updateDocument(documentId, { content: newContent });
            }
        }, 1500);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        if (window.titleTimeout) clearTimeout(window.titleTimeout);
        window.titleTimeout = setTimeout(() => {
            if (isAuthenticated()) {
                updateDocument(documentId, { title: newTitle });
            }
        }, 1000);
    };

    const handleBack = () => {
        navigate({ to: "/documents" });
    };

    // Ако не е логнат, не рендерваме нищо докато трае useEffect пренасочването
    if (!isAuthenticated()) return null;
    
    if (loading) {
        return <div className={DocumentsStyles.loading}>Зареждане на документа...</div>;
    }

    if (error) {
        return <div className={DocumentsStyles.error}>Грешка при зареждане на документа.</div>;
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