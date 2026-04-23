import DocumentsStyles from "./Documents.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getUser, getToken } from "../utils/auth"; 
import { Spinner } from "@radix-ui/themes";

export default function Documents() {
    const navigate = useNavigate();
    
    const user = getUser();
    const token = getToken();
    const { documents, loading } = useGetDocuments();

    useEffect(() => {
        if (!token) {
            alert("You must be logged in to view documents.");
            navigate({ to: "/login" });
        }
    }, [token, navigate]);

    if (!token) return null;

    if (loading) {
        return (
            <div className={DocumentsStyles.documents} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Spinner size="3" />
            </div>
        );
    }

    if (!documents || documents.length === 0) {
        return (
            <div className={DocumentsStyles.documents}>
                <h1>All Documents</h1>
                <p>Няма налични документи.</p>
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
                        to="/documents/$docId"
                        params={{ docId: document.id.toString() }}
                        className={DocumentsStyles["document-card-link"]} 
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