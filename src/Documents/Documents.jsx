import DocumentsStyles from "./Documents.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getUser, getToken } from "../utils/auth"; 
import { Spinner } from "@radix-ui/themes";

export default function Documents() {
    const navigate = useNavigate();
    
    // 1. Вземаме данните безопасно
    const user = getUser();
    const token = getToken();

    // 2. Вземаме документите и състоянието на зареждане от хука
    // Увери се, че useGetDocuments връща { documents, loading }
    const { documents, loading } = useGetDocuments();

    // 3. Защита: Ако няма токен, пренасочваме към логин
    useEffect(() => {
        if (!token) {
            navigate({ to: "/login" });
        }
    }, [token, navigate]);

    // Докато трае проверката или пренасочването
    if (!token) return null;

    // 4. Важно: Докато данните се зареждат от API-то, показваме Spinner
    if (loading) {
        return (
            <div className={DocumentsStyles.documents} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Spinner size="3" />
            </div>
        );
    }

    // Ако няма документи
    if (!documents || documents.length === 0) {
        return (
            <div className={DocumentsStyles.documents}>
                <h1>All Documents</h1>
                <p>Няма налични документи.</p>
                {/* Бутонът за създаване пак трябва да е тук, ако има права */}
                {(user?.roles?.includes("ADMIN") || user?.roles?.includes("AUTHOR")) && (
                    <Link to="/createDocument">
                        <button className={DocumentsStyles["create-btn"]}>Create Document</button>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className={DocumentsStyles.documents}>
            <h1>All Documents</h1>
            <div className={DocumentsStyles["documents-container"]}>
                {documents.map((document) => (
                    <Link
                        to={`/documents/${document.id}`}
                        className="RouterLink"
                        key={document.id}
                    >
                        <div className={DocumentsStyles["document-card"]}>
                            <div className={DocumentsStyles["title-author"]}>
                                <h4>{document.title || "Без заглавие"}</h4>
                                <div className={DocumentsStyles["author-date"]}>
                                    <p>{document.authorUsername || "Неизвестен автор"}</p>
                                    <p>
                                        {document.creationDate
                                            ? document.creationDate.slice(0, 10)
                                            : "Няма дата"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* Логика за правата на потребителя */}
            {(user?.roles?.includes("ADMIN") || user?.roles?.includes("AUTHOR")) && (
                <Link to="/createDocument">
                    <button className={DocumentsStyles["create-btn"]}>
                        Create Document
                    </button>
                </Link>
            )}
        </div>
    );
}