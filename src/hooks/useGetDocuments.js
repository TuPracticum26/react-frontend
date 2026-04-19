import { useState, useEffect } from "react";

export default function useGetDocuments() {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));

        if (!token || !token.token) {
            console.error("Няма валиден токен в localStorage");
            setDocuments([]);
            return;
        }

        async function getDocuments() {
            try {
                const response = await fetch("/api/v1/documents", {
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error(`Request failed ${response.status}:`, text);
                    setDocuments([]);
                    return;
                }

                const data = await response.json();
                setDocuments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Грешка при зареждане:", error);
                setDocuments([]);
            }
        }
        getDocuments();
    }, []);

    return documents;
}
