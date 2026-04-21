import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import { hasRole } from '../utils/auth';
import { 
    Calendar, User, History, Edit3, 
    MessageSquare, Send, ChevronLeft, CheckCircle2, Clock 
} from 'lucide-react';
import './DocumentView.css';

const DocumentView = () => {
    const { docId } = useParams({ from: '/documents/$docId' });
    const navigate = useNavigate();
    
    const [document, setDocument] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const isAuthorOrAdmin = hasRole('AUTHOR') || hasRole('ADMIN');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [docData, histData] = await Promise.all([
                documentService.getDocumentById(docId),
                documentService.getDocumentHistory(docId)
            ]);

            const versions = histData.versions || [];
            // Сортираме, за да сме сигурни, че най-новата е първа
            const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
            
            setDocument(docData);
            setHistory(sortedVersions);
            
            // ФИКС ЗА АВТОРА: Взимаме обекта на последната версия
            const latest = sortedVersions.length > 0 ? sortedVersions[0] : docData;
            setCurrentVersion(latest);
            setComments(latest.comments || []);
        } catch (error) {
            console.error('Грешка:', error);
        } finally {
            setIsLoading(false);
        }
    }, [docId]);

    useEffect(() => { if (docId) loadData(); }, [loadData]);

    const handleVersionSelect = async (vNum) => {
        try {
            const versionData = await documentService.getDocumentVersion(docId, vNum);
            setCurrentVersion(versionData);
            setComments(versionData.comments || []);
            setShowHistory(false);
        } catch (error) {
            alert('Грешка при превключване');
        }
    };

    if (isLoading) return <div className="loader">Зареждане...</div>;

    // КРИТИЧНА ЛОГИКА ЗА МЕТАДАННИТЕ:
    // Използваме 'currentVersion' (от таблицата с версии), а не 'document' (от основната таблица)
    const activeStatus = currentVersion?.status || 'DRAFT';
    const versionAuthor = currentVersion?.authorUsername || currentVersion?.createdByUsername || "Неизвестен";
    const versionDate = currentVersion?.createdAt || document?.creationDate;

    return (
        <div className="view-page-container">
            <div className="view-actions-bar">
                <button className="btn-back" onClick={() => navigate({ to: '/dashboard' })}>
                    <ChevronLeft size={18} /> Назад
                </button>
                <div className="btn-group">
                    <button onClick={() => setShowHistory(!showHistory)} className="btn-secondary">
                        <History size={18} /> История
                    </button>
                    {isAuthorOrAdmin && (
                        <button onClick={() => navigate({ to: `/documents/${docId}/edit` })} className="btn-primary">
                            <Edit3 size={18} /> Редактирай
                        </button>
                    )}
                </div>
            </div>

            <div className="view-main-card">
                <header className="view-header">
                    <div className="status-row">
                        <span className={`status-tag ${activeStatus.toLowerCase()}`}>
                            {activeStatus === 'APPROVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {activeStatus}
                        </span>
                        <span className="version-tag">Версия {currentVersion?.versionNumber || 1}</span>
                    </div>

                    <h1>{document.title}</h1>

                    <div className="view-meta">
                        <div className="meta-item">
                            <User size={16} />
                            {/* Показваме автора на конкретната промяна/версия */}
                            <span>Редактирано от: <strong>{versionAuthor}</strong></span>
                        </div>
                        <div className="meta-item">
                            <Calendar size={16} />
                            <span>Дата на промяна: {new Date(versionDate).toLocaleDateString('bg-BG')}</span>
                        </div>
                    </div>
                </header>

                <div className="view-content-body">
                    <div 
                        className="tiptap-content Tiptap-rendered-content"
                        dangerouslySetInnerHTML={{ __html: currentVersion?.content || document.content }} 
                    />
                </div>

                <section className="view-comments">
                    <div className="comments-header">
                        <MessageSquare size={20} />
                        <h3>Коментари ({comments.length})</h3>
                    </div>
                    <div className="comments-scroll">
                        {comments.map((c, i) => (
                            <div key={i} className="comment-bubble">
                                <strong>{c.username}</strong>
                                <p>{c.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="comment-input-area">
                        <textarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Коментар..."
                        />
                        <button onClick={() => {/* add comment logic */}}>
                            <Send size={18} />
                        </button>
                    </div>
                </section>
            </div>

            {showHistory && (
                <div className="history-overlay" onClick={() => setShowHistory(false)}>
                    <div className="history-panel" onClick={e => e.stopPropagation()}>
                        <h3>Версии</h3>
                        {history.map(v => (
                            <div 
                                key={v.versionNumber} 
                                className={`history-item ${v.versionNumber === currentVersion?.versionNumber ? 'active' : ''}`}
                                onClick={() => handleVersionSelect(v.versionNumber)}
                            >
                                <strong>Версия {v.versionNumber}</strong>
                                <p>{v.authorUsername}</p>
                                <small>{new Date(v.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentView;