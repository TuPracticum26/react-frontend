import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import { 
    Calendar, User, History, ChevronLeft, CheckCircle2, Clock, X 
} from 'lucide-react';
import DocumentComments from './DocumentComments';
import './DocumentView.css';

const DocumentView = () => {
    const { docId, versionId: urlVersionNumber } = useParams({ strict: false });
    const navigate = useNavigate();
    
    const [document, setDocument] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [history, setHistory] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [docData, histData] = await Promise.all([
                documentService.getDocumentById(docId),
                documentService.getDocumentHistory(docId)
            ]);

            const versions = histData.versions || [];
            const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
            
            setDocument(docData);
            setHistory(sorted);

            // Ако в URL няма номер, взимаме най-новата (първата в сортирания списък)
            const targetVersionNum = urlVersionNumber || (sorted.length > 0 ? sorted[0].versionNumber : null);

            if (targetVersionNum) {
                const fullVersion = await documentService.getDocumentVersion(docId, targetVersionNum);
                setCurrentVersion(fullVersion);
                setComments(fullVersion.comments || []);
            } else {
                // Фолбек, ако изобщо няма версии
                setCurrentVersion(docData);
                setComments([]);
            }
        } catch (err) {
            console.error("Грешка:", err);
        } finally {
            setIsLoading(false);
        }
    }, [docId, urlVersionNumber]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const displayData = useMemo(() => {
        const active = currentVersion || document;
        return {
            title: document?.title || "Зареждане...",
            content: active?.content || "",
            status: active?.status || 'DRAFT',
            author: active?.authorUsername || active?.createdByUsername || "Неизвестен",
            date: active?.createdAt || active?.creationDate,
            versionNum: active?.versionNumber || 1
        };
    }, [currentVersion, document]);

    if (isLoading && !document) return <div className="loader">Зареждане...</div>;

    return (
        <div className="view-page-container">
            <div className="view-actions-bar">
                <button className="btn-back" onClick={() => navigate({ to: '/dashboard' })}>
                    <ChevronLeft size={18} /> Назад
                </button>
                <button onClick={() => setShowHistory(!showHistory)} className="btn-secondary">
                    <History size={18} /> История
                </button>
            </div>

            <div className="document-layout-wrapper">
                <div className="view-main-card">
                    <header className="view-header">
                        <div className="status-row">
                            <span className={`status-tag ${displayData.status.toLowerCase()}`}>
                                {displayData.status === 'APPROVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                {displayData.status}
                            </span>
                            <span className="version-tag">Версия {displayData.versionNum}</span>
                        </div>
                        <h1>{displayData.title}</h1>
                        <div className="view-meta">
                            <div className="meta-item"><User size={16} /> Автор: <strong>{displayData.author}</strong></div>
                            <div className="meta-item"><Calendar size={16} /> Дата: {new Date(displayData.date).toLocaleDateString('bg-BG')}</div>
                        </div>
                    </header>

                    <div className="view-content-body">
                        <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: displayData.content }} />
                    </div>

                    {currentVersion && (
                        <DocumentComments 
                            key={currentVersion.id} 
                            docId={docId}
                            versionDbId={currentVersion.versionNumber} // Тук ТРЯБВА да е .id (напр. 101), а не .versionNumber
                            initialComments={comments}
                            versionNumber={currentVersion.versionNumber} 
                        />
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

                {showHistory && (
                    <aside className="history-sidebar-inline">
                        <div className="history-list">
                            {history.map(v => (
                                <div 
                                    key={v.id} 
                                    className={`history-item-card ${String(v.versionNumber) === String(displayData.versionNum) ? 'active' : ''}`}
                                    onClick={() => navigate({ to: `/documents/${docId}/versions/${v.versionNumber}` })}
                                >
                                    <div className="item-top">
                                        <span>Версия {v.versionNumber}</span>
                                        <span className="v-status">{v.status}</span>
                                    </div>
                                    <div className="item-meta">{new Date(v.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
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