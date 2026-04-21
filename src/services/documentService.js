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
    // Вземане на всички документи
    getAllDocuments: async () => {
        const response = await fetch(API_URL, { headers: getHeaders() });
        if (!response.ok) throw new Error("Грешка при зареждане на списъка.");
        return response.json();
    },

    // Вземане на конкретен документ по ID
    getDocumentById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Документът не беше намерен.");
        return response.json();
    },

    // СЪЗДАВАНЕ НА НОВ ДОКУМЕНТ (Липсващата функция)
    createDocument: async (documentData) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(documentData)
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("403: Нямате права за създаване на документи.");
            throw new Error("Грешка при създаване на документа.");
        }
        return response.json();
    },

    // Вземане на историята на версиите
    getDocumentHistory: async (id) => {
        const response = await fetch(`${API_URL}/${id}/history`, { headers: getHeaders() });
        if (!response.ok) return { versions: [] };
        return response.json();
    },

    // Вземане на специфична версия
    getDocumentVersion: async (docId, versionNum) => {
        const response = await fetch(`${API_URL}/${docId}/versions/${versionNum}`, { 
            headers: getHeaders() 
        });
        if (!response.ok) throw new Error("Версията не беше намерена.");
        return response.json();
    },

    // ДОБАВЯНЕ НА КОМЕНТАР
    addComment: async (docId, versionNum, commentData) => {
        // Използваме versionNum в URL-а, за да съвпадне с логиката на контролера
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