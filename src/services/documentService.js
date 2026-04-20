import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8080/api/v1/documents";

export const documentService = {
    createDocument: async (documentData) => {
        const token = getToken(); // Вземаме токена автоматично

        if (!token) {
            throw new Error("Сесията е изтекла. Моля, влезте отново.");
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(documentData)
        });

        if (!response.ok) {
            // Ако получим 403, хвърляме специфична грешка
            if (response.status === 403) {
                throw new Error("Нямате права за създаване на документи (403 Forbidden)");
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Грешка при запис в базата");
        }

        return response.json();
    }
};