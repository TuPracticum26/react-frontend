import { useState } from "react";

export default function useUpdateDocument() {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateDocument = async (documentId, updates) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/v1/documents/${documentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            return data;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateDocument, isUpdating };
}