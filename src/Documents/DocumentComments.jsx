import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { documentService } from '../services/documentService';
import './DocumentView.css';

const DocumentComments = ({ docId, versionDbId, initialComments = [], versionNumber }) => {
    const [newComment, setNewComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [localComments, setLocalComments] = useState(initialComments || []);

    useEffect(() => {
        setLocalComments(initialComments || []);
    }, [initialComments]);

    const handleSend = async () => {
        if (!newComment.trim() || isSending) return;
        
        setIsSending(true);
        try {
            // Пращаме обекта към API-то
            const response = await documentService.addComment(docId, versionDbId, {
                comment: newComment // Ключът ТРЯБВА да съвпада с името на полето в Java Entity-то
            });
            
            // Ако всичко е наред, добавяме новия коментар към списъка на екрана
            // Използваме response (това, което базата ни връща), за да сме сигурни
            const addedComment = typeof response === 'string' ? response : (response.comment || newComment);
            
            setLocalComments(prev => [...prev, addedComment]);
            setNewComment(''); // Изчистваме полето
        } catch (err) {
            alert("Неуспешно записване: " + err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section className="view-comments">
            <div className="comments-header">
                <MessageSquare size={22} />
                <h3>Коментари ({localComments.length})</h3>
            </div>
            
            <div className="comments-scroll">
                {localComments.length === 0 ? (
                    <p className="no-comments">Няма коментари към версия {versionNumber}.</p>
                ) : (
                    localComments.map((c, i) => (
                        <div key={i} className="comment-bubble">
                            <p className="comment-text">
                                {/* ТЪЙ КАТО 'c' Е СТРИНГ, ГО ИЗПИСВАМЕ ДИРЕКТНО: */}
                                {typeof c === 'string' ? c : (c.comment || c.text || "Празен коментар")}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="comment-input-area">
                <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Напишете коментар..."
                    disabled={isSending}
                />
                <button 
                    className="send-btn"
                    onClick={handleSend}
                    disabled={isSending || !newComment.trim()}
                >
                    <Send size={20} />
                </button>
            </div>
        </section>
    );
};

export default DocumentComments;