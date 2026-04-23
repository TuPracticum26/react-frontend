import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";

export default function useGetDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        async function getDocuments() {
            try {
                setLoading(true);
                const response = await fetch("/api/v1/documents", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 403) {
                    logout();
                    alert("Your session has expired. Please log in again.");
                    window.location.href = "/login";
                }
                if (!response.ok) throw new Error(`Error: ${response.status}`);

                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setDocuments(data);
                } else if (data?.content && Array.isArray(data.content)) {
                    setDocuments(data.content);
                } else {
                    setDocuments([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        }

        getDocuments();
    }, []);

    return { documents, loading };
}