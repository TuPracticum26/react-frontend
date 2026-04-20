const API_URL = "http://localhost:8080/api/documents";

export const documentService = {
    // Вземане на всички документи
    getAllDocuments: async (token) => {
        const response = await fetch(API_URL, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        return response.json();
    },

    // СЪЗДАВАНЕ НА НОВ ДОКУМЕНТ
    createDocument: async (documentData, token) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(documentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Грешка при запис в базата");
        }
        return response.json();
    }
};