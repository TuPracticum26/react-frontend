import { useState, useEffect } from "react";

export default function useGetDocuments() {
    const [documents, setDocument] = useState([]); // ← вече е масив

    useEffect(() => {
        async function getDocuments() {
            try {
                const response = await fetch("/api/v1/documents");
                const data = await response.json();

                // Важно: Проверка дали data е масив
                if (Array.isArray(data)) {
                    setDocument(data);
                } else {
                    console.error("API не върна масив:", data);
                    setDocument([]); // ← винаги сетваме масив
                }
            } catch (error) {
                console.error("Грешка при зареждане:", error);
                setDocument([]); // ← при грешка също масив
            }
        }
        getDocuments();
    }, [])

    return documents; // ← винаги връща масив (поне празен)
}