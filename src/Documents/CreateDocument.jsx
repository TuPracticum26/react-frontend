import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import useCreateDocument from '../hooks/useCreateDocument';
import styles from './EditorStyles.module.css'; 

const EDITOR_EXTENSIONS = [
  StarterKit,
  Placeholder.configure({ 
    placeholder: 'Започнете да пишете съдържанието тук...',
  }),
];


const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className={styles["menu-bar"]}>
      {/* --- ЗАГЛАВИЯ --- */}
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? styles['is-active'] : ''}
      >
        H1
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? styles['is-active'] : ''}
      >
        H2
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? styles['is-active'] : ''}
      >
        H3
      </button>

      <div className={styles["separator"]}></div>

      {/* --- ОСНОВНИ СТИЛОВЕ --- */}
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles['is-active'] : ''}
      ><strong>B</strong></button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles['is-active'] : ''}
      ><em>I</em></button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles['is-active'] : ''}
      ><s>S</s></button>

      <div className={styles["separator"]}></div>

      {/* --- СПИСЪЦИ --- */}
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? styles['is-active'] : ''}
      >• List</button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? styles['is-active'] : ''}
      >1. List</button>

      <div className={styles["separator"]}></div>
      
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
    <div className={styles["document-editor-container"]}>
      <div className={styles["document-card"]}>
        <header className={styles["editor-header"]}>
          <h1>📄 Нов документ</h1>
        </header>
        
        <div className={styles["title-field"]}>
          <label>Заглавие на документа <span className={styles["required"]}>*</span></label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Въведете заглавие..." 
            className={validationError && !title ? styles["error"] : ""}
          />
        </div>

        <div className={styles["editor-wrapper"]}>
          <MenuBar editor={editor} />
          <div className={styles["tiptap-content"]}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {(validationError || apiError) && (
          <span className={styles["error-message"]}>
            ⚠️ {validationError || apiError}
          </span>
        )}

        <div className={styles["action-buttons"]}>
          <button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className={styles["btn-submit"]}
          >
            {isSaving ? 'Запазване...' : '💾 Запази документа'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;