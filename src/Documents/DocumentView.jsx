// Добави тези икони към импортите си
import { Calendar, User, FileText, History, Edit3, MessageSquare, Send } from 'lucide-react';

// Вътре в рендер логиката:
return (
    <div className="document-view-container">
        <div className="document-view-card">
            <header className="doc-header">
                <div className="header-main">
                    <div className="title-section">
                        <h1>{document.title}</h1>
                        <div className="doc-badges">
                            <span className={`status-badge ${currentVersion?.status?.toLowerCase()}`}>
                                {currentVersion?.status || 'PUBLISHED'}
                            </span>
                            <span className="version-tag">v{currentVersion?.versionNumber || 1}</span>
                        </div>
                    </div>
                    
                    <div className="header-actions">
                        <button onClick={() => setShowHistory(!showHistory)} className="btn-icon-text secondary">
                            <History size={18} /> {showHistory ? 'Скрий историята' : 'История'}
                        </button>
                        {isAuthorOrAdmin && (
                            <button onClick={() => navigate({ to: `/documents/${docId}/edit` })} className="btn-icon-text primary">
                                <Edit3 size={18} /> Нова версия
                            </button>
                        )}
                    </div>
                </div>

                <div className="document-meta-bar">
                    <div className="meta-item">
                        <User size={16} /> <span>Автор: <strong>{document.authorUsername}</strong></span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={16} /> <span>Създаден на: {new Date(document.creationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                        <FileText size={16} /> <span>ID: {docId}</span>
                    </div>
                </div>
            </header>

            {/* Историята вече е по-компактна като страничен панел или падащо меню */}
            {showHistory && history?.versions && (
                <aside className="history-drawer">
                    <h3>📚 Хронология на промените</h3>
                    <div className="version-timeline">
                        {history.versions.map((v) => (
                            <div key={v.versionNumber} 
                                 className={`version-step ${currentVersion?.versionNumber === v.versionNumber ? 'active' : ''}`}
                                 onClick={() => loadVersion(v.versionNumber)}>
                                <div className="step-number">{v.versionNumber}</div>
                                <div className="step-content">
                                    <span className={`mini-status ${v.status.toLowerCase()}`}>{v.status}</span>
                                    <small>{new Date(v.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            )}

            {/* ЕТО ТУК Е ПРОМЯНАТА: Съдържанието вече е върху бяло "платно" */}
            <main className="document-paper-wrapper">
                <article className="document-paper Tiptap-rendered-content">
                    <div 
                        className="content-render"
                        dangerouslySetInnerHTML={{ __html: currentVersion?.content || document.content }} 
                    />
                </article>
            </main>

            <section className="comments-layout">
                <div className="comments-header">
                    <MessageSquare size={20} /> <h3>Коментари</h3>
                </div>
                <div className="comments-scroll-area">
                    {comments.length > 0 ? comments.map((c, i) => (
                        <div key={i} className="comment-card">
                            <div className="comment-user">
                                <div className="user-avatar">{c.username?.charAt(0) || 'U'}</div>
                                <strong>{c.username || 'Потребител'}</strong>
                            </div>
                            <p className="comment-body">{c.text || c}</p>
                        </div>
                    )) : <p className="empty-state">Няма коментари за тази версия.</p>}
                </div>
                
                <div className="comment-box">
                    <textarea 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Напишете бележка..."
                    />
                    <button onClick={handleAddComment} disabled={!newComment.trim()} className="btn-send-comment">
                        <Send size={18} />
                    </button>
                </div>
            </section>
        </div>
    </div>
);