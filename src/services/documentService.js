import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8080/api/v1/documents";

const getHeaders = () => {
    const token = getToken();
    if (!token) throw new Error("Сесията е изтекла. Моля, влезте отново.");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const documentService = {
    // Създаване на нов документ
    createDocument: async (documentData) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(documentData)
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("Нямате права (403 Forbidden)");
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Грешка при запис");
        }
        return response.json();
    },

    // Вземане на документ по неговото ID (за DocumentView)
    getDocumentById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Документът не беше намерен.");
        return response.json();
    },

    // Вземане на историята на версиите за конкретен документ
    getDocumentHistory: async (id) => {
        // Увери се, че твоят бекенд поддържа този ендпоинт (напр. /documents/{id}/history)
        const response = await fetch(`${API_URL}/${id}/history`, {
            method: "GET",
            headers: getHeaders()
        });

        if (!response.ok) return { versions: [] }; // Връщаме празна история при грешка
        return response.json();
    },

    // Вземане на всички документи (за списъка)
    getAllDocuments: async () => {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Грешка при зареждане на списъка.");
        return response.json();
    }
};