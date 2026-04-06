import DocumentsStyles from "./Documents.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import { Link } from "@tanstack/react-router";

export default function Documents() {
    const documents = useGetDocuments();
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
                                <h4>{document.title}</h4>
                                <div className={DocumentsStyles["author-date"]}>
                                    <p>{document.authorUsername}</p>
                                    <p>{document.creationDate.slice(0, 10)}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
