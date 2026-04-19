import DocumentsStyles from "./Documents.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function Documents() {
    const navigate = useNavigate();

    // 1. Извличаме токена (същата логика като в Sidebar/Header)
    const tokenData = localStorage.getItem("token");
    const userData = tokenData ? JSON.parse(tokenData) : null;
    const token = userData?.token;

    // 2. Подаваме токена на хука (увери се, че хукът useGetDocuments го приема)
    const documents = useGetDocuments(token);

    // 3. Защита: Ако няма токен, пренасочваме към логин
    useEffect(() => {
        if (!token) {
            navigate({ to: "/login" });
        }
    }, [token, navigate]);

    // Ако все още нямаме токен, не рендираме нищо, докато трае пренасочването
    if (!token) return null;

    // Проверка за правилно зареден масив
    if (!Array.isArray(documents)) {
        return (
            <div className={DocumentsStyles.documents}>
                <h1>All Documents</h1>
                <div className={DocumentsStyles.error}>
                    Грешка при зареждане на документите или липса на права.
                </div>
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
            
            {/* Бутон за създаване, често скрит за READER роля */}
            {userData?.user?.roles?.includes("ADMIN") || userData?.user?.roles?.includes("AUTHOR") ? (
                <Link to="/createDocument">
                    <button className={DocumentsStyles["create-btn"]}>
                        Create Document
                    </button>
                </Link>
            ) : null}
        </div>
    );
}