import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import './EditorStyles.css';

const EditDocument = () => {
    // 1. Взимаме токена от localStorage
    const tokenData = localStorage.getItem("token");
    const userData = tokenData ? JSON.parse(tokenData) : null;
    const token = userData?.token;

    const { id } = useParams({ from: '/documents/$id/edit' });
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 2. Redirect ако не е логнат
    useEffect(() => {
        if (!token) {
            navigate({ to: '/login' });
        }
    }, [token, navigate]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Редактирайте съдържанието на документа тук...',
            }),
        ],
        content: '<p></p>',
    });

    // Важно: Почистване на редактора при демонтиране на компонента
    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    useEffect(() => {
        if (token) {
            loadDocument();
        }
    }, [id, token]);

    const loadDocument = async () => {
        try {
            // Подаваме токена на услугата
            const doc = await documentService.getDocumentById(id, token);
            setTitle(doc.title);
            editor?.commands.setContent(doc.content || '<p></p>');
        } catch (error) {
            console.error('Грешка при зареждане:', error);
            setError('Неуспешно зареждане на документа.');
        }
    };

    // ... MenuBar остава същият ...

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Моля, въведете заглавие');
            return;
        }

        const content = editor?.getHTML();
        if (!content || content === '<p></p>') {
            setError('Моля, въведете съдържание');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 3. Подаваме токена при създаване на версия
            await documentService.createNewVersion(id, content, comment, token);

            alert('Документът е обновен успешно! Нова версия е създадена.');
            navigate({ to: `/documents/${id}` });
        } catch (error) {
            console.error('Грешка:', error);
            setError(`Грешка при запис: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className="document-editor-container">
            {/* Твоят JSX код остава същият */}
            <div className="document-editor">
                <h1>✏️ Редактиране на документ</h1>
                {/* ... останалата част от формата ... */}
                
                <div className="title-field">
                    <label>Заглавие</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Заглавие на документа"
                        disabled={isLoading}
                    />
                </div>

                <div className="comment-field">
                    <label>Коментар за тази версия (опционално)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Какво променихте в тази версия?"
                        rows="3"
                        disabled={isLoading}
                    />
                </div>

                <MenuBar />
                <EditorContent editor={editor} />

                {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}

                <div className="action-buttons">
                    <button className="btn-submit" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? '⏳ Запазване...' : '💾 Запази като нова версия'}
                    </button>
                    <button className="btn-cancel" onClick={() => navigate({ to: `/documents/${id}` })} disabled={isLoading}>
                        ❌ Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDocument;