import { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';
import './DocumentView.css';

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
        <div className="comments-section">
            <div className="comments-header">
                <MessageSquare size={20} />
                <h3>Коментари ({comments.length}) за Версия {versionNumber}</h3>
            </div>

            {error && <div className="comment-error"><AlertCircle size={16} /> {error}</div>}

            <div className="comments-list">
                {comments.map((c, idx) => {
                    // Гъвкава логика за текст: ако c е обект, взима .comment, ако е низ - взима него
                    const text = typeof c === 'object' ? (c.comment || c.text) : c;
                    return (
                        <div key={idx} className="comment-card">
                            <span className="comment-author">{c.authorUsername || "Потребител"}</span>
                            <p className="comment-text">{text}</p>
                        </div>
                    );
                })}
            </div>

            <form className="comment-form" onSubmit={handleSubmit}>
                <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишете коментар..."
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