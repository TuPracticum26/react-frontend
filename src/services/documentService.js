import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8080/api/v1/documents";

// Помощна функция за генериране на хедъри с токен
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
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Грешка при зареждане на списъка.");
        return response.json();
    },

    // Създаване на нов документ
    createDocument: async (documentData) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(documentData)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Нямате права за създаване на документи (403 Forbidden)");
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Грешка при запис в базата");
        }
        return response.json();
    }, // Тук липсваше затварящата скоба

    // Вземане на документ по неговото ID
    getDocumentById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Документът не беше намерен.");
        return response.json();
    },

    // Вземане на историята на версиите
    getDocumentHistory: async (id) => {
        const response = await fetch(`${API_URL}/${id}/history`, {
            method: "GET",
            headers: getHeaders()
        });
        if (!response.ok) return { versions: [] };
        return response.json();
    },

    // Вземане на специфична версия
    getDocumentVersion: async (docId, versionDbId) => {
        const response = await fetch(`${API_URL}/${docId}/versions/${versionDbId}`, {
            method: "GET",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Версията не беше намерена.");
        return response.json();
    },

    // Добавяне на коментар към конкретна версия
    addComment: async (docId, versionDbId, commentData) => {
        const response = await fetch(`${API_URL}/${docId}/versions/${versionDbId}/comments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("403: Нямате права или грешен URL");
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Грешка при запис");
        }
        
        // ВАЖНО: Ако бекендът връща празно тяло (ResponseEntity.ok().build()), 
        // използвай: return response.status === 200 ? { success: true } : response.json();
        return response.json();
    }
};