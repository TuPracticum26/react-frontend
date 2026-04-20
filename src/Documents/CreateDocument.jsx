import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import useCreateDocument from '../hooks/useCreateDocument';
import './EditorStyles.css';

const CreateDocument = () => {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const { createDocument, isSaving, error: apiError } = useCreateDocument();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Напишете съдържанието тук...' }),
    ],
    content: '',
  });

  const handleSubmit = async () => {
    // 1. Валидация
    if (!title.trim() || !editor?.getText().trim()) {
      setValidationError('Заглавието и съдържанието са задължителни!');
      return;
    }

    const documentData = {
      title: title.trim(),
      content: editor.getHTML(),
      plainText: editor.getText()
    };

    try {
      // 2. Изпращане (токена се взима автоматично в сервиза)
      await createDocument(documentData);
      
      alert('✅ Документът е запазен успешно!');
      setTitle('');
      editor?.commands.clearContent();
      setValidationError('');
    } catch (err) {
      console.error("Save error:", err.message);
    }
  };

  return (
    <div className="document-editor-container">
        <h1>📄 Нов документ</h1>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Заглавие..." 
        />
        
        <div className="editor-wrapper" style={{ border: '1px solid #ccc', margin: '10px 0' }}>
          <EditorContent editor={editor} />
        </div>

        {(validationError || apiError) && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            ⚠️ {validationError || apiError}
          </div>
        )}

        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Запазване...' : '💾 Запази'}
        </button>
    </div>
  );
};

export default CreateDocument;