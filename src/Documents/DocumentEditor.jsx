import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import TiptapEditor from "./TiptapEditor";
import DocumentsStyles from "./Documents.module.css";
import useGetDocument from "../hooks/useGetDocument";
import useUpdateDocument from "../hooks/useUpdateDocument";

export default function DocumentEditor() {
    const { documentId } = useParams({ from: "/documents/$documentId" });
    const navigate = useNavigate();

    // 1. Взимаме токена от localStorage по същия начин като в Header/Sidebar
    const tokenData = localStorage.getItem("token");
    const userData = tokenData ? JSON.parse(tokenData) : null;
    const token = userData?.token; // Предполагаме, че структурата е { token: "...", user: {...} }

    // 2. Подаваме токена на хуковете (увери се, че хуковете ти го приемат)
    const { document, loading, error } = useGetDocument(documentId, token);
    const { updateDocument, isUpdating } = useUpdateDocument(token);

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // 3. Ако няма токен или има грешка в аутентикацията, пренасочваме към логин
    useEffect(() => {
        if (!token) {
            navigate({ to: "/login" });
        }
    }, [token, navigate]);

    // Зареждане на документа
    useEffect(() => {
        if (document) {
            setContent(document.content || "<p>Започнете да пишете...</p>");
            setTitle(document.title || "Без заглавие");
        }
    }, [document]);

    const handleContentChange = (newContent) => {
        setContent(newContent);

        // Автоматично запазване (Debounce логика)
        if (window.contentTimeout) clearTimeout(window.contentTimeout);
        window.contentTimeout = setTimeout(() => {
            if (token) {
                updateDocument(documentId, { content: newContent });
            }
        }, 1500);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        if (window.titleTimeout) clearTimeout(window.titleTimeout);
        window.titleTimeout = setTimeout(() => {
            if (token) {
                updateDocument(documentId, { title: newTitle });
            }
        }, 1000);
    };

    const handleBack = () => {
        navigate({ to: "/documents" });
    };

    // Обработка на състояния
    if (!token) return null;
    
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