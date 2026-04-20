import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import { hasRole } from '../utils/auth'; // Използваме новия хелпър
import './DocumentView.css';

const DocumentView = () => {
    // Увери се, че тук името '$docId' съвпада с дефиницията в route файла
    const { docId } = useParams({ from: '/documents/$docId' });
    const navigate = useNavigate();
    
    const [document, setDocument] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [history, setHistory] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Вече не ни трябва ръчно setState за ролята, ползваме hasRole() директно
    const canReview = hasRole('ADMIN') || hasRole('REVIEWER');
    const isAuthorOrAdmin = hasRole('AUTHOR') || hasRole('ADMIN');

    useEffect(() => {
        if (docId) {
            loadData();
        }
    }, [docId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [doc, hist] = await Promise.all([
                documentService.getDocumentById(docId),
                documentService.getDocumentHistory(docId)
            ]);
            setDocument(doc);
            setCurrentVersion(doc);
            setHistory(hist);
        } catch (error) {
            console.error('Грешка при зареждане:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ... handleApprove, handleReject и handleAddComment остават същите ...

    if (isLoading) return <div className="loading-container"><h3>Зареждане на документ...</h3></div>;
    if (!document) return (
        <div className="error-container">
            <h3>Документът не е намерен</h3>
            <button onClick={() => navigate({ to: '/documents' })}>Назад към списъка</button>
        </div>
    );

    return (
        <div className="document-view-container">
            <div className="document-view-card">
                <header className="doc-header">
                    <h1>{document.title}</h1>
                    <div className="document-meta">
                        <span>👤 Автор: <strong>{document.authorUsername}</strong></span>
                        <span>📅 Дата: {new Date(document.creationDate).toLocaleDateString()}</span>
                        {currentVersion && <span>🔢 Версия: {currentVersion.versionNumber || 1}</span>}
                    </div>
                </header>

                <div className="action-bar">
                    <button onClick={() => setShowHistory(!showHistory)} className="btn-secondary">
                        📜 {showHistory ? 'Скрий историята' : 'История на версиите'}
                    </button>
                    
                    {isAuthorOrAdmin && (
                        <button 
                            onClick={() => navigate({ to: `/documents/${docId}/edit` })} 
                            className="btn-primary"
                        >
                            ✏️ Редактирай
                        </button>
                    )}
                </div>

                {/* История на версиите */}
                {showHistory && history?.versions && (
                    <section className="history-panel">
                        <h3>📚 История на промените</h3>
                        <div className="version-list">
                            {history.versions.map((version) => (
                                <div key={version.versionNumber} className="version-card">
                                    <span>Версия {version.versionNumber} ({version.status})</span>
                                    <div className="version-btns">
                                        <button onClick={() => loadVersion(version.versionNumber)}>👁️</button>
                                        {canReview && version.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleApprove(version.versionNumber)} className="text-success">✅</button>
                                                <button onClick={() => handleReject(version.versionNumber)} className="text-danger">❌</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <article className="document-content-area">
                    <div 
                        className="content-render"
                        dangerouslySetInnerHTML={{ __html: currentVersion?.content || document.content }} 
                    />
                </article>

                {/* Секция Коментари */}
                <section className="comments-area">
                    <h3>💬 Коментари към версията</h3>
                    <div className="comments-wrapper">
                        {comments.length > 0 ? comments.map((c, i) => (
                            <div key={i} className="comment-bubble">{c}</div>
                        )) : <p className="no-comments">Няма коментари за тази версия.</p>}
                    </div>
                    <div className="comment-input-group">
                        <textarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Напишете коментар..."
                        />
                        <button onClick={handleAddComment} disabled={!newComment.trim()}>Изпрати</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocumentView;