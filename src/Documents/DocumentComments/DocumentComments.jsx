import { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';
import DocumentViewStyles from '../DocumentView/DocumentView.module.css';

const DocumentComments = ({ docId, versionDbId, initialComments = [], versionNumber }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setComments(initialComments);
        setError(null);
    }, [initialComments, versionDbId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await documentService.addComment(docId, versionDbId, { comment: newComment.trim() });
            setComments(prev => [...prev, result]);
            setNewComment('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={DocumentViewStyles["comments-section"]}>
            <div className={DocumentViewStyles["comments-header"]}>
                <MessageSquare size={20} />
                <h3>Comments ({comments.length}) on Version {versionNumber}</h3>
            </div>

            {error && <div className={DocumentViewStyles["comment-error"]}><AlertCircle size={16} /> {error}</div>}

            <div className={DocumentViewStyles["comments-list"]}>
                {comments.map((c, idx) => {
                    // Гъвкава логика за текст: ако c е обект, взима .comment, ако е низ - взима него
                    const text = typeof c === 'object' ? (c.comment || c.text) : c;
                    return (
                        <div key={idx} className={DocumentViewStyles["comment-card"]}>
                            
                            <p className={DocumentViewStyles["comment-text"]}>{text}</p>
                        </div>
                    );
                })}
            </div>

            <form className={DocumentViewStyles["comment-form"]} onSubmit={handleSubmit}>
                <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                    disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting || !newComment.trim()}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default DocumentComments;