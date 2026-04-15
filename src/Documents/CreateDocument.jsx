import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import './EditorStyles.css';

const CreateDocument = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Напишете съдържанието на документа тук...',
      }),
    ],
    content: '<p></p>',
  });

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="menu-bar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Удебелен (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Курсив (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Зачеркнат"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
          title="Код"
        >
          {'</>'}
        </button>

        <span className="separator"></span>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Заглавие 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Заглавие 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="Заглавие 3"
        >
          H3
        </button>

        <span className="separator"></span>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Неномериран списък"
        >
          • Списък
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Номериран списък"
        >
          1. Списък
        </button>

        <span className="separator"></span>



        <button
          onClick={() => editor.chain().focus().undo().run()}
          title="Отмени (Ctrl+Z)"
        >
          ↩️ Отмени
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          title="Повтори (Ctrl+Y)"
        >
          ↪️ Повтори
        </button>
      </div>
    );
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (newTitle.trim()) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Моля, въведете заглавие на документа');
      return false;
    }

    const content = editor?.getText() || '';
    if (!content.trim()) {
      setError('Моля, въведете съдържание на документа');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const html = editor.getHTML();
    const plainText = editor.getText();

    const documentData = {
      title: title.trim(),
      content: html,
      plainText: plainText,
      createdAt: new Date().toISOString(),
    };

    console.log('Документ за запазване:', documentData);

    // Тук добавете API заявка
    try {
      // const response = await api.post('/documents', documentData);
      alert('Документът е успешно запазен!');
      // Пренасочване или изчистване на формата
    } catch (error) {
      console.error('Грешка при запазване:', error);
      alert('Възникна грешка при запазване на документа');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Сигурни ли сте, че искате да откажете? Всички промени ще бъдат загубени.')) {
      setTitle('');
      editor?.commands.clearContent();
    }
  };

  return (
    <div className="document-editor-container">
      <div className="document-editor">
        <h1>📄 Създаване на нов документ</h1>

        {/* Поле за заглавие */}
        <div className="title-field">
          <label htmlFor="document-title">
            Заглавие на документа <span className="required">*</span>
          </label>
          <input
            id="document-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Въведете заглавие на документа..."
            className={error && !title.trim() ? 'error' : ''}
            autoFocus
          />
          {error && !title.trim() && <span className="error-message">{error}</span>}
        </div>

        {/* Информация за форматиране */}
        <div className="editor-info">
          <small>💡 Използвайте бутоните по-горе за форматиране на текста (Bold, Italic, Heading и др.)</small>
        </div>

        {/* Меню с инструменти */}
        <MenuBar />

        {/* Редактор за съдържание */}
        <EditorContent editor={editor} />

        {error && editor?.getText() === '' && (
          <div className="error-message content-error">{error}</div>
        )}

        {/* Бутони за действие */}
        <div className="action-buttons">
          <button className="btn-submit" onClick={handleSubmit}>
            💾 Запази документа
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            ❌ Отказ
          </button>
        </div>

        {/* Преглед на документа (опционално) */}
        {title && editor?.getText() && (
          <div className="document-preview">
            <h3>Преглед:</h3>
            <div className="preview-content">
              <h2>{title}</h2>
              <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDocument;