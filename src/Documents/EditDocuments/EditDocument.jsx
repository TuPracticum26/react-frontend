import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../../services/documentService';
import EditDocumentsStyles from './EditorStyles.module.css';

const EditDocument = () => {
    const tokenData = localStorage.getItem("token");
    const userData = tokenData ? JSON.parse(tokenData) : null;
    const token = userData?.token;


    const docId = useParams({ from: '/documents/$docId/edit' }).docId;
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            navigate({ to: '/login' });
        }
    }, [token]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Редактирайте съдържанието на документа тук...',
            }),
        ],
        content: '',
    });

    useEffect(() => {
        return () => {
            editor?.destroy();
            console.log("Editor destroyed");
        };
    }, [editor]);

    useEffect(() => {
        if (token) {
            loadDocument();
        }
    }, [docId, token, editor]);

    const loadDocument = async () => {
        try {
            const doc = await documentService.getDocumentById(docId);
            setTitle(doc.title);
            editor.commands.setContent('<p>' + doc.content + '</p>');
            editor?.commands.setContent(doc.content || '<p></p>');
        } catch (error) {
            console.error('Грешка при зареждане:', error);
            setError('Неуспешно зареждане на документа.');
        }
    };

    const MenuBar = ({ editor }) => {
        if (!editor) return null;

        return (
            <div className={EditDocumentsStyles["menu-bar"]}>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? EditDocumentsStyles['is-active'] : ''}
                >
                    H1
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? EditDocumentsStyles['is-active'] : ''}
                >
                    H2
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? EditDocumentsStyles['is-active'] : ''}
                >
                    H3
                </button>

                <div className={EditDocumentsStyles["separator"]}></div>

                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? EditDocumentsStyles['is-active'] : ''}
                ><strong>B</strong></button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? EditDocumentsStyles['is-active'] : ''}
                ><em>I</em></button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? EditDocumentsStyles['is-active'] : ''}
                ><s>S</s></button>

                <div className={EditDocumentsStyles["separator"]}></div>

                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? EditDocumentsStyles['is-active'] : ''}
                >• List</button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? EditDocumentsStyles['is-active'] : ''}
                >1. List</button>

                <div className={EditDocumentsStyles["separator"]}></div>
                
                <button type="button" onClick={() => editor.chain().focus().undo().run()}>↶</button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()}>↷</button>
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Моля, въведете заглавие');
            return;
        }

        const content = editor?.getHTML();
        if (!content || content === '') {
            setError('Моля, въведете съдържание');
            return;
        }

        // setIsLoading(true);
        setError('');
        //createNewVersion: async (docId, verId, title, content)
        try {
            const docHistory = await documentService.getDocumentHistory(docId);
            const newVersionId = docHistory.versions.length + 1;
            await documentService.createNewVersion(docId, newVersionId, title, content);
            alert('Документът е обновен успешно! Нова версия е създадена.');
            navigate({ to: `/documents/${docId}` });
        } catch (error) {
            console.error('Грешка:', error);
            setError(`Грешка при запис: ${error.message}`);
        }
    };

    if (!token) return null;

    return (
        <div className={EditDocumentsStyles["document-editor-container"]}>
            <div className={EditDocumentsStyles["document-editor"]}>
                <h1>✏️ Редактиране на документ</h1>
                <form onSubmit={(e) => {handleSubmit(e)}}>

                <div className={EditDocumentsStyles["title-field"]}>
                    <label>Заглавие</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Заглавие на документа"
                        disabled={isLoading}
                        required
                        />
                </div>

                <MenuBar editor={editor}/>
                <EditorContent editor={editor} style={{border: "1px solid black"}}/>

                {error && <div className={EditDocumentsStyles["error-message"]} style={{color: 'red', marginTop: '10px'}}>{error}</div>}

                <div className={EditDocumentsStyles["action-buttons"]}>
                    <button className={EditDocumentsStyles["btn-submit"]} onClick={(e) => handleSubmit(e)} disabled={isLoading}>
                        {isLoading ? '⏳ Запазване...' : '💾 Запази като нова версия'}
                    </button>
                    <button className={EditDocumentsStyles["btn-cancel"]} onClick={() => navigate({ to: `/documents/${docId}` })} disabled={isLoading}>
                    Ｘ Cancel
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default EditDocument;