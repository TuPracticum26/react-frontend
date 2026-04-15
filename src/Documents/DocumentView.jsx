import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import './DocumentView.css';

const DocumentView = () => {
    const { docId } = useParams({ from: '/documents/$docId' });
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [history, setHistory] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState('AUTHOR'); // Вземете от auth context

    useEffect(() => {
        loadDocument();
        loadHistory();
    }, [docId]);

    const loadDocument = async () => {
        try {
            const doc = await documentService.getDocumentById(docId);
            setDocument(doc);
            setCurrentVersion(doc);
        } catch (error) {
            console.error('Грешка при зареждане на документ:', error);
        }
    };

    const loadHistory = async () => {
        try {
            const hist = await documentService.getDocumentHistory(docId);
            setHistory(hist);
        } catch (error) {
            console.error('Грешка при зареждане на история:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadVersion = async (versionNumber) => {
        try {
            const version = await documentService.getDocumentVersionByNumber(docId, versionNumber);
            setCurrentVersion(version);
            // Зареждане на коментарите за тази версия
            if (version.id) {
                const versionComments = await documentService.getVersionComments(docId, version.id);
                setComments(versionComments);
            }
        } catch (error) {
            console.error('Грешка при зареждане на версия:', error);
        }
    };

    const handleApprove = async (versionNumber) => {
        if (window.confirm(`Сигурни ли сте, че искате да одобрите версия ${versionNumber}?`)) {
            try {
                await documentService.approveVersion(docId, versionNumber);
                alert('Версията е одобрена успешно!');
                loadHistory(); // Презареждане на историята
            } catch (error) {
                console.error('Грешка при одобряване:', error);
                alert('Грешка при одобряване на версията');
            }
        }
    };

    const handleReject = async (versionNumber) => {
        if (window.confirm(`Сигурни ли сте, че искате да отхвърлите версия ${versionNumber}?`)) {
            try {
                await documentService.rejectVersion(docId, versionNumber);
                alert('Версията е отхвърлена');
                loadHistory();
            } catch (error) {
                console.error('Грешка при отхвърляне:', error);
                alert('Грешка при отхвърляне на версията');
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const versionId = currentVersion?.id;
            if (!versionId) return;

            await documentService.postComment(docId, versionId, newComment);
            setNewComment('');
            // Презареждане на коментарите
            const updatedComments = await documentService.getVersionComments(docId, versionId);
            setComments(updatedComments);
        } catch (error) {
            console.error('Грешка при добавяне на коментар:', error);
            alert('Грешка при добавяне на коментар');
        }
    };

    if (isLoading) return <div className="loading">Зареждане...</div>;
    if (!document) return <div className="error">Документът не е намерен</div>;

    return (
        <div className="document-view-container">
            <div className="document-view">
                <h1>{document.title}</h1>

                <div className="document-meta">
                    <p>👤 Автор: {document.authorUsername}</p>
                    <p>📅 Създаден: {new Date(document.creationDate).toLocaleString()}</p>
                    {currentVersion && (
                        <p>🔢 Текуща версия: {currentVersion.versionNumber || 1}</p>
                    )}
                </div>

                <div className="action-buttons">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="btn-history"
                    >
                        📜 История на версиите
                    </button>
                    <button
                        onClick={() => navigate({ to: `/documents/${docId}/edit` })}
                        className="btn-edit"
                    >
                        ✏️ Редактиране
                    </button>
                </div>

                {showHistory && history && (
                    <div className="history-section">
                        <h3>📚 История на версиите</h3>
                        <div className="version-timeline">
                            {history.versions?.map((version) => (
                                <div key={version.versionNumber} className="version-item">
                                    <div className="version-header">
                                        <strong>Версия {version.versionNumber}</strong>
                                        <span className={`status ${version.status?.toLowerCase()}`}>
                                            {version.status}
                                        </span>
                                    </div>
                                    <div className="version-info">
                                        <small>Създадена от: {version.createdBy}</small>
                                        <small>на: {new Date(version.createdAt).toLocaleString()}</small>
                                    </div>
                                    <div className="version-actions">
                                        <button
                                            onClick={() => loadVersion(version.versionNumber)}
                                            className="btn-view"
                                        >
                                            👁️ Преглед
                                        </button>
                                        {(userRole === 'ADMIN' || userRole === 'REVIEWER') && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(version.versionNumber)}
                                                    className="btn-approve"
                                                >
                                                    ✅ Одобри
                                                </button>
                                                <button
                                                    onClick={() => handleReject(version.versionNumber)}
                                                    className="btn-reject"
                                                >
                                                    ❌ Отхвърли
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="document-content">
                    <h3>📄 Съдържание:</h3>
                    <div className="content-body"
                         dangerouslySetInnerHTML={{ __html: currentVersion?.content || document.content }}
                    />
                </div>

                {/* Коментари */}
                <div className="comments-section">
                    <h3>💬 Коментари</h3>
                    <div className="comments-list">
                        {comments.map((comment, idx) => (
                            <div key={idx} className="comment-item">
                                <p>{comment}</p>
                            </div>
                        ))}
                    </div>

                    <div className="add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Добавете коментар за тази версия..."
                            rows="3"
                        />
                        <button onClick={handleAddComment} className="btn-comment">
                            Добави коментар
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => navigate({ to: '/' })}
                    className="btn-back"
                >
                    ← Назад
                </button>
            </div>
        </div>
    );
};

export default DocumentView;