/**
 * CampusSync - TaskDetailModal Component (Progressive Disclosure)
 * Displays detailed description, threaded comments, file attachments, and print export mode.
 */

export function TaskDetailModal({ 
    task, 
    comments, 
    columns,
    currentUser,
    onClose, 
    onAddComment, 
    onMoveTask,
    onDeleteTask,
    onPrintDetailed,
    onOpenDocument
}) {
    if (!task) return null;

    const [commentText, setCommentText] = React.useState('');

    const attachmentsList = (task.attachments && task.attachments.length > 0)
        ? task.attachments
        : [
            { id: 'brief_' + task.id, name: 'Proposal_Brief_' + task.id + '.pdf', size: '245 KB', type: 'application/pdf', icon: '📕' },
            { id: 'signoff_' + task.id, name: 'Department_Signoff_Form.docx', size: '112 KB', type: 'application/docx', icon: '📝' }
        ];

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onAddComment(task.id, commentText.trim());
        setCommentText('');
    };

    // Determine next stage
    const currentColIndex = columns.findIndex(c => c.id === task.column_id);
    const nextColumn = currentColIndex < columns.length - 1 ? columns[currentColIndex + 1] : null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-content modal-lg" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span 
                            className="dept-tag" 
                            style={{ backgroundColor: task.creator_dept_color || '#3B82F6' }}
                        >
                            {task.creator_dept_code || 'CS'}
                        </span>

                        {task.target_department_id && (
                            <span className="target-badge">
                                🔒 Restricted to: {task.target_dept_name || task.target_dept_code || 'ACC'}
                            </span>
                        )}

                        <h2 className="modal-title">{task.title}</h2>
                    </div>

                    <button 
                        className="modal-close-btn no-print" 
                        onClick={onClose}
                        title="Close details"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {/* Metadata strip */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem', color: '#64748B' }}>
                        <div>
                            <strong>Created By: </strong> 
                            {task.creator_name} ({task.creator_role})
                        </div>
                        <div>
                            <strong>Due Date: </strong> 
                            📅 {task.due_date || '2026-08-15'}
                        </div>
                        <div>
                            <strong>Current Stage: </strong> 
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>{task.column_title || task.status || 'Proposed'}</span>
                        </div>
                        <div>
                            <strong>Last Moved By: </strong> 
                            <em>{task.last_moved_by_name || task.creator_name}</em>
                        </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="modal-section">
                        <span className="section-label">Detailed Proposal Description</span>
                        <div className="task-detail-description">
                            {task.description || 'No detailed description provided.'}
                        </div>
                    </div>

                    {/* Progressive Disclosure: Attached Documents */}
                    <div className="modal-section">
                        <span className="section-label">
                            Attached Documentation ({attachmentsList.length}) • Click any file to open & read
                        </span>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {attachmentsList.map((att, idx) => (
                                <div 
                                    key={att.id || idx}
                                    className="task-attachment-clickable-pill"
                                    onClick={() => onOpenDocument && onOpenDocument(att, task)}
                                    title={`Click to open, read or download ${att.name}`}
                                >
                                    <span style={{ fontSize: '1.15rem' }}>{att.icon || '📄'}</span>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <span>{att.name}</span>
                                            <span className="attachment-open-tag">👁️ Open</span>
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                            {att.size} • Verified Specification
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Threaded Comments Section */}
                    <div className="modal-section">
                        <span className="section-label">
                            Threaded Department Comments ({comments ? comments.length : 0})
                        </span>

                        <div className="comments-list">
                            {comments && comments.length > 0 ? (
                                comments.map(c => (
                                    <div key={c.id} className="comment-item">
                                        <div className="comment-header">
                                            <div className="comment-author">
                                                <span 
                                                    className="avatar-badge" 
                                                    style={{ width: '22px', height: '22px', fontSize: '0.65rem', backgroundColor: c.dept_color || '#3B82F6' }}
                                                >
                                                    {c.avatar_initials || 'CS'}
                                                </span>
                                                <span>{c.user_name || 'Faculty Member'}</span>
                                                <span style={{ fontWeight: 400, color: '#64748B', fontSize: '0.75rem' }}>
                                                    ({c.user_role || 'Professor'})
                                                </span>
                                            </div>
                                            <span className="comment-time">
                                                {c.timestamp || 'Just now'}
                                            </span>
                                        </div>
                                        <div className="comment-text">
                                            {c.text}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic', padding: '0.5rem 0' }}>
                                    No comments yet. Start the academic review discussion below.
                                </div>
                            )}
                        </div>

                        {/* Add Comment Form */}
                        <form className="comment-form no-print" onSubmit={handleSubmitComment}>
                            <input 
                                type="text"
                                className="comment-input"
                                placeholder={`Add comment as ${currentUser ? currentUser.name : 'Faculty Member'}...`}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Modal Footer (Plain-English Action Buttons) */}
                <div className="modal-footer no-print">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => onPrintDetailed ? onPrintDetailed(task) : window.print()}
                        title="Print individual detailed proposal dossier to serif PDF format"
                    >
                        <span>🖨️ Print Detailed View</span>
                    </button>

                    <button 
                        className="btn btn-outline" 
                        style={{ color: '#DC2626', borderColor: '#FECACA' }}
                        onClick={() => onDeleteTask(task.id)}
                        title="Permanently remove this task proposal"
                    >
                        <span>Delete Proposal</span>
                    </button>

                    {nextColumn && (
                        <button 
                            className="btn btn-primary" 
                            onClick={() => onMoveTask(task, nextColumn.id)}
                            title={`Advance this proposal to the ${nextColumn.title} column`}
                        >
                            <span>Advance to {nextColumn.title} →</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
