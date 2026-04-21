import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8080/api/v1/documents";

const getHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const documentService = {
    getAllDocuments: async () => {
        const response = await fetch(API_URL, { headers: getHeaders() });
        if (!response.ok) throw new Error("Грешка при зареждане на списъка.");
        return response.json();
    },

    getDocumentById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Документът не беше намерен.");
        return response.json();
    },

    getDocumentHistory: async (id) => {
        const response = await fetch(`${API_URL}/${id}/history`, { headers: getHeaders() });
        if (!response.ok) return { versions: [] };
        return response.json();
    },

    getDocumentVersion: async (docId, versionNum) => {
        const response = await fetch(`${API_URL}/${docId}/versions/${versionNum}`, { 
            headers: getHeaders() 
        });
        if (!response.ok) throw new Error("Версията не беше намерена.");
        return response.json();
    },

    addComment: async (docId, versionNum, commentData) => {
        // Използваме versionNum, защото бекендът ти често е конфигуриран да търси по номер в масива
        const response = await fetch(`${API_URL}/${docId}/versions/${versionNum}/comments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("403: Нямате права за коментиране.");
            throw new Error("Грешка при запис на коментара.");
        }
        return response.json();
    }
};