import { useState } from 'react';
import { documentService } from '../services/documentService';

export default function useCreateDocument() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const createDocument = async (data, token) => {
        setIsSaving(true);
        setError(null);
        try {
            const result = await documentService.createDocument(data, token);
            setIsSaving(false);
            return result;
        } catch (err) {
            setError(err.message);
            setIsSaving(false);
            throw err; // Прехвърляме грешката към компонента
        }
    };

    return { createDocument, isSaving, error };
}