import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { documentService } from '../../services/documentService';
import { Calendar, User, History, ClipboardPlus ,ChevronLeft, CheckCircle2, Clock, X } from 'lucide-react';
import { getUser } from '../../utils/auth';
import DocumentComments from '../DocumentComments/DocumentComments';
import DocumentViewStyles from './DocumentView.module.css';

const DocumentView = () => {
    const { docId, versionId: urlVersionNumber } = useParams({ strict: false });
    const navigate = useNavigate();

    const user = getUser();
    
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
            documentId: document.id,
            documentTitle: document.title,
            title: active.title,
            content: active.content || "",
            status: active.status || 'DRAFT',
            author: active.createdByUsername || active.authorUsername || "Unknown",
            date: active.createdAt || active.creationDate,
            versionNum: active.versionNumber || 1,
            dbId: active.id 
        };
    }, [currentVersion, document]);

    if (isLoading && !document) return <div className={DocumentViewStyles["loader"]}>Loading...</div>;
    if (!displayData) return <div>Document missing.</div>;

    return (
        <div className={DocumentViewStyles["view-page-container"]}>
            <div className={DocumentViewStyles["view-actions-bar"]}>
                <button className={DocumentViewStyles["btn-back"]} onClick={() => navigate({ to: '/documents' })}>
                    <ChevronLeft size={18} /> Back
                </button>
                <div className={DocumentViewStyles["version-actions-separator"]}>
                <button onClick={() => navigate({ to: `/documents/${docId}/edit` })} className={DocumentViewStyles["btn-secondary"]}>
                    <ClipboardPlus size={18} /> Create Version
                </button>
                <button onClick={() => setShowHistory(!showHistory)} className={DocumentViewStyles["btn-secondary"]}>
                    <History size={18} /> {showHistory ? "Hide history" : "History"}
                </button>
                </div>
            </div>

            <div className={DocumentViewStyles["document-layout-wrapper"]}>
                <div className={DocumentViewStyles["view-main-card"]}>
                    <header className={DocumentViewStyles["view-header"]}>
                        <div className={DocumentViewStyles["status-row"]}>
                            <span className={`${DocumentViewStyles['status-tag']} ${DocumentViewStyles[`${displayData.status.toLowerCase()}`]}`}>
                                {displayData.status === 'APPROVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                {displayData.status}
                            </span>
                            <span className={DocumentViewStyles["version-tag"]}>Version {displayData.versionNum}</span>
                            <span className={DocumentViewStyles["version-tag"]}>{displayData.title}</span>
                        </div>
                        <h1>{displayData.documentTitle}</h1>
                        <div className={DocumentViewStyles["view-meta"]}>
                            <div className={DocumentViewStyles["meta-item"]}><User size={16} /> <strong>{displayData.author}</strong></div>
                            <div className={DocumentViewStyles["meta-item"]}><Calendar size={16} /> {new Date(displayData.date).toLocaleDateString('bg-BG')}</div>
                        </div>
                        {user?.roles?.includes("REVIEWER") || user?.roles?.includes("ADMIN") && displayData.status === 'PENDING' && (
                        <div className={DocumentViewStyles["reviewer-actions"]}>
                            <button onClick={() => {documentService.approveVersion(displayData.documentId, displayData.versionNum); window.location.reload() }} className={`${DocumentViewStyles["reviewer-actions-approve-btn"]} ${DocumentViewStyles["reviewer-btn"]}`}>Approve</button>
                            <button onClick={() => {documentService.rejectVersion(displayData.documentId, displayData.versionNum); window.location.reload()}} className={`${DocumentViewStyles["reviewer-actions-reject-btn"]} ${DocumentViewStyles["reviewer-btn"]}`}>Reject</button>
                        </div>)}
                    </header>

                    <div className={DocumentViewStyles["view-content-body"]}>
                        <div className={DocumentViewStyles["tiptap-content"]}dangerouslySetInnerHTML={{ __html: displayData.content }} />
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
                    <aside className={DocumentViewStyles["history-sidebar-inline"]}>
                        <div className={DocumentViewStyles["history-sidebar-header"]}>
                            <h3>Version history</h3>
                            <button className={DocumentViewStyles["close-sidebar"]}onClick={() => setShowHistory(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={DocumentViewStyles["history-list"]}>
                            {history.map(v => (
                                <div 
                                    key={v.id} 
                                    className={`${DocumentViewStyles['history-item-card']} ${DocumentViewStyles[`${Number(v.versionNumber) === Number(displayData.versionNum) ? 'active' : ''}`]}`}
                                    onClick={() => navigate({ to: `/documents/${docId}/versions/${v.versionNumber}` })}
                                >
                                    <div className={DocumentViewStyles["item-top"]}>
                                        <span className={DocumentViewStyles["v-num"]}>Version {v.versionNumber}</span>
                                        <span className={DocumentViewStyles["v-num"]}>{v.title}</span>
                                        <span className={`${DocumentViewStyles['v-status-mini']} ${DocumentViewStyles[`${v.status.toLowerCase()}`]}`}>
                                            {v.status}
                                        </span>
                                    </div>
                                    <div className={DocumentViewStyles["item-bottom"]}>
                                        <span className={DocumentViewStyles["item-date"]}>{new Date(v.createdAt).toLocaleDateString('bg-BG')}</span>
                                    </div>
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