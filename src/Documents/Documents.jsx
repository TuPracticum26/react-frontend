import DocumentsStyles from "./Documents.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import { Link } from "@tanstack/react-router";

export default function Documents() {
    // ✅ Hook-ът е най-отгоре, без условия
    const documents = useGetDocuments();

    // ✅ Сега могат да дойдат проверките
    if (!Array.isArray(documents)) {
        return (
            <div className={DocumentsStyles.documents}>
                <h1>All Documents</h1>
                <div className={DocumentsStyles.error}>
                    Грешка при зареждане на документите
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
            <Link to="/createDocument">
                <button>Create Document</button>
            </Link>
        </div>
    );
}