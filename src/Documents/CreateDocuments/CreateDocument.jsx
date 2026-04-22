import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import useCreateDocument from '../../hooks/useCreateDocument';
import EditDocumentsStyles from '../EditDocuments/EditorStyles.module.css'; 

const EDITOR_EXTENSIONS = [
  StarterKit,
  Placeholder.configure({ 
    placeholder: 'Започнете да пишете съдържанието тук...',
  }),
];


const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className={EditDocumentsStyles["menu-bar"]}>
      {/* --- ЗАГЛАВИЯ --- */}
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

      {/* --- ОСНОВНИ СТИЛОВЕ --- */}
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

      {/* --- СПИСЪЦИ --- */}
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

const CreateDocument = () => {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const { createDocument, isSaving, error: apiError } = useCreateDocument();

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: '',
    autofocus: 'end', 
  });

  const handleSubmit = async () => {
    if (!title.trim() || editor?.isEmpty) {
      setValidationError('Заглавието и съдържанието са задължителни!');
      return;
    }

    try {
      await createDocument({ title: title.trim(), content: editor.getHTML() });
      alert('✅ Документът е запазен успешно!');
      setTitle('');
      editor?.commands.clearContent();
      setValidationError('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={EditDocumentsStyles["document-editor-container"]}>
      <div className={EditDocumentsStyles["document-card"]}>
        <header className={EditDocumentsStyles["editor-header"]}>
          <h1>📄 Нов документ</h1>
        </header>
        
        <div className={EditDocumentsStyles["title-field"]}>
          <label>Заглавие на документа <span className={EditDocumentsStyles["required"]}>*</span></label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Въведете заглавие..." 
            className={validationError && !title ? EditDocumentsStyles["error"] : ""}
          />
        </div>

        <div className={EditDocumentsStyles["editor-wrapper"]}>
          <MenuBar editor={editor} />
          <div className={EditDocumentsStyles["tiptap-content"]}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {(validationError || apiError) && (
          <span className={EditDocumentsStyles["error-message"]}>
            ⚠️ {validationError || apiError}
          </span>
        )}

        <div className={EditDocumentsStyles["action-buttons"]}>
          <button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className={EditDocumentsStyles["btn-submit"]}
          >
            {isSaving ? 'Запазване...' : '💾 Запази документа'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;