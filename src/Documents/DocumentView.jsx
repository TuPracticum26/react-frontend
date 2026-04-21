import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../services/documentService';
import { Calendar, User, History, ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import DocumentComments from './DocumentComments';
import './DocumentView.css';

const DocumentView = () => {
    const { docId, versionId: urlVersionNumber } = useParams({ strict: false });
    const navigate = useNavigate();
    
    const [document, setDocument] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [history, setHistory] = useState([]);
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

            const targetVersionNum = urlVersionNumber || (sorted.length > 0 ? sorted[0].versionNumber : null);

            if (targetVersionNum) {
                const fullVersion = await documentService.getDocumentVersion(docId, targetVersionNum);
                setCurrentVersion(fullVersion);
            }
        } catch (err) {
            console.error("Грешка:", err);
        } finally {
            setIsLoading(false);
        }
    }, [docId, urlVersionNumber]);

    useEffect(() => { loadData(); }, [loadData]);

    const displayData = useMemo(() => {
        if (!document) return null;
        const active = currentVersion || document;
        return {
            title: document.title,
            content: active.content || "",
            status: active.status || 'DRAFT',
            author: active.createdByUsername || active.authorUsername || "Неизвестен",
            date: active.createdAt || active.creationDate,
            versionNum: active.versionNumber || 1,
            dbId: active.id 
        };
    }, [currentVersion, document]);

    if (isLoading && !document) return <div className="loader">Зареждане...</div>;
    if (!displayData) return <div>Документът липсва.</div>;

    return (
        <div className="view-page-container">
            <div className="view-actions-bar">
                <button className="btn-back" onClick={() => navigate({ to: '/dashboard' })}>
                    <ChevronLeft size={18} /> Назад
                </button>
                <button onClick={() => setShowHistory(!showHistory)} className="btn-secondary">
                    <History size={18} /> {showHistory ? "Скрий история" : "История"}
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
                            <div className="meta-item"><User size={16} /> <strong>{displayData.author}</strong></div>
                            <div className="meta-item"><Calendar size={16} /> {new Date(displayData.date).toLocaleDateString('bg-BG')}</div>
                        </div>
                    </header>

                    <div className="view-content-body">
                        <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: displayData.content }} />
                    </div>

                    {currentVersion && (
                        <DocumentComments 
                            key={displayData.versionNum} 
                            docId={docId}
                            versionDbId={displayData.versionNum} // Използваме номера за по-добра съвместимост с контролера
                            initialComments={currentVersion.comments || []}
                            versionNumber={displayData.versionNum}
                        />
                    )}
                </div>

                {showHistory && (
                    <aside className="history-sidebar-inline">
                        <h3>История</h3>
                        <div className="history-list">
                            {history.map(v => (
                                <div 
                                    key={v.id} 
                                    className={`history-item-card ${Number(v.versionNumber) === Number(displayData.versionNum) ? 'active' : ''}`}
                                    onClick={() => navigate({ to: `/documents/${docId}/versions/${v.versionNumber}` })}
                                >
                                    <strong>Версия {v.versionNumber}</strong>
                                    <small>{new Date(v.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default DocumentView;