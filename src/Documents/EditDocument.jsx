import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import './EditorStyles.css';

const EditDocument = () => {
    const { id } = useParams({ from: '/documents/$id/edit' });
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Редактирайте съдържанието на документа тук...',
            }),
        ],
        content: '<p></p>',
    });

    useEffect(() => {
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        try {
            const doc = await documentService.getDocumentById(id);
            setTitle(doc.title);
            editor?.commands.setContent(doc.content || '<p></p>');
        } catch (error) {
            console.error('Грешка при зареждане:', error);
        }
    };

    const MenuBar = () => {
        if (!editor) return null;

        return (
            <div className="menu-bar">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    <strong>B</strong>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    <em>I</em>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    <s>S</s>
                </button>
                <span className="separator"></span>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                    H2
                </button>
                <span className="separator"></span>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    • Списък
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                    1. Списък
                </button>
                <span className="separator"></span>
                <button onClick={() => editor.chain().focus().undo().run()}>
                    ↩️ Отмени
                </button>
                <button onClick={() => editor.chain().focus().redo().run()}>
                    ↪️ Повтори
                </button>
            </div>
        );
    };

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

        try {
            // Създаване на нова версия
            await documentService.createNewVersion(id, content, comment);

            alert('Документът е обновен успешно! Нова версия е създадена.');
            navigate({ to: `/documents/${id}` });
        } catch (error) {
            console.error('Грешка:', error);
            alert(`Грешка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="document-editor-container">
            <div className="document-editor">
                <h1>✏️ Редактиране на документ</h1>

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

                {error && <div className="error-message">{error}</div>}

                <div className="action-buttons">
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳ Запазване...' : '💾 Запази като нова версия'}
                    </button>
                    <button
                        className="btn-cancel"
                        onClick={() => navigate({ to: `/documents/${id}` })}
                        disabled={isLoading}
                    >
                        ❌ Отказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDocument;