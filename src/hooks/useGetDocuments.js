import { useState, useEffect } from "react";

export default function useGetDocuments() {
    const [documents, setDocument] = useState([]);

    useEffect(() => {
        async function getDocuments() {
            const response = await fetch("/api/v1/documents");
            const data = await response.json();
            setDocument(data);
            return data;
        }
        getDocuments();
    }, [])

    return documents;
}