import { useState, useEffect } from "react";

export default function useGetDocuments() {
    const [documents, setDocument] = useState([]);

    useEffect(() => {
        async function testApi() {
            const response = await fetch("/api/v1/documents");
            const data = await response.json();
            console.log(data);
            setDocument(data);
            return data;
        }
        testApi();
    }, [])

    return documents;
}